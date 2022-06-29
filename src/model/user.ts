import { Schema, model } from 'mongoose';
import Password from "../utils/password";
import BaseRepository, { Options } from "./../utils/database";
import Model from './../app/model';
import ICuisines from './cuisine';

//Create an interface representing a document in MongoDB.
export interface IUser extends Model {
    fullName:string;
    favoriteCuisines: ICuisines [];
    email:string;
    password: string;
}

//Create user Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
    fullName: {type: String , trim:true , lowercase:true , required:true},
    password: {type: String , required:true},
    email: {type: String , required:true , lowercase:true , trim:true , unique:true},
    favoriteCuisines: [
        {cuisine: {type: String , trim:true , lowercase:true } }
    ]
});

//create user model
const User = model<IUser>('user', userSchema);

export class UserClass implements IUser {
    fullName: string;
    favoriteCuisines: ICuisines[];
    email:string;
    password: string; 
    
    constructor({fullName , email , password , favoriteCuisines}: IUser){
        this.fullName = fullName;
        this.email = email;
        this.password = password,
        this.favoriteCuisines = favoriteCuisines || []
    }


    async setPassword():Promise<void> | never{
        try {
            const password = Password.getInstance()
            if(!password) return;
            
            this.password = await password.setPassword(this.password);
        } catch (error) {
            throw error
        }
    };


    getPassword():string | undefined{
        return this.password;
    }
}



export class UserRepository extends BaseRepository<IUser>{
    async findMany(query: Partial<IUser> | string , option: Options = {limit:10 , offset:0}): Promise<IUser[]> {
        try {
            let users = await User.aggregate([
                { $unwind : '$favoriteCuisines' } ,
                { $match : { 'favoriteCuisines.cuisine' : query } },
                { $project: { "password": 0 }},
                { $lookup : {
                        from : 'restaurants',
                        // uncomment these lines for left join between (users & restaurants) collection
                        // localField : '_id',
                        // foreignField : 'user',
                        "pipeline": [
                            {$unwind : '$cuisines' },
                            { $match : { 'cuisines.cuisine' : query } },
                            { $project: { "user": 1 , "name":1 , "cuisine": 1}}
                        ],
                        as : 'restaurants'
                    },
                }
            ])

            const populateQuery = [
                {
                    path: 'user',
                },
            ];

            users = await User.populate(users, [{path: "restaurants.user" , select: "email fullName favoriteCuisines"}])
    
            return users
        } catch (error) {
            throw error
        }
    }

    async findOne(query: Partial<IUser>): Promise<IUser | null> {
        try {
            const user = await User.findOne(query);

            return user?._doc;
        } catch (error) {
            throw error
        }
    }

    async create(item: IUser): Promise<IUser> {
        try {
        
            let user = new User(item);

            const newUser = await user.save();

            return newUser._doc
        } catch (error) {
            throw error
        }
        
        
    }
    
    update(id: string | number, item: IUser | Partial<IUser>): Promise<IUser> {
        throw new Error('Method not implemented.');
    }

    deleteOne(id: string | number): Promise<void> {
        throw new Error('Method not implemented.');
    }
}