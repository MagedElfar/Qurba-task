import Service from "../app/service";
import {UserClass , IUser, UserRepository } from "../model/user";
import CuisinesServices from './cuisines';

export default class UserServices extends Service{
    _repository:UserRepository;
    
    constructor() {
        super()
        this._repository = new UserRepository();
    }

    async listUserWithAggregation(query:any){
        try {
            const users = await this._repository.findMany(query)

            return users
        } catch (error) {
            throw error
        }
    }

    async findOne(item:Partial<IUser>):Promise<IUser | null>{
        try {
            const user = await this._repository.findOne(item);
            return user;
        } catch (error) {
            throw error
        }
    }
    

    async create(data:any):Promise<IUser> | never {
        try {
            const user = new UserClass(data)

            if (data.cuisines) {
                const cuisines = new CuisinesServices(data.cuisines)
                user.favoriteCuisines = cuisines.createCuisines()
            }

            await user.setPassword()

            return await this._repository.create(user)
        } catch (error) {
            throw error;
        }
    }

}
