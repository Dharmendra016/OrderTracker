import jwt from 'jsonwebtoken';
import { config } from './config';
import { UserPayloadInterface } from '../interfaces/userPayload.interface';

export const generateToken = (userData: UserPayloadInterface):string => {

    try {
        
        const token = jwt.sign(userData, config.jwt_secret ,{expiresIn: '1d'});
        if(!token) {
            throw new Error('Token generation failed');
        }

        return token;

    } catch (error) {
        console.error('Error generating token:', error);
        throw new Error('Token generation failed');
    }

}

export const verifyToken = (token: string): UserPayloadInterface => {
    try {
        const decoded = jwt.verify(token, config.jwt_secret) as UserPayloadInterface;
        return decoded;
    } catch (error) {
        console.error('Error verifying token:', error);
        throw new Error('Token verification failed');
    }
}