import Controller from "../app/controller";
import AuthController from "../controllers/auth";
import UserController from "../controllers/user";
import RestaurantController from "../controllers/restaurant";

const routes:Controller [] = [
    new AuthController(),
    new UserController(),
    new RestaurantController()
]

export default routes