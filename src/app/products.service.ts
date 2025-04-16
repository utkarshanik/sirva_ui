import { Injectable } from '@angular/core';
import { products, Product } from "./products";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private data: Product[] = products;
  private counter: number = products.length;

  public products(): Product[] {
    return this.data;
  }

  public remove(product: Product): void {
    const index = this.data.findIndex(
      ({ ProductID }) => ProductID === product.ProductID
    );
    this.data.splice(index, 1);
  }

  public save(product: Product, isNew: boolean): void {
    if (isNew) {
      product.ProductID = this.counter++;
      this.data.splice(0, 0, product);
    } else {
      const existingProduct = this.data.find(({ ProductID }) => ProductID === product.ProductID);
      if (existingProduct) {
        Object.assign(existingProduct, product);
      }
    }
  }
 
}
