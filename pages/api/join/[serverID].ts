import type { NextApiRequest, NextApiResponse } from 'next'
import { ICreateResponse } from '../../../types/routes/create';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ICreateResponse>
) {
  const {serverID} = req.query;

  const [serverID,userID] = createServer(request.isStartingWithBlacks)

  res.status(200).json({ serverID: serverID , userID: userID});
}
