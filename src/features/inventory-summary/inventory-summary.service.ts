import { Injectable } from '@nestjs/common';
import { ProductService } from '../../modules/product/product.service.js';

export interface InventorySummary {
  totalProducts: number;
  inStockCount: number;
  outOfStockCount: number;
  inStockValue: number;
  outOfStockProducts: { id: number; name: string }[];
}

// Composes ProductService (a generated CRUD service) into a summary view.
// Lives under src/features, so this never touches src/modules/product.
@Injectable()
export class InventorySummaryService {
  constructor(private readonly productService: ProductService) {}

  async getSummary(): Promise<InventorySummary> {
    const { data: products } = await this.productService.findAll({ skip: 0, take: 10_000 });

    const inStock = products.filter((p) => p.inStock);
    const outOfStock = products.filter((p) => !p.inStock);

    return {
      totalProducts: products.length,
      inStockCount: inStock.length,
      outOfStockCount: outOfStock.length,
      inStockValue: inStock.reduce((sum, p) => sum + p.price, 0),
      outOfStockProducts: outOfStock.map((p) => ({ id: p.id, name: p.name })),
    };
  }
}
