import { addressClient } from "./addressclient";

export class client extends addressClient {
  clientID: number;
  firstName: string;
  lastName: string;
  workPhone: string;
  phone: string;
  email: string;
  notes: string;
  status:boolean;
  registerDate: Date;
}
