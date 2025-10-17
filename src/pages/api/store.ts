import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const client = await clientPromise;
      const db = client.db();
      const { collection, data } = req.body;
      if (!collection || !data) {
        return res.status(400).json({ error: 'Missing collection or data' });
      }
      // If storing timesheets, upsert by userId
      if (collection === 'timesheets' && data.userId) {
        const result = await db.collection(collection).updateOne(
          { userId: data.userId },
          { $set: data },
          { upsert: true }
        );
        return res.status(200).json({ upserted: result.upsertedId || null });
      } else {
        const result = await db.collection(collection).insertOne(data);
        return res.status(201).json({ insertedId: result.insertedId });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({ error: message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
