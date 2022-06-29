import { setError } from "../utils/error-format";

export default abstract class Service{

    checkIfDataExists(data:object | null) {
        try {
            if(!data) throw setError(404 , "item not found");
        } catch (error) {
            throw error
        }
    }

    belongToUser(user:string , currentUser:string) {
        try{
            console.log(user.toString() , currentUser)
            if(user.toString() !== currentUser) throw setError (403 , "Forbidden")
        } catch(error){
            throw error
        }
    }

}