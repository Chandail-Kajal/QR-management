import rateLimit from "express-rate-limit"

export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    limit: 1000, 
    message: "Too many requests, please try again later.",
    standardHeaders: true, 
    legacyHeaders: false, 
})