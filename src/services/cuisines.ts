import ICuisines from "./../model/cuisine"

export default class CuisinesServices {
    private cuisines: string []
    constructor(cuisines:string) {
        this.cuisines = cuisines.split(",").map((cuisine:string) => cuisine.trim())
    }

    private flitterCuisines(): string [] {
        const cuisines = new Set(this.cuisines);        
        return [...cuisines]
    }

    createCuisines(): ICuisines [] {
        const cuisines = this.flitterCuisines().map((cuisine:string) => {
            return {cuisine}
        });

        return cuisines
    }

    static checkCuisines(cuisines:ICuisines [] , cuisine:string):boolean {
        const index:number = cuisines.findIndex((item:ICuisines) => item.cuisine === cuisine)

        if(index === -1) return false;

        return true;

    }

}
