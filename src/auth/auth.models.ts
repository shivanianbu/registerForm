import { Schema, Prop , SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

export type UserModel = User & Document

@Schema()
export class User {

    @Prop({required : true})
    firstName : String;

    @Prop()
    lastName : String;

    @Prop({unique : true})
    email : String;

    @Prop({required : true})
    password : string;
}

export const UserSchema = SchemaFactory.createForClass(User)