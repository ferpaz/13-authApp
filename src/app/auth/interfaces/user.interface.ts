export interface User {
  _id: string;
  email: string;
  name: string;
  isActive: boolean;
  role: string[];
  createdAt: Date;
  updatedAt?: Date;
}
