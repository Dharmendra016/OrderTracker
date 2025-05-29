export interface UserPayloadInterface {
  id: string;        // or Types.ObjectId, but string is typical for JWT
  name: string;
  email: string;
  role: 'customer' | 'delivery' | 'vendor';
}