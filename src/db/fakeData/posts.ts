import {name, lorem, random} from 'faker'
import { Connection, Repository } from 'typeorm'
import { PostsEntity, UsersEntity } from '../entities'

export const fakePosts= async (connection:Connection)=>{
    const postRepo: Repository<PostsEntity>= connection.getRepository(PostsEntity)
    const userRepo:Repository<UsersEntity>= connection.getRepository(UsersEntity)
    const users: Array<UsersEntity>= await userRepo.find()
    for (const user of users){
        const shouldCreate: boolean= random.arrayElement([false, true])
        if(shouldCreate){
            const title= name.jobTitle();
            const body=lorem.paragraphs()
            const title2= name.jobTitle();
            const body2=lorem.paragraphs()

            const p: Partial<PostsEntity>= new PostsEntity(title, body, user.id)
            const p2: Partial<PostsEntity>= new PostsEntity(title2, body2, user.id)
            await postRepo.save<Partial<PostsEntity>>(p)
            await postRepo.save<Partial<PostsEntity>>(p2)
        }
    }
}