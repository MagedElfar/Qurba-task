export default interface Model {
    _id?: string | undefined;
    created_at?:string;
    updated_at?:string;
    [key: string]: string | any;

}