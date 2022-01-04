import {  Connection, Repository } from "typeorm";
import { UsersEntity } from "../../db/entities";
import { ResponseToolkit, ServerRoute, Request } from "hapi";

export const userRouts=(con: Connection): Array<ServerRoute>=>{
    const userRepo:Repository<UsersEntity>= con.getRepository(UsersEntity)
    return [
        {
            method: 'GET',
            path:'/users',
            handler: async (request: Request, h: ResponseToolkit, err?: Error)=>{
                const {query} =request
                let {perPage, page, ...q}= query
                let realPage:number;
                let realTake:number;

                if(perPage) realTake= +perPage
                else{
                    perPage= '10'
                    realTake= +perPage
                }

                if(page) realPage= +page === 1 ? 0: (+page-1)*realTake
                else{
                    realPage=0;
                    page='1'
                }

                const getQuery =()=> Object.keys(q).map((key:string)=> `${key}=${q[key]}`).join('&')
                const qp= getQuery().length === 0 ? '' : `&${getQuery()}`

                const findOptions={
                    take: realTake,
                    skip: realPage,
                    where: {...q}
                } 
                const findAllOptions={
                    where: {...q}
                } 
                if(!q){
                    delete findOptions.where
                    delete findAllOptions.where
                } 
                const allData= await userRepo.find(findAllOptions)
                const PagesNumbers= Math.ceil(allData.length/realTake) 

                const data= await userRepo.find(findOptions)
                return {
                    data,
                    perPage: data.length,
                    page: +page || 1,
                    next: +page < PagesNumbers ? `${process.env.API_URL}/users?perPage=${realTake}&page=${+page + 1}${qp}` : '',
                    prev: +page === 1 ? '' :`${process.env.API_URL}/users?perPage=${realTake}&page=${+page - 1}${qp}`,
                }
            },
            options:{
                auth:{
                    strategy: 'jwt'
                }
            }
        },
        {
            method: 'GET',
            path:'/users/{id}',
            handler: async (request: Request, h: ResponseToolkit, err?: Error)=>{
                const {params: {id}}= request
                const data = await userRepo.findOne(id)
                return {
                    data,
                }
            }
        },
        {
            method: 'POST',
            path:'/users',
            handler: async (request: Request, h: ResponseToolkit, err?: Error)=>{
                const {payload}= request
                const {firstName, lastName, email,password, dateOfBirth } = payload as Partial<UsersEntity>
                const u:Partial<UsersEntity>= new UsersEntity(firstName, lastName, email, password, dateOfBirth)
                const data= await userRepo.save<Partial<UsersEntity>>(u)
                return {
                    data, 
                }
            }
        },
        {
            method: 'PATCH',
            path:'/users/{id}',
            handler: async (request: Request, h: ResponseToolkit, err?: Error)=>{
                const {payload, params:{id}}= request
                const data = await userRepo.findOne(id)
                Object.keys(payload).forEach((key: string)=> data[key]= payload[key])
                await userRepo.update(id, data)
                return {
                    data,
                }
            }
        },
        {
            method: 'DELETE',
            path:'/users/{id}',
            handler: async (request: Request, h: ResponseToolkit, err?: Error)=>{
                const { params:{id}}= request
                const data = await userRepo.findOne(id)
                await userRepo.remove(data)
                return {
                    message: 'deleted',
                }
            }
        },
        
    ]
}