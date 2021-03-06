import * as Hapi from '@hapi/hapi'
import { Connection } from 'typeorm';
import { Server, ServerRoute } from '@hapi/hapi';
import 'colors'
import { initDB } from './db'
import { userRouts, authRoutes } from './routes';
import { validateBasic, validateJWT } from './controllers/auth/auth.controller';
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/.env' });

const init =async ()=>{
    const server:Server= Hapi.server({
        port: 3000,
        host:'localhost',
    })


    const con: Connection =await initDB()
     console.log('DB init done')
     await server.register(require('hapi-auth-jwt2'))
     await server.register(require('@hapi/basic'))
     server.auth.strategy('simple', 'basic', {validate: validateBasic(con)})
     server.auth.strategy('jwt', 'jwt', {key: process.env.JWT_SECRET, validate: validateJWT(con) })
     //server.auth.default('jwt') and inside the routes that we dont want to hava auth we add options auth: false
     server.route([...userRouts(con), ...authRoutes(con)] as Array<ServerRoute>)

   await server.start()
   console.log('server started'.green)
}

process.on('unhandledRejection', (err)=>{
    console.log(err)
    process.exit(1)
})


init()