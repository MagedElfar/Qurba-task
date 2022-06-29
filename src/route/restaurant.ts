import Controller, { APIRoute , Methods} from './../app/controller';
import {restaurantValidation , cuisineValidation , isValidate} from './../middleware/validators'

const routes: (controller:Controller) => APIRoute [] = (controller:any) => {

    const r:APIRoute [] = [
        {
            path: "",
            method: Methods.POST,
            handler: controller.addRestaurantHandler,
            localMiddleware:[restaurantValidation , isValidate],
            auth:true
        },
        {
            path: "",
            method: Methods.GET,
            handler: controller.getRestaurantsHandler,
            localMiddleware:[],
            auth:false
        },
        {
            path: "/:id",
            method: Methods.GET,
            handler: controller.getRestaurantHandler,
            localMiddleware:[],
            auth:false
        },
        {
            path: "/slug/:slug",
            method: Methods.GET,
            handler: controller.getRestaurantHandler,
            localMiddleware:[],
            auth:false
        },
        {
            path: "/:id",
            method: Methods.DELETE,
            handler: controller.deleteRestaurantHandler,
            localMiddleware:[],
            auth:true
        },
        {
            path: "/:id",
            method: Methods.PUT,
            handler: controller.updateRestaurantHandler,
            localMiddleware:[],
            auth:true
        },
        {
            path: "/cuisines/:id",
            method: Methods.PUT,
            handler: controller.addNewCuisineHandler,
            localMiddleware:[cuisineValidation , isValidate],
            auth:true
        },
        {
            path: "/del-cuisines/:id",
            method: Methods.PUT,
            handler: controller.deleteCuisineHandler,
            localMiddleware:[cuisineValidation , isValidate],
            auth:true
        }
    ]
    return r;
}


export default routes