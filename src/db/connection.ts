import 'reflect-metadata'
import {Connection, createConnection} from 'typeorm'
import { UsersEntity, PostsEntity } from './entities'
import { fakeUsers, fakePosts } from './fakeData'
export const initDB=async ():  Promise<Connection> => {
    const entities=[UsersEntity, PostsEntity ] 
    const fakeFuncs=[fakeUsers, fakePosts]
    const con= await createConnection({
        type:'sqlite',
        database: './hapi.db',
        entities,
        logging: ['error'],
        logger: 'advanced-console'
    })
    await con.synchronize(true)
    for (const func of fakeFuncs) await func(con)

    return con
}