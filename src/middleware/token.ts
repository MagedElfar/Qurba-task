import jwt from "jsonwebtoken";
import passport from "passport";
import {Strategy , ExtractJwt} from "passport-jwt";
import {Request , Response , NextFunction} from "express";
import {config} from "dotenv";
import {setError} from "../utils/error-format"

config();

declare global {
    namespace Express {
        interface User {
            id: string
        }
    }
}


export default class Token {
    static authStrategy: Strategy = new Strategy(
        {
            secretOrKey: process.env.TOKEN_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        },
        (payload, done) => {
            return done(null, payload);
        }
    );

    private expire: string
    constructor(expire:string = "15m"){
        this.expire = expire;
    }
    
    static authMiddleware (req:Request , res:Response , next:NextFunction)  {
        passport.authenticate("jwt", { session: false } , (error, decryptToken, jwtError) => {
            if (error || jwtError) {
                return next( setError(401 , "ACCESS_TOKEN_EXPIRED") )
            } 
            req.user = decryptToken;
            next()
        })(req, res, next);
    };

    generateToken (data:object):any{

        const token = jwt.sign(data , process.env.TOKEN_SECRET! ,{ expiresIn: this.expire});

        return token;
    }
}

const authStrategy = Token.authStrategy

passport.use(authStrategy);
