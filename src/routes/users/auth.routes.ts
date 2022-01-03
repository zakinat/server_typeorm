import { Connection, Repository } from 'typeorm';
import { UsersEntity } from "../../db/entities";
import * as joi from "joi"
import { ServerRoute, Request, ResponseToolkit } from '@hapi/hapi';
import {hash,generateJwtToken,randomTokenString} from '../../utils/crypto'
import { userSchemaRegister } from '../../utils/validationSchema/user.authSchema';

export const authRoutes = (con: Connection): Array<ServerRoute> => {
  const userRepo: Repository<UsersEntity> = con.getRepository(UsersEntity);
  return [
    {
      method: 'POST',
      path: '/login',
      handler: async ({ auth: { credentials } }: Request)=> {
        return {
          data:credentials,
          token: generateJwtToken(credentials),
        };
      },
      options: {
        auth: {
          strategy: 'simple',
        },
      },
    },
    {
      method: 'POST',
      path: '/register',
      
      
      handler: async ({ payload }: Request)=> {
        const {
            firstName,
            lastName,
            email,
            password,
            dateOfBirth,
          } = payload as Partial<UsersEntity>;
          const hashedPassword= await hash(password)
          const user = new UsersEntity(
            firstName,
            lastName,
            email,
            hashedPassword,
            dateOfBirth,
          );

        try {
          const oldUser= await userRepo.findOne({email})
          if (oldUser) throw Error('User already exists')
          const data =await userRepo.save(user);
          delete data.password;
          const token = generateJwtToken(user)

          return {
            data,
            token,
          };
        } catch (error) {
          return { error: error.message, };
        }
      },
      options: {
        auth: false,
        validate: {
          payload: joi.object(userSchemaRegister) as any,
          failAction: (request: Request, h: ResponseToolkit, err: Error)=> {
            throw err;
          },
          options: {
            abortEarly: false,
          },
        },
      },
    },
  ];
};