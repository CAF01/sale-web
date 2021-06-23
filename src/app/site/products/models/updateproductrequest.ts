export class UpdateProductRequest {
    productID: number;
    productName: string;
    description: string;
    code: string;
    imageUrl: string;
    categoryID: number;
    model: string;
    brandID: number;
    minForWholeSale: number;
    pricePerWholeSale: number;
    normalPrice: number;
    minStock: number;
    maxStock: number;
}