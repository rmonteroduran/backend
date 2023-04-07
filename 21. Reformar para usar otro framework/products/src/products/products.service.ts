import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model } from 'mongoose';
import { Product } from './entities/product.entity';
import { title } from 'process';

@Injectable()
export class ProductsService {

  constructor(@InjectModel('Product') private readonly productModel: Model<Product>) {}

  async create(createProductDto: CreateProductDto) {
    //return 'This action adds a new product';
    const newProduct = new this.productModel(createProductDto)
    const result = await newProduct.save();
    return (result.id) as string
  }

  async findAll() {
    //return `This action returns all products`;
    const products = await this.productModel.find().exec();
    return products.map((prod) => ({id: prod.id, title: prod.title, price: prod.price, thumbnail: prod.thumbnail}));
  }

  async findOne(productId: string) {
    //return `This action returns a #${id} product`;
    const product = await this.findProduct(productId);
    return {id: product.id, title: product.title, price: product.price, thumbnail: product.thumbnail};
  }

  async update(productId: string, updateProductDto: UpdateProductDto) {
   //return `This action updates a #${id} product`;
    const updatedProduct = await this.findProduct(productId)
    if (updateProductDto.title) {
      updatedProduct.title = updateProductDto.title
    }
    if (updateProductDto.price) {
      updatedProduct.price = updateProductDto.price
    }
    if (updateProductDto.thumbnail) {
      updatedProduct.thumbnail = updateProductDto.thumbnail
    }
    updatedProduct.save();
  }

  async remove(productId: string) {
    //return `This action removes a #${id} product`;
    const result = await this.productModel.deleteOne({_id: productId}).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('No se encontró el producto.') 
    }
  }

  private async findProduct(id: string): Promise<Product> {
    const product = await this.productModel.findById(id)
    if (!product) {
      throw new NotFoundException('No se encontró el producto.') 
    }
    return product;
  } 
}
