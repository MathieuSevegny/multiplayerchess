// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { Server } from 'Socket.IO'
import { ITeam } from '../../types/iTeam'
import { IJoinServerInfos } from '../../types/ws/queries'
import { findServer, getTeam } from '../../utils/chess/server'
import { createRandomKey } from '../../utils/utils'

type Data = {
  name: string
}

export default function SocketHandler(req:any, res:any) {
  if (res.socket.server.io) {
    console.log("Socket server already initialized")
  }
  else{
    const io = new Server(res.socket.server)
    res.socket.server.io = io;

    io.on('connection', socket => {
      socket.join(socket.id);
      //Joins a server
      socket.on('join',(serverInfos : IJoinServerInfos) => {
        console.log("Joining")
  
        const server = findServer(serverInfos.serverID);
  
        console.log(server)
        
        if (!server){
          return;
        }
        let team : ITeam | null = getTeam(server,serverInfos.userID);

        if (team == null) return;
  
        if (team == "Blacks") server.teamBlack!.socketID = socket.id;
        else server.teamWhite!.socketID = socket.id;
  
        io.to(socket.id).emit('boardValue', server.board);
      })
    })
  }

  
      res.end()
  }