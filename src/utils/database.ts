import {Types} from 'mongoose'

export interface Options{
    limit?: number,
    offset?: number
}

interface IWrite<T>{
    create:  (item:T) => Promise<T>;
    update:  (id:number | string , item:T | Partial<T> ) => Promise<T>;
    deleteOne:  (id:number | string) => Promise<void>;
}

interface IRead<T>{
    findMany:  (query: object , option:Options) => Promise<T[]>;
    findOne: (query: Partial<T>) => Promise<T | null>;
}


export default abstract class DBRepository <T> implements IRead<T> , IWrite<T>  {

    checkId(id: string):boolean {
        const isValid = Types.ObjectId.isValid(id);
        if(!isValid) return false
        return true
    }

    abstract findMany(query: object , option:Options):Promise<T[]>;

    abstract findOne(query: Partial<T>):Promise<T | null>;

    abstract create(item:T):Promise<T>;

    abstract update(id:number | string , item:T | Partial<T>):Promise<T>;

    abstract deleteOne(id:number | string):Promise<void>
}

 