export enum UserRole {
  CUSTOMER = "CUSTOMER",
  MERCHANT = "MERCHANT",
}

export interface User {
  user_id: String;
  role: UserRole;
  first_name: String;
  email: String;
  phone: number;
  password: String;
}
