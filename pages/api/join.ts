// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ITeam } from '../../types/iTeam';
import { IJoinRequest, IJoinResponse } from '../../types/routes/join';
import { createServer, findServer } from '../../utils/chess/server';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<IJoinResponse>
) {
  const body = req.body as IJoinRequest;
  let team : ITeam | null = null;
  if (body.serverID){
    const server = findServer(body.serverID);

    if (server && (server.teamBlack === null || server.teamWhite === null)){
      if (!server.teamBlack) team = "Blacks";
      else if (!server.teamWhite) team = "Whites";
    }
  }
  
  res.status(200).json({ team });
}
