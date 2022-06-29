import Service from "../app/service";
import RestaurantClass , {RestaurantRepository , IRestaurant} from "./../model/restaurant"
import CuisinesServices from './cuisines';
import slugify  from "slugify"
import { setError } from "../utils/error-format";
import ICuisines from "../model/cuisine";


const setQuery = (query:any) => {
    const keys: string [] = Object.keys(query)

    switch(true){
        case keys.includes("lat") && keys.includes('long'):
            return {location: {
                $near: {
                    $maxDistance: 1000,
                    $geometry: {
                        type: "Point",
                        coordinates: [+query.long, +query.lat]
                    }
                }
            }};
        case keys.includes("cuisines"):
            return { 'cuisines.cuisine': {$in: query.cuisines} }
        default:
            return {}
    }
}

export default class RestaurantServices extends Service{
    _repository:RestaurantRepository;
    constructor() {
        super()
        this._repository = new RestaurantRepository();
    }

    async findMany(query:Partial<IRestaurant>): Promise<IRestaurant []>{
        try {

            const searchQuery = setQuery(query)

            const restaurants = await this._repository.findMany(searchQuery);

            return restaurants

        } catch (error) {
            throw error
        }
    }

    async findOne(item:Partial<IRestaurant>):Promise<IRestaurant | null>{
        try {
            const restaurant = await this._repository.findOne(item);
            super.checkIfDataExists(restaurant);
            return restaurant;
        } catch (error) {
            throw error
        }
    }
    

    async create(data:any):Promise<IRestaurant> | never {
        try {
            const restaurant = new RestaurantClass(data)

            const cuisines = new CuisinesServices(data.cuisines);

            restaurant.cuisines = cuisines.createCuisines()

            return await this._repository.create(restaurant);
        } catch (error) {
            throw error;
        }
    }

    async deleteOne(id:string , userId:string):Promise<void> | never {
        try {
            const restaurant = await this._repository.findOne({_id: id})

            super.checkIfDataExists(restaurant)

            super.belongToUser(restaurant?.user! , userId)

            await this._repository.deleteOne(id)
            return;
        } catch (error) {
            throw error;
        }
    }

    async update(id:string , userId:string , data:Partial<IRestaurant>): Promise<IRestaurant> {
        try {
            const restaurant = await this._repository.findOne({_id: id})

            super.belongToUser(restaurant?.user! , userId)

            delete data['cuisines']

            if(data.name) data.slug = slugify(data.name)

            return await this._repository.update(id , data)
        } catch (error) {
            throw error
        }
    }

    async addNewCuisine(id:string , userId:string , cuisine:string): Promise<IRestaurant> {
        try {
            const restaurant = await this._repository.findOne({_id: id})

            super.checkIfDataExists(restaurant)

            super.belongToUser(restaurant?.user! , userId)

            const isCuisines = CuisinesServices.checkCuisines(restaurant?.cuisines! , cuisine);

            if(isCuisines) throw setError(400 , "Cuisine is exist")

            restaurant?.cuisines.push({cuisine})

            return await this._repository.update(id , restaurant!)
        } catch (error) {
            throw error
        }
    }

    async deleteCuisine(id:string , userId:string , cuisine:string): Promise<IRestaurant> {
        try {
            const restaurant = await this._repository.findOne({_id: id})

            super.checkIfDataExists(restaurant)

            super.belongToUser(restaurant?.user! , userId)

            const isCuisines = CuisinesServices.checkCuisines(restaurant?.cuisines! , cuisine);

            if(!isCuisines) throw setError(404 , "Cuisine is not found")

            restaurant!.cuisines= restaurant!.cuisines.filter((item:ICuisines) => item.cuisine !== cuisine)
            
            return await this._repository.update(id , restaurant!)
        } catch (error) {
            throw error
        }
    }

}
