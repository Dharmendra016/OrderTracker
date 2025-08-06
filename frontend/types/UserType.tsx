export type User = {
    name: string, 
    email: string, 
    password: string,
    role: 'customer' | 'vendor' | 'delivery',
    shopName?: string,
}