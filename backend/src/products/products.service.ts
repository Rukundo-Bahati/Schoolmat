import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../common/entities/product.entity';
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from '../common/dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    const product = this.productRepository.create(createProductDto);
    const savedProduct = await this.productRepository.save(product);
    return savedProduct as ProductResponseDto;
  }

  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.find({
      order: { lastUpdated: 'DESC' },
    });
    return products as ProductResponseDto[];
  }

  async findOne(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product as ProductResponseDto;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check stock availability for updates
    if (updateProductDto.stock !== undefined && updateProductDto.stock < 0) {
      throw new BadRequestException('Stock cannot be negative');
    }

    Object.assign(product, updateProductDto);
    const updatedProduct = await this.productRepository.save(product);
    return updatedProduct as ProductResponseDto;
  }

  async remove(id: string): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productRepository.remove(product);
  }

  async findByCategory(categoryName: string): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.find({
      where: { category: categoryName },
      order: { lastUpdated: 'DESC' },
    });
    return products as ProductResponseDto[];
  }

  async searchProducts(query: string): Promise<ProductResponseDto[]> {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .where('product.name ILIKE :query OR product.description ILIKE :query', {
        query: `%${query}%`,
      })
      .orderBy('product.lastUpdated', 'DESC')
      .getMany();

    return products as ProductResponseDto[];
  }

  async updateStock(id: string, quantity: number): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock + quantity < 0) {
      throw new BadRequestException('Insufficient stock');
    }

    product.stock += quantity;
    const updatedProduct = await this.productRepository.save(product);
    return updatedProduct as ProductResponseDto;
  }
}
