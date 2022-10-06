import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ProductsService } from 'src/products/products.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly productsService: ProductsService) {}

  @Post('create')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.createUser(createAuthDto);
  }

  @Get('login')
  login(@Body() user: CreateAuthDto) {
    try{
      const loggedUser = this.authService.loginUser(user);
      if(loggedUser){
        const data = this.productsService.getProducts()
        return data
      }
    } catch(err){
      throw new HttpException("Something went wrong", HttpStatus.BAD_REQUEST)
    }
    
  }
}
 