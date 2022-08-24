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

        res.status(201).json({ status: 201, message: "Comment has been created", comment: createdComment });

    } catch (err) {
        res.status(500).json(err);
    }
});

/**
 * Update Comment By ID
 * 
 * @access Auth (Same)
*/

Router.put('/:id', [isAuth], async (req: Request, res: Response) => {

    const id: number = Number(req.params.id);

    const { content } = req.body;

    if (!content) {
        return res.status(500).json({ status: 500, message: "You must type content!" });
    }

    try {

        const getComment = await prisma.comment.findUnique({
            where: {
                id,
            }
        });

        if (!getComment) {
            return res.status(404).json({ status: 404, message: `Comment with ${id} Not Found!` });
        }
        
        // if (getComment.authorId !== req.id && !req.isAdmin) {

        if (getComment.authorId !== req.id && !req.isAdmin) {
            return res.status(403).json({ status: 403, message: "You can't Access Here" });
        }
        
        const updatedComment = await prisma.comment.update({
            where: {
                id,
            },
            data: {
                content,
            }
        });

        res.status(200).json({ status: 200, message: "Comment has been updated", comment: updatedComment, })

    } catch (err) {
        res.status(500).json(err);
    }
});

/**
 * Delete Comment By ID
 * 
 * @access Auth (Same)
*/

Router.delete('/:id', [isAuth], async (req: Request, res: Response) => {
    
    const id: number = Number(req.params.id);
    
    try {

        const getComment = await prisma.comment.findUnique({
            where: {
                id,
            }
        });

        if (!getComment) {
            return res.status(404).json({ status: 404, message: `Comment with ${id} Not Found!` });
        }

        if (getComment.authorId !== req.id && !req.isAdmin) {
            return res.status(403).json({ status: 403, message: "You can't Access Here" });
        }

        const deletedComment = await prisma.comment.delete({
            where: {
                id,
            }
        });

        res.status(200).json({ status: 200, message: "Comment has been deleted", comment: deletedComment });

    } catch (err) {
        res.status(500).json(err);
    }
});

export default Router;