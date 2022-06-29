import Controller, { APIRoute } from "../app/controller";
import {Request , Response , NextFunction} from "express";
import routes from "../route/auth";
import AuthServices from "../services/auth";


export default class AuthController extends Controller{
    path: string = "";
    protected routes: APIRoute[];
    authServices:AuthServices;
    
    constructor(){
        super();
        this.path = "";
        this.routes = routes(this);
        this.authServices = new AuthServices()
    }

    async loginHandler(req:Request , res:Response , next:NextFunction) :  Promise<void> {
        try {

            const data = await this.authServices.login(req.body)

            super.setResponseSuccess({res , status:200 , data})

        } catch (error) {
            next(error)
        }
    };

    async signupHandler(req:Request , res:Response , next:NextFunction) {
        try {

            const data = await this.authServices.signup(req.body);

            super.setResponseSuccess({res , status:200 , data});

        } catch (error) {
            next (error)
        }
    }
}