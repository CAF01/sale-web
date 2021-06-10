import { AddressInsertRequest } from "./addressinsertrequest";

export class userInsertRequest extends AddressInsertRequest {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
}