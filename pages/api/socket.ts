// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { Server } from 'Socket.IO'
import IBoard from '../../types/iBoard'
import { IMoveType } from '../../types/iMoveType'
import { ITeam } from '../../types/iTeam'
import { IJoinServerInfos } from '../../types/ws/queries'
import { findServer, removeServer } from '../../utils/chess/server'
import { createRandomKey } from '../../utils/utils'

type Data = {
  name: string
}

export default function SocketHandler(req: any, res: any) {
  if (res.socket.server.io) {
    console.log("Socket server already initialized")
  }
  else {
    const io = new Server(res.socket.server,{transports: ['websocket']})
    res.socket.server.io = io;

    io.on('connection', socket => {
      let serverID: string = socket.handshake.auth.serverID;
      let team: "b" | "w" = socket.handshake.auth.team;
      console.log("New connection : " + socket.id + " " + team)

      const server = findServer(serverID);

      if (server === null) {
        return socket.disconnect();
      }
      let alreadyConnected = false;
      if (team === "b") {
        if (server.teamBlack !== null) alreadyConnected = true;
        server.teamBlack = socket.id;
      }
      else if (team === "w"){
        if (server.teamWhite !== null) alreadyConnected = true;
        server.teamWhite = socket.id;
      } 

      socket.join(server.uuid)

      if (!alreadyConnected){
        io.to(server.uuid).emit('boardValue', server.board);
        io.to(server.uuid).emit('turnValue', server.turn);
      }

      //Changing the board.
      socket.on('changingBoard', (newBoard: IBoard, moveType: IMoveType) => {
        server.board = newBoard;
        io.to(server.uuid).emit('boardValue', server.board, moveType);
      })
      //Changing the turn.
      socket.on('changingTurn', (newTurn: ITeam) => {
        server.turn = newTurn;
        io.to(server.uuid).emit('turnValue', server.turn);
      })

      socket.on("disconnect", () => {
        console.log("disconnected");
        io.to(server.uuid).emit('disconnected');
        removeServer(server);
      });
      socket.on("ping", (count) => {
        console.log(count);
      });
    })
  }
  res.end()
}