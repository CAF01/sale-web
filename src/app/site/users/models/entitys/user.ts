export interface User {
  userID: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  registerDate: Date;
  changePassword: boolean;
  status: boolean;
}
