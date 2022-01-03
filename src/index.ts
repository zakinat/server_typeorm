import * as Hapi from '@hapi/hapi'
import { Connection } from 'typeorm';
import { Server, ServerRoute } from '@hapi/hapi';
import 'colors'
import { initDB } from './db'
import { userRouts } from './routes';
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/.env' });

const init =async ()=>{
    const server:Server= Hapi.server({
        port: 3000,
        host:'localhost',
    })


    const con: Connection =await initDB()
     console.log('DB init done')
     server.route([...userRouts(con)] as Array<ServerRoute>)

   await server.start()
   console.log('server started'.green)
}

process.on('unhandledRejection', (err)=>{
    console.log(err)
    process.exit(1)
})


init()