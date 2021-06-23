import { insertAddressClientRequest } from "./insertaddressclientrequest";

export class insertClientRequest extends insertAddressClientRequest {
    firstName: string;
    lastName: string;
    workPhone: string;
    phone: string;
    email: string;
    notes: string;
}