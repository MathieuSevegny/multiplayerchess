// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { Server } from 'Socket.IO'

type Data = {
  name: string
}

export default function SocketHandler(req:any, res:any) {
    if (res.socket.server.io) {
        console.log('Socket is already running')
      } else {
        console.log('Socket is initializing')
        const io = new Server(res.socket.server)
        res.socket.server.io = io
    
        io.on('connection', socket => {
          socket.on('input-change', msg => {
            socket.broadcast.emit('update-input', msg)
          })
        })
      }
      res.end()
  }