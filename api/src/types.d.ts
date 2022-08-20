declare namespace Express {
    export interface Request {
        name: string;
        email: string;
        isAdmin: boolean;
    }
}