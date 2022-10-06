import { Schema,Prop,SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ProductModel = Product & Document

@Schema()
export class Product {

    @Prop({required : true})
    productName : string;

    @Prop({required : true})
    description : string;
    
    @Prop({required : true})
    quantity : number
}

export const ProductSchema = SchemaFactory.createForClass(Product)