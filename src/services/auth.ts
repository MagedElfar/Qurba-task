import UserServices from "./user";
import {setError} from "./../utils/error-format";
import Token from "../middleware/token";
import Password from "../utils/password";

interface ILogin{
    password:string,
    email:string
}

interface ISignup{
    fullName:string,
    password:string,
    email:string,
    cuisines?:string
}

export default class AuthServices{
    userService:UserServices;
    token:Token;

    constructor() {
        this.userService = new UserServices();
        this.token = new Token("5h");
    }
    
    async login({email , password}:ILogin):Promise<object> | never {
        try {
            const user = await this.userService.findOne({email});

            const pass = Password.getInstance();

            if(!user) throw setError(400 , "Invalid Email or Password");

            const isMatched = await pass?.checkPassword(password , user.password);

            if(!isMatched) throw setError(400 , "Invalid Email or Password")

            const {password:p , ...others} = user            

            const token = this.token.generateToken({id:user._id})
            
            return {
                user:others,
                token
            }
        } catch (error) {
            throw error
        } 
    }

    async signup({email , password , fullName , cuisines}:ISignup):Promise<object> | never {
        try {
            let user = await this.userService.findOne({email})
            
            if(user) throw setError(400 , "email is already exist");

            user = await this.userService.create({email , password , fullName , cuisines})


            const token = this.token.generateToken({id:user._id})

            const {password:pass , ...others} = user;

            return {
                user:others,
                token
            }
        } catch (error) {
            throw error
        }
    }
}