import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductModel, Product } from './products.models';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel("Product") private productModel: Model<ProductModel>
  ) { }

  async createProduct(product: CreateProductDto): Promise<Product> {
    try {
      const newProduct = new this.productModel(product)
      const createdProduct = await newProduct.save()
      return createdProduct
    } catch (err) {
      return err
    }
  }

  async getProducts(): Promise<Product[]> {
    try {
      const products = await this.productModel.find({}).select
        ("-__v -_id")
      return products
    } catch (err) {
      return err;
    }
  }
}
