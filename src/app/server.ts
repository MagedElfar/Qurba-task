import  express, {Application , RequestHandler , Request , Response , Router, NextFunction} from 'express';
import path from 'path';
import { requestErrorFormat } from '../utils/error-format';
import Controller from './controller';

export default class Server {
    app:Application;
    private readonly port:number;
    private router:Router;

    constructor(app:Application , port:number = 5000){
        this.app = app;
        this.port = port;
        this.router = Router()
    }

    run():void{
        this.app.listen(this.port , () => {
            console.log(`server is running on port ${this.port}...`)
        })
    }

    loadMiddleware(middlewares: RequestHandler []):void {
        middlewares.forEach((mid:RequestHandler) => {
            this.app.use(mid)
        });

        this.app.use("/media", express.static(path.join(__dirname , ".." , "public" , "media")));

        this.app.get("/" , (req:Request , res:Response) => {
            res.send("app backend server")
        })
    }

    setRoutes(controllers:Controller []){
        controllers.forEach((controller:Controller) => {
            this.router.use(controller.path , controller.setRoutes())
        })

        this.app.use('/api' , this.router)
    }

    errorHandler():void{
        this.app.use((err:any , req:Request , res:Response , next:NextFunction) =>{
            const error = requestErrorFormat(err)
            res.status(err.status || err.response?.data.code || 500).json(error)
        }) 
    }
}