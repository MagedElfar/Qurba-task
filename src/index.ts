import express , {Application , urlencoded , json} from "express";
import Server from "./app/server";
import cors from "cors";
import morgan from "morgan";
import {config} from "dotenv";
import routes from "./route"
import mongoose  from 'mongoose'

config()

const app:Application = express();
const port:string = process.env.PORT || "5000";
const CONNECTION_URL:string = process.env.DB_URL!;


const server:Server = new Server(app , +port);

server.loadMiddleware([
    cors(),
    morgan("short"),
    urlencoded({extended: true}),
    json(),

])

server.setRoutes(routes);

server.errorHandler()

server.run()

mongoose.connect(CONNECTION_URL).then(() => {
    console.log("database is connected...")
}).catch((error) => {
    console.log("error:" , error.message)
});