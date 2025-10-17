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
    const product = this.productRepository.create({
      ...createProductDto,
      rating: createProductDto.rating ?? 0,
      reviews: createProductDto.reviews ?? 0,
      description: createProductDto.description ?? '',
    });
    const savedProduct = await this.productRepository.save(product);
    return savedProduct as ProductResponseDto;
  }

  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.find({
      where: { isActive: true },
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

    // Update product fields
    Object.assign(product, updateProductDto);
    
    // Update lastUpdated timestamp
    product.lastUpdated = new Date();
    
    const updatedProduct = await this.productRepository.save(product);
    return updatedProduct as ProductResponseDto;
  }

  async remove(id: string): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    try {
      await this.productRepository.remove(product);
    } catch (error) {
      // Check if it's a foreign key constraint error
      if (error.code === '23503' || error.message?.includes('foreign key constraint')) {
        throw new BadRequestException('Cannot delete product because it has been ordered by customers. You can disable it instead.');
      }
      throw error;
    }
  }

  async findByCategory(categoryName: string): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.find({
      where: { category: categoryName, isActive: true },
      order: { lastUpdated: 'DESC' },
    });
    return products as ProductResponseDto[];
  }

  async searchProducts(query: string): Promise<ProductResponseDto[]> {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .where('(product.name ILIKE :query OR product.description ILIKE :query) AND product.isActive = true', {
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

  async toggleProductStatus(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    product.isActive = !product.isActive;
    product.lastUpdated = new Date();
    const updatedProduct = await this.productRepository.save(product);
    return updatedProduct as ProductResponseDto;
  }

  async findAllForManagement(): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.find({
      order: { lastUpdated: 'DESC' },
    });
    return products as ProductResponseDto[];
  }
}
