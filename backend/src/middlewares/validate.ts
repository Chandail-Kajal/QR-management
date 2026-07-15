import { Request, Response, NextFunction } from "express";
import z, { ZodError } from "zod";

const AnyObjectSchema = z.record(z.string(), z.any());
type AnyObject = z.infer<typeof AnyObjectSchema>;
export const validate =
    (schema: AnyObject, source: "body" | "query" = "body") =>
        (req: Request, res: Response, next: NextFunction) => {
            try {
                schema.parse(req[source]);

                next();
            } catch (error) {
                if (error instanceof ZodError) {
                    return res.status(400).json({
                        message: "Validation failed",
                        errors: error.flatten(),
                    });
                }

                next(error);
            }
        };