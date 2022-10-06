import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserModel } from './auth.models';
import {Model} from "mongoose";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel("User") private authModel : Model<UserModel>
  ){}
 
  async createUser(user: CreateAuthDto) : Promise<{message : string ; id: string}>  {
    try {
      const newUser = new this.authModel({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: await bcrypt.hash(user.password,10)
      })
      const registeredUser = await newUser.save();
      return {
        message: "User Registered Successfully",
        id: registeredUser._id
      };

    } catch(err) {
      if(err.message.includes('email')){
        throw new HttpException("Email Already Registered", HttpStatus.BAD_REQUEST)
      } else {
        throw new Error("Something went wrong")
      }
    }
  }

  async loginUser({ email, password }: CreateAuthDto) {
    try {
      const isExists = await this.authModel.findOne({ email });

      if (!isExists) {
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);    
      }
      const matchpassword = await bcrypt.compare(password, isExists.password);
      if (!matchpassword) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);    
    }
      return isExists

    } catch (err) {
        throw new Error("Something went wrong")
    }
  }
}
