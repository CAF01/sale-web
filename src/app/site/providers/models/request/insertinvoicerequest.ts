import { InsertContentRequest } from "./insertcontentrequest";

export class InsertInvoiceRequest {
    total: number=0;
    providerID: number;
    products :Array<InsertContentRequest>;
    providerName:string;
}