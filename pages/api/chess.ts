// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import IBoard from '../../types/iBoard';
import { StartPosition } from '../../utils/chess/startPositions'

type Data = {
  board: IBoard
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ board: StartPosition });
}