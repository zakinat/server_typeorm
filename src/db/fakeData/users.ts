import {name, internet, date, random} from 'faker'
import { Repository, Connection} from 'typeorm'
import {UsersEntity, UserRole} from '../entities'
import {hash,generateJwtToken,randomTokenString} from '../../utils/crypto'

export const fakeUsers= async (connection:Connection, amount:number =50) => {
    const userRepo: Repository<UsersEntity> =connection.getRepository(UsersEntity)
    for (const _ of Array.from({length: amount})){
        const firstName= name.firstName()
        const lastName= name.lastName()
        const dateOfBirth= date.past()
        const email= internet.email()
        const password= await hash('123456')
        const role:UserRole= random.arrayElement(['admin','user'])
        const u: Partial<UsersEntity>= new UsersEntity(firstName, lastName, email, password, dateOfBirth, role)
        await userRepo.save<Partial<UsersEntity>>(u)
    }
    
}