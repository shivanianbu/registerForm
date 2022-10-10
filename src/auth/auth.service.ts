import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserModel } from './auth.models';
import { sign } from 'jsonwebtoken';
import {Model} from "mongoose";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel("User") private authModel : Model<UserModel>
  ){}
 
  async createUser(user: CreateAuthDto) : Promise<{message : string ; id: string ; token: string}>  {
    try {
      const newUser = new this.authModel({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: await bcrypt.hash(user.password,10)
      })
      const registeredUser = await newUser.save();
      const { email } = registeredUser
      const token = await this.signPayload(email);
      return {
        message: "User Registered Successfully",
        id: registeredUser._id,
        token: token
      };

    } catch(err) {
      if(err.message.includes('email')){
        throw new HttpException("Email Already Registered", HttpStatus.BAD_REQUEST)
      } else {
        console.log(err)
        throw new Error("Something went wrong")
      }
    }
  }

  async loginUser({ email, password }: CreateAuthDto) : Promise<string> {
    try {
      const user = await this.authModel.findOne({ email });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);    
      }
      const matchpassword = await bcrypt.compare(password, user.password);
      if (!matchpassword) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);    
    }
    const token = await this.signPayload(user.email);
    return token

    } catch (err) {
        throw new Error("Something went wrong")
    }
  }

  async signPayload(email: string) {
    return sign({email: email}, process.env.SECRET_KEY, { expiresIn: '7d' });
  }

  async validateUser(payload : any)  {
    const { email } = payload;
        return await this.authModel.findOne({ email });
  }
}
