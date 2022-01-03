import {Column, Entity, PrimaryGeneratedColumn, OneToMany} from 'typeorm'
import { PostsEntity, SharedProp } from '.';


export type UserRole= 'admin' | 'user'


@Entity({name: 'users'})
export class UsersEntity extends SharedProp{

    constructor(
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        dateOfBirth: Date,
        role?: UserRole
    ){
        super()
        this.firstName= firstName
        this.lastName= lastName
        this.email= email
        this.password= password
        this.dateOfBirth= dateOfBirth
        this.role= role
    }


    @PrimaryGeneratedColumn()
    id:number;

    @Column({name: 'first_name', nullable: false})
    firstName:string;

    @Column({name: 'last_name', nullable: false})
    lastName:string;

    @Column({name: 'date_of_birth', nullable: true, type: 'date'})
    dateOfBirth:Date;

    @Column({unique: true, nullable:false})
    email: string

    @Column({default: 'user'})
    role: UserRole

    @Column({nullable: false, select: false})
    password: string

    @OneToMany(()=>PostsEntity, (posts: PostsEntity)=> posts.user, {onDelete:'CASCADE', onUpdate: 'CASCADE'})
    posts: Array<PostsEntity>
}

/*
export enum UserRole{
    user= 'user',
    admin= 'admin'
}

@Column({default: UserRole.user, enum: UserRole, type: 'enum'})
    type: UserRole
*/