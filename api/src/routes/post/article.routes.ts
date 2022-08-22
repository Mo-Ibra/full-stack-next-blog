// Get All Posts
// Get Post By Id
// Create Post
// Update Post
// Delete Post By Id
// Search In Posts

import express, { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';

import isAdmin from '../../middleware/auth/isAdmin.middleware';

import { createValidator } from 'express-joi-validation';

import { articleSchema } from '../../validation/article/article.schema';

const JoiMiddleWareValidator = createValidator();

const prisma = new PrismaClient();

const Router = express.Router();

/**
 * Get All Articles
 * 
 * @access Anyone
*/
Router.get('/', async (req: Request, res: Response) => {
    const articles = await prisma.article.findMany();
    res.status(200).json({ status: 200, articles });
});

/**
 * Get Article by ID
 * 
 * @access Anyone
*/
Router.get('/:id', async (req: Request, res: Response) => {

    const id: number = Number(req.params.id);

    try {

        const article = await prisma.article.findUnique({
            where: {
                id,
            }
        });

        if (!article) {
            res.status(404).json({ status: 404, messaeg: "Article Not Found!" })
        }

        res.status(200).json({ status: 200, article });

    } catch (err) {
        res.status(500).json(err);
    }
});

/**
 * Create New Article
 * 
 * @access Admin.
*/
Router.post('/', [isAdmin, JoiMiddleWareValidator.body(articleSchema)], async (req: Request, res: Response) => {

    const { slug, title, description, content, categoryId }  = req.body;

    try {

        const createdArticle = await prisma.article.create({
            data: {
                slug,
                title,
                description,
                content,
                categoryId: Number(categoryId),
            }
        });

        res.status(201).json({ status: 201, message: "Article has been created.", article: createdArticle });

    } catch (err) {
        res.status(500).json(err);
    }

});

export default Router;