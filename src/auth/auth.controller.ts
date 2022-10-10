import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ProductsService } from 'src/products/products.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly productsService: ProductsService) {}

  @Post('create')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.createUser(createAuthDto);
  }

  @Get('login')
  async login(@Body() user: CreateAuthDto) {
    try{
      const token = await this.authService.loginUser(user);
      if(token){
        const productsDetail = await this.productsService.getProducts()
        return {  token : token , productsDetail}
      }
    } catch(err){
      throw new HttpException("Something went wrong", HttpStatus.BAD_REQUEST)
    }
  }

  @Get('sample')
  @UseGuards(AuthGuard("jwt"))
  async info() {
    return "hiii"
  }
}
 