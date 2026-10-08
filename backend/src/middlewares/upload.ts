import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "downloads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        const uniqueName = `${name}-${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${ext}`;

        cb(null, uniqueName);
    },
});

export const upload = multer({
    storage,
});

export const uploadSingle = (fieldName: string) => {
    return upload.single(fieldName);
};

export const uploadMultiple = (
    fieldName: string,
    maxCount: number = 10
) => {
    return upload.array(fieldName, maxCount);
};