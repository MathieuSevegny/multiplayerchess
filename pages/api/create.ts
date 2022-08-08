// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ICreateRequest, ICreateResponse } from '../../types/routes/create';
import { createServer } from '../../utils/chess/server';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ICreateResponse>
) {
  const serverID = createServer();

  res.status(200).json({ serverID: serverID });
}
