import { Connection, Repository } from "typeorm";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { UsersEntity } from "../../db/entities";
import * as  bcrypt from 'bcryptjs'


export const validateBasic= (con: Connection)=>{
    const userRepo:Repository<UsersEntity>= con.getRepository(UsersEntity)
    return async (request: Request, email: string, passwordCRD: string, h: ResponseToolkit )=>{
        try {
            const user= await userRepo.findOne({email})
            if (!user) {
                return { credentials: null, isValid: false };
              }
            const {password}= await userRepo.createQueryBuilder("user").select("user.id", `${user.id}`).addSelect("user.password").getOne()
            const isValid = await bcrypt.compare(passwordCRD, password)
            
            if (!isValid) return { credentials: null, isValid: false };
            return {
                isValid,
                credentials: user
            }
        } catch (error) {
            return { credentials: null, isValid: false };
        }
        
    }
}


export const validateJWT =(con: Connection)=>{
    const userRepo:Repository<UsersEntity>= con.getRepository(UsersEntity)

    return async ({id}:Partial<UsersEntity>, request: Request, h: ResponseToolkit)=>{
        const user:UsersEntity = await userRepo.findOne({id})
        if (!user) return {isValid: false}
        return {isValid: true}
    }

}