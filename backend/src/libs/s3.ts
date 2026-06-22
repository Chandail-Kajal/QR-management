import { logger } from "@/config/logger";
import { env } from "@/env";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl as awsGetSignedUrl } from "@aws-sdk/s3-request-presigner";
import Stream, { Readable } from "stream";

export class S3Manager {
  private client: S3Client;
  private bucket: string;

  constructor(bucket: string, client: S3Client) {
    this.bucket = bucket;
    this.client = client;

    logger.info(`S3 connected to bucket: ${bucket}`);
  }

  private toPublicUrl(key: string) {
    return !env.S3_ENDPOINT
      ? `https://s3.${env.S3_REGION}.amazonaws.com/${env.S3_BUCKET_FOLDER}/${key}`
      : "";
  }

  async upload(
    key: string,
    body: Buffer | Uint8Array | string,
    contentType?: string,
  ) {
    try {
      return await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
        }),
      );
    } catch (error) {
      logger.error("Error in S3 upload:", error);
      throw error;
    }
  }

  async uploadStream(key: string, stream: Readable, contentType?: string) {
    try {
      const upload = new Upload({
        client: this.client,
        params: {
          Bucket: this.bucket,
          Key: key,
          Body: stream,
          ContentType: contentType,
        },
        queueSize: 4, // parallel parts
        partSize: 5 * 1024 * 1024, // 5MB (S3 min)
        leavePartsOnError: false,
      });

      upload.on("httpUploadProgress", (progress) => {
        logger.debug("S3 upload progress", progress);
      });

      const { Bucket, Key, ETag } = await upload.done();
      const url = this.toPublicUrl(Key!);
      return { Bucket, Key, Location: url, ETag };
    } catch (error) {
      logger.error("Error in S3 stream upload:", error);
      throw error;
    }
  }

  async download(key: string) {
    return this.client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  async delete(key: string) {
    return this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  async getObject(key: string) {
    return await this.client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  async getFile(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    try {
      const response = await this.client.send(command);
      return {
        stream: response.Body as Stream,
        contentType: response.ContentType || "application/octet-stream",
        contentLength: response.ContentLength,
        filename: key.split("/").pop(),
      };
    } catch (err) {
      throw err;
    }
  }

  async getObjectBuffer(key: string): Promise<Buffer> {
    const res = await this.getObject(key);
    const stream = res.Body as Readable;

    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }

    return Buffer.concat(chunks);
  }

  async getObjectStream(key: string): Promise<Readable> {
    try {
      const response = await this.client.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );

      if (!response.Body) {
        throw new Error(`No object body returned for key: ${key}`);
      }

      return response.Body as Readable;
    } catch (error) {
      logger.error("Error getting S3 object stream:", error);
      throw error;
    }
  }

  async getSignedUrl(key: string, expiresIn = 60): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return awsGetSignedUrl(this.client, command, {
      expiresIn, // seconds
    });
  }

  getClient() {
    return this.client;
  }

  getBucket() {
    return this.bucket;
  }
}
