export class GetProductRequest {

    constructor(productName: string=null, code: string=null){
        this.productName=productName;
        this.code=code;
    }

    productName: string;
    code: string;
}