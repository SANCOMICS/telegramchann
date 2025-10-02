// src/pages/api/messages.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const { id } = req.query;

      if (id) {
        const msg = await prisma.message.findUnique({
          where: { id: Number(id) },
        });

        if (!msg) return res.status(404).json({ error: "Message not found" });
        return res.json(msg);
      } else {
        const msgs = await prisma.message.findMany({
          orderBy: { createdAt: "asc" },
        });

        // 🔒 Ensure API always returns an array
        return res.json(msgs || []);
      }
    }

    if (req.method === "POST") {
      const {
        author,
        content,
        mediaUrl,
        type,
        views,
        createdAt,
        reactMindBlown,
        reactFire,
        reactHundred,
        reactFlex,
        reactDash,
        reactHeart,
      } = req.body;

      const msg = await prisma.message.create({
        data: {
          author,
          content,
          mediaUrl,
          type: type ?? "text",
          views: views ?? 0, // keep this, since not all models have a default
          createdAt: createdAt ? new Date(createdAt) : new Date(),

          // ✅ only set if provided, otherwise use schema defaults
          ...(reactMindBlown !== undefined && { reactMindBlown }),
          ...(reactFire !== undefined && { reactFire }),
          ...(reactHundred !== undefined && { reactHundred }),
          ...(reactFlex !== undefined && { reactFlex }),
          ...(reactDash !== undefined && { reactDash }),
          ...(reactHeart !== undefined && { reactHeart }),
        },
      });

      return res.json(msg);
    }


    if (req.method === "PATCH") {
      const {
        id,
        author,
        content,
        mediaUrl,
        type,
        views,
        createdAt,
        reactMindBlown,
        reactFire,
        reactHundred,
        reactFlex,
        reactDash,
        reactHeart,
      } = req.body;

      if (!id) return res.status(400).json({ error: "Message ID required" });

      const data: any = {};

      if (author !== undefined) data.author = author;
      if (content !== undefined) data.content = content;
      if (mediaUrl !== undefined) data.mediaUrl = mediaUrl;
      if (type !== undefined) data.type = type;
      if (views !== undefined) data.views = views;
      if (createdAt) data.createdAt = new Date(createdAt);

      // ✅ only update reactions if explicitly sent
      if (reactMindBlown !== undefined) data.reactMindBlown = reactMindBlown;
      if (reactFire !== undefined) data.reactFire = reactFire;
      if (reactHundred !== undefined) data.reactHundred = reactHundred;
      if (reactFlex !== undefined) data.reactFlex = reactFlex;
      if (reactDash !== undefined) data.reactDash = reactDash;
      if (reactHeart !== undefined) data.reactHeart = reactHeart;

      const msg = await prisma.message.update({
        where: { id: Number(id) },
        data,
      });

      return res.json(msg);
    }


    if (req.method === "DELETE") {
      const id = req.query.id || req.body.id;
      if (!id) return res.status(400).json({ error: "Message ID required" });

      await prisma.message.delete({
        where: { id: Number(id) },
      });

      return res.json({ success: true });
    }

    res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err: any) {
    console.error("❌ API error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
