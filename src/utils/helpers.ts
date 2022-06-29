import jwt from "jsonwebtoken";
import {config} from "dotenv"

config();

//generateToken
const generateToken = (data:{id:number} , expiresIn:string) => jwt.sign(data , process.env.TOKEN_SECRET! ,{ expiresIn});

//generate auth tokens
const accessToken = (id:number , duration:string) => {
    try {
        const access_token = generateToken( { id } , duration);

        return access_token

    } catch (error) {
        throw error
    }
};

export {accessToken}