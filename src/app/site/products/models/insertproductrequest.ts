export class InsertProductRequest {
    ProductName: string;
    Description: string;
    Code: string;
    ImageUrl: string;
    CategoryID: number;
    Model: string;
    BrandID: number;
    MinForWholeSale: number;
    PricePerWholeSale: number;
    NormalPrice: number;
    MinStock: number;
    MaxStock: number;
}