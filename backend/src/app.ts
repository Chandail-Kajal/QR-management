/// <reference path="./types/express/index.d.ts" />
import { env } from "@/env";
import { apiResponseMiddleware, errorHandler } from "@/middlewares";
import { apiRouter } from "@/modules";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import http from "http";
import { corsConfig } from "./config/cors";
import { limiter } from "./middlewares/request-limiter";

const app: Application = express();

app.use(cors(corsConfig));

if (env.IS_PRODUCTION) {
  app.use(limiter);
}

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(apiResponseMiddleware);

app.use("/api", apiRouter);

app.use(errorHandler);

export { app };
