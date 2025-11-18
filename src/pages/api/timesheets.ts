import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const { userId } = req.query;
      if (!userId || typeof userId !== "string") {
        return res.status(400).json({ error: "Missing or invalid userId" });
      }
      const client = await clientPromise;
      const db = client.db();
      const doc = await db.collection("timesheets").findOne({ userId });
      return res.status(200).json(doc?.entries || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return res.status(500).json({ error: message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
