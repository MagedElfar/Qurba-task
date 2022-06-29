import { Schema, model , Types} from 'mongoose';
import BaseRepository, { Options } from "./../utils/database";
import Model from './../app/model';
import ICuisines from './cuisine';
import slugify  from "slugify"
import { setError } from '../utils/error-format';

//Create an interface representing a document in MongoDB.
interface ILocation {
    type: string,
    coordinates: number []
}

export interface IRestaurant  extends Model {
    name:string;
    slug:string;
    cuisines: ICuisines [];
    location: ILocation;
    user: string | undefined
}

//Create a Schema corresponding to the document interface.
const restaurantSchema = new Schema<IRestaurant>({
    name: {type: String , unique: true , trim: true , lowercase: true , required: true},
    slug: {type: String , trim: true , lowercase: true , required: true},
    user: {type: Schema.Types.ObjectId , ref: 'user' , required: true},
    cuisines: [
        {cuisine: {type: String , trim:true , lowercase:true} }
    ],
    location: {
        type: { type: String },
        coordinates: [Number]
    },
});

restaurantSchema.index({ location: "2dsphere" });

const Restaurant = model<IRestaurant>('restaurant', restaurantSchema);

export default class RestaurantClass implements IRestaurant {
    cuisines: ICuisines[];
    name: string;
    slug: string;
    location: ILocation;
    user: string | undefined;
    constructor({name , lat , long , cuisines , user}: IRestaurant){
        this.name = name;
        this.slug = slugify(name);
        this.location = {
            type: "Point",
            coordinates: [+long , +lat]
        };
        this.user = user,
        this.cuisines = cuisines || []
    }
}

//database logic
export class RestaurantRepository extends BaseRepository<IRestaurant>{
    
    async findMany(query: object , option: Options = {limit:10 , offset:0}): Promise<IRestaurant []> {
        try {

            const restaurants = await Restaurant.find(query);
            
            return restaurants

        } catch (error) {
            throw error
        }
    }

    async findOne(query: Partial<IRestaurant>): Promise<IRestaurant | null> {
        try {
            if (Object.keys(query).includes("_id")) {
                if(!super.checkId(query._id!)) throw setError(400 , "invalid id")
            }

            const restaurant = await Restaurant.findOne(query);

            return restaurant?._doc;
        } catch (error) {
            throw error
        }
    }

    async create(item: IRestaurant): Promise<IRestaurant> {
        try {
        
            const restaurant = new Restaurant(item);

            const newRestaurant = await restaurant.save();

            return newRestaurant._doc
        } catch (error) {
            throw error
        }
        
        
    }

    async update(id: string | number, item: IRestaurant | Partial<IRestaurant>): Promise<IRestaurant> {
        try {
            const restaurant:any = await Restaurant.findOneAndUpdate({_id:id} , item , {new:true});
            return restaurant
        } catch (error) {
            throw error
        }

    }
    async deleteOne(id: string): Promise<void> | never {
        try {

            if(!super.checkId(id)) throw setError(400 , "invalid id")

            await Restaurant.deleteOne({_id: id})
            return;
        } catch (error) {
            throw error
        }
    }
}