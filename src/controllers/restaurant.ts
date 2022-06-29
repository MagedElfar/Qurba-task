import Controller, { APIRoute } from "../app/controller";
import {Request , Response , NextFunction} from 'express'
import routes from "../route/restaurant";
import RestaurantServices from "./../services/restaurant"



export default class RestaurantController extends Controller{
    path: string;
    protected routes: APIRoute[];
    services: RestaurantServices;

    constructor(){
        super();
        this.path = "/restaurants";
        this.routes = routes(this);
        this.services = new RestaurantServices();
    }

    async addRestaurantHandler(req:Request , res:Response , next:NextFunction) :  Promise<void> {
        try {
            
            const _id = req.user?.id

            const restaurant = await this.services.create({user: _id , ...req.body});

            super.setResponseSuccess({res , status:200 , data:{
                restaurant
            } })

        } catch (error) {
            next(error)
        }
    };

    async getRestaurantsHandler(req:Request , res:Response , next:NextFunction) :  Promise<void> {
        try {
        
            const  restaurants = await this.services.findMany(req.query);
            
            super.setResponseSuccess({res , status:200 , data:{
                restaurants
            } })

        } catch (error) {
            next(error)
        }
    };


    async getRestaurantHandler(req:Request , res:Response , next:NextFunction) :  Promise<void> {
        try {
            const {id:_id , slug} = req.params
            
            let restaurant;

            if(_id){
                restaurant = await this.services.findOne({_id});
            } else {
                restaurant = await this.services.findOne({slug});
            }

            super.setResponseSuccess({res , status:200 , data:{
                restaurant
            } })

        } catch (error) {
            next(error)
        }
    };

    async deleteRestaurantHandler(req:Request , res:Response , next:NextFunction) :  Promise<void> {
        try {
            const {id:_id} = req.params
            const id = req.user?.id

            const restaurant = await this.services.deleteOne(_id , id!);

            super.setResponseSuccess({res , status:200 , data:{
                restaurant
            } })

        } catch (error) {
            next(error)
        }
    };


    async updateRestaurantHandler(req:Request , res:Response , next:NextFunction) :  Promise<void> {
        try {
            
            const {id:_id} = req.params
            const id = req.user?.id

            const data = req.body;

            const restaurant = await this.services.update(_id , id! , data)

            super.setResponseSuccess({res , status:200 , message:"restaurant updated successfully" , data:{restaurant}})

        } catch (error) {
            next(error)
        }
    };

    async addNewCuisineHandler(req:Request , res:Response , next:NextFunction) :  Promise<void> {
        try {
            
            const {id:_id} = req.params
            const id = req.user?.id

            const {cuisine} = req.body;

            const restaurant = await this.services.addNewCuisine(_id , id! , cuisine)

            super.setResponseSuccess({res , status:200 , message:"cuisine add successfully" , data:{restaurant}})

        } catch (error) {
            next(error)
        }
    };

    async deleteCuisineHandler(req:Request , res:Response , next:NextFunction) :  Promise<void> {
        try {
            
            const {id:_id} = req.params
            const id = req.user?.id

            const {cuisine} = req.body;

            const restaurant = await this.services.deleteCuisine(_id , id! , cuisine)

            super.setResponseSuccess({res , status:200 , message:"cuisine deleted successfully" , data:{restaurant}})

        } catch (error) {
            next(error)
        }
    };
}