import Controller, { APIRoute } from "../app/controller";
import {Request , Response , NextFunction} from 'express'
import routes from "../route/user";
import UserServices from "../services/user";



export default class UserController extends Controller{
    path: string;
    protected routes: APIRoute[];
    userServices: UserServices;
    
    constructor(){
        super();
        this.path = "/users";
        this.routes = routes(this);
        this.userServices = new UserServices();
    }

    async listUsersHandler(req:Request , res:Response , next:NextFunction) :  Promise<void> {
        try {
            
            const {cuisine} = req.query

            const users = await this.userServices.listUserWithAggregation(cuisine)

            super.setResponseSuccess({res , status:200 , data:{
                users
            } })

        } catch (error) {
            next(error)
        }
    };

    async getUserHandler(req:Request , res:Response , next:NextFunction) :  Promise<void> {
        try {
            
            const id = req.user?.id

            const user = await this.userServices.findOne({id});

            super.setResponseSuccess({res , status:200 , data:{
                user
            } })

        } catch (error) {
            next(error)
        }
    };
}