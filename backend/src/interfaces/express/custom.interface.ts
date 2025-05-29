import { UserPayloadInterface } from "../userPayload.interface";

declare global {
    namespace Express {
        interface Request {
            user?: UserPayloadInterface;
        }
    }
}