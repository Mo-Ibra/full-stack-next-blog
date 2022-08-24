import express, { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';

import bcrypt from 'bcrypt';

import { loginSchema, registerSchema } from '../../validation/auth/auth.schema';

import jwt from 'jsonwebtoken';

import isAuth from '../../middleware/auth/isAuth.middleware';

import isAdmin from '../../middleware/auth/isAdmin.middleware';

import { TOKEN_EXPIRES_TIME, TOKEN_SECRET_KEY } from '../../constants/constants';

import validator from '../../middleware/validation/validator.middleware';

const prisma = new PrismaClient();

const Router = express.Router();

Router.post('/register', [validator(registerSchema)], async (req: Request, res: Response) => {
    try {

        const { name, email, password } = req.body;

        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        const createdUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword,
            }
        });

        res.status(200).json({ status: 200, message: 'User has been created', user: createdUser });

    } catch (err) {
        res.status(500).json(err);
    }
});

Router.post('/login', validator(loginSchema), async (req: Request, res: Response) => {
    
    try {

        const { email, password } = req.body;

        const getUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        
        if (!getUser) {
            return res.status(404).json({ error: 'Email or password is wrong. please try again.' });
        }

        const matchPassword = await bcrypt.compare(password, getUser.password);

        if (!matchPassword) {
            return res.status(500).json({ error: 'Password is wrong' });
        }

        console.log('Login');

        // Create Access Token
        const accessToken = jwt.sign({ id: getUser.id, name: getUser.name, email: getUser.email, isAdmin: getUser.isAdmin }, TOKEN_SECRET_KEY, {
           expiresIn: TOKEN_EXPIRES_TIME, 
        });

        // Update Token.
        const updateUser = await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                token: accessToken,
            }
        });

        // Save Token to cookie
        res.cookie('token', accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(200).json({ status: 200, message: 'User has been logined successfuly', user: updateUser, token: accessToken });

    } catch (err) {
        res.status(500).json(err);
    }
});

Router.get('/logout', isAuth, async (req, res) => {

    const email = req.email;

    await prisma.user.update({
        where: {
            email,
        },
        data: {
            token: null,
        }
    })

    res.clearCookie('token');
    res.status(200).json({ status: 200, message: 'User has been log out.' });
});

/* Testing Middlewares */
Router.get('/profile', isAuth, async (req: Request, res: Response) => {
    res.status(200).json({ status: 200, name: req.name, email: req.email, isAdmin: req.isAdmin });
});

Router.get('/admin', isAdmin, (req: Request, res: Response) => {
    res.status(200).json({ status: 200, message: 'You auth', name: req.name, email: req.email, isAdmin: req.isAdmin });
});

export default Router;