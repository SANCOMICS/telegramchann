// src/pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { Fields, Files, File } from "formidable";
import path from "path";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // we must disable body parsing
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const uploadDir = path.join(process.cwd(), "public/uploads");
  fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({
    multiples: false,
    uploadDir,
    keepExtensions: true,
  });

  form.parse(req, (err: any, fields: Fields, files: Files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Upload failed" });
    }

    const file = files.file as File | File[];
    const f = Array.isArray(file) ? file[0] : file;

    if (!f) return res.status(400).json({ error: "No file uploaded" });

    const url = `/uploads/${path.basename(f.filepath)}`;
    return res.status(200).json({ url }); // ✅ always send response
  });
}
