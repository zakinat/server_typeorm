import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, ManyToMany } from "typeorm";
import { UsersEntity, SharedProp } from ".";


@Entity({name: 'posts'})
export class PostsEntity extends SharedProp{

    constructor(
        title: string,
        body: string,
        userId: string
    ){
        super()
        this.title= title
        this.body= body
        this.userId= userId
        
        
    }

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    title: string;

    @Column({type: 'text'})
    body: string;
    
    @Column({name: 'user_id', nullable: false})
    userId: string;

    @ManyToOne(()=>UsersEntity, (user: UsersEntity)=> user.posts)
    @JoinColumn({name: 'user_id'})
    user: UsersEntity
}