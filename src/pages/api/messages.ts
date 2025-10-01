// src/pages/api/messages.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const { id } = req.query;

      if (id) {
        // Fetch single message
        const msg = await prisma.message.findUnique({
          where: { id: Number(id) },
        });

        if (!msg) {
          return res.status(404).json({ error: "Message not found" });
        }

        return res.json(msg);
      } else {
        // Fetch all messages
        const msgs = await prisma.message.findMany({
          orderBy: { createdAt: "asc" },
        });

        return res.json(msgs);
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
          type,
          views: views ?? 0,
          createdAt: createdAt ? new Date(createdAt) : new Date(),
          reactMindBlown: reactMindBlown ?? 0,
          reactFire: reactFire ?? 0,
          reactHundred: reactHundred ?? 0,
          reactFlex: reactFlex ?? 0,
          reactDash: reactDash ?? 0,
          reactHeart: reactHeart ?? 0,
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

      const msg = await prisma.message.update({
        where: { id: Number(id) },
        data: {
          author,
          content,
          mediaUrl,
          type,
          views,
          createdAt: createdAt ? new Date(createdAt) : undefined,
          reactMindBlown: reactMindBlown ?? 0,
          reactFire: reactFire ?? 0,
          reactHundred: reactHundred ?? 0,
          reactFlex: reactFlex ?? 0,
          reactDash: reactDash ?? 0,
          reactHeart: reactHeart ?? 0,
        },
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
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
