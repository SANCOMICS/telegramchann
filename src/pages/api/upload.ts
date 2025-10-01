// src/pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { Fields, Files, File } from "formidable";
import cloudinary from "cloudinary";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const form = formidable({ multiples: false });

  form.parse(req, async (err: any, fields: Fields, files: Files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Upload failed" });
    }

    const uploaded = files.file as File | File[] | undefined;
    const file = Array.isArray(uploaded) ? uploaded[0] : uploaded;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const result = await cloudinary.v2.uploader.upload(file.filepath, {
        folder: "telegram-clone",
        resource_type: "auto", // auto-detect image or video
      });

      return res.status(200).json({ url: result.secure_url });
    } catch (uploadErr) {
      console.error(uploadErr);
      return res.status(500).json({ error: "Cloudinary upload failed" });
    }
  });
}
