import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './auth.models';
import { ProductsModule } from 'src/products/products.module';
import { JwtStrategy } from './jwt-strategy'

@Module({
  imports: [MongooseModule.forFeature([{
    name : "User",
    schema : UserSchema
  }]),
  ProductsModule
],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy]
})
export class AuthModule {}
