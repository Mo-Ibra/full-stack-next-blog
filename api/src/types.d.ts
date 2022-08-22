declare namespace Express {
    export interface Request {
        id: number;
        name: string;
        email: string;
        isAdmin: boolean;
    }
}