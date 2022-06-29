import bcrypt from "bcrypt";

export default class Password {

    private static instance:Password | null = null

    private constructor () {}

    async setPassword(password:string):Promise<string> | never{
        try {
            const hashedPassword = await bcrypt.hash(password , 10);
            return hashedPassword;
        } catch (error) {
            throw error
        }
    };

    async checkPassword(password:string , hashedPassword:string):Promise<boolean> | never{
        try {
            const matched =  await bcrypt.compare(password , hashedPassword);
            return matched;
        } catch (error) {
            throw error
        }
    }

    static getInstance():Password | null {
        if(!Password.instance){
            Password.instance = new Password()
        }
        return Password.instance
    }
}
