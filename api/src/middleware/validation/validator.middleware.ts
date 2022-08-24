import { Request, Response, NextFunction } from 'express';

const validator = (schema: object) => {
    return (req: Request, res: Response, next: NextFunction) => {

        const { error } = schema.validate(req.body);

        const valid = error == null;

        if (valid) {
            next()
        } else {

            const { details } = error;

            const errors = details[0].message;

            res.status(422).json({ errors });
        }
    }
}

export default validator;