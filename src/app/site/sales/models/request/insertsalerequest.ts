import { InsertContentSaleRequest } from "./insertcontentsalerequest";
import { InsertPendingPaymentRequest } from "./insertpendingpayment";

export class InsertSaleRequest {
    clientID: number;
    userID: number;
    total: 0;//number
    totalIVA: 0;//number
    paymentMethodID: number;
    products:InsertContentSaleRequest[];
    pendingPayment:InsertPendingPaymentRequest;
}