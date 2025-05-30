import dotenv from 'dotenv';

dotenv.config();

interface Config{
    port: number;
    db_string: string;
    jwt_secret: string;
    client_url:string;
}

const config:Config = {
    port: Number(process.env.PORT) || 3000,
    db_string: process.env.DB_STRING || "",
    jwt_secret: process.env.JWT_SECRET || "default",
    client_url: process.env.CLIENT_URL || "http://localhost:3000"
}

export { config };