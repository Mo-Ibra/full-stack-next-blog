import express, { Request, Response } from 'express';

import isAdmin from '../../middleware/auth/isAdmin.middleware';

import { PrismaClient } from '@prisma/client';

import isAuth from '../../middleware/auth/isAuth.middleware';

import { createValidator } from 'express-joi-validation';

import { commentSchema } from '../../validation/comment/comment.schema';

const JoiMiddleWareValidator = createValidator();

const prisma = new PrismaClient();

const Router = express.Router();

// Get All Comments (Admin Only)
// Get Comment By Id
// Create Comment (Auth)
// Update Comment (Auth Same)
// Delete Comment (Auth Same)

/**
 * Get Comments
 * 
 * @access Admin
*/
Router.get('/', [isAdmin], async (req: Request, res: Response) => {
    const comments = await prisma.comment.findMany();
    res.status(200).json(comments);
});

/**
 * Get Comment By ID
 * 
 * @access Anyone
*/
Router.get('/:id', async (req: Request, res: Response) => {
    
    const id: number = Number(req.params.id);

    try {

        const comment = await prisma.comment.findUnique({
            where: {
                id,
            }
        });

        if (!comment) {
            return res.status(404).json({ status: 404, message: `Comment with ID ${id} Not found!` });
        }

        res.status(200).json({ status: 200, comment });

    } catch (err) {
        res.status(500).json(err);
    }
});

/**
 * Create Comment
 * 
 * @access Auth
*/
Router.post('/', [isAuth, JoiMiddleWareValidator.body(commentSchema)], async (req: Request, res: Response) => {
    
    const { content, articleId } = req.body;

    try {

        const createdComment = await prisma.comment.create({
            data: {
                content,
                articleId: Number(articleId),
                authorId: Number(req.id),
            }
        });

        res.status(201).json({ status: 201, comment: createdComment });

    } catch(err) {
        res.status(500).json(err);
    }
});


export default Router;