export type User = {
    id: string,
    name: string, 
    email: string, 
    password: string,
    role: 'customer' | 'vendor' | 'delivery',
    shopName?: string,
    available?: boolean // Only for delivery partners
}