import express, { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';

import isAuth from '../../middleware/auth/isAuth.middleware';

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
    const articles = await prisma.article.findMany({
        include: {
            comments: true,
        }
    });
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
            },
            include: {
                comments: true,
            }
        });

        if (!article) {
            return res.status(404).json({ status: 404, messaeg: "Article Not Found!" })
        }

        res.status(200).json({ status: 200, article });

    } catch (err) {
        res.status(500).json(err);
    }
});

/**
 * Search In Articles
 * 
 * @access Anyone
*/

Router.get('/search/:title', async (req: Request, res: Response) => {

    const searchTitle = req.params.title;

    try {

        const articles = await prisma.article.findMany({
            where: {
                title: {
                    contains: searchTitle,
                },
            },
            include: {
                comments: true,
            }
        });

        res.status(200).json({status: 200, articles});

    } catch (err) {
        res.status(500).json(err);
    }
});

/**
 * Create New Article
 * 
 * @access User(Auth).
*/
Router.post('/', [isAuth, JoiMiddleWareValidator.body(articleSchema)], async (req: Request, res: Response) => {

    const { slug, title, description, content, categoryId } = req.body;

    try {

        const createdArticle = await prisma.article.create({
            data: {
                slug,
                title,
                description,
                content,
                categoryId: Number(categoryId),
                authorId: Number(req.id),
            }
        });

        res.status(201).json({ status: 201, message: "Article has been created.", article: createdArticle });

    } catch (err) {
        res.status(500).json(err);
    }

});

/**
 * Update Article
 * 
 * @access User(Auth - Same)
*/
Router.put('/:id', [isAuth, JoiMiddleWareValidator.body(articleSchema)], async (req: Request, res: Response) => {

    const id: number = Number(req.params.id);

    const { slug, title, description, content, categoryId } = req.body;

    try {

        const getArticle = await prisma.article.findUnique({
            where: {
                id,
            }
        });

        if (!getArticle) {
            return res.status(404).json({ status: 404, message: "Article not found!" });
        }

        if (getArticle.authorId !== req.id && !req.isAdmin) {
            return res.status(403).json({ message: "You can't update this article." });
        }

        const updatedArticle = await prisma.article.update({
            where: {
                id,
            },
            data: {
                slug,
                title,
                description,
                content,
                categoryId,
            }
        });

        res.status(200).json({ status: 200, message: "Article has been updated", article: updatedArticle });

    } catch (err) {
        res.status(500).json(err);
    }
});

/**
 * Delete Article
 * 
 * @access User(Auth - Same)
*/

Router.delete('/:id', [isAuth], async (req: Request, res: Response) => {

    const id: number = Number(req.params.id);

    try {

        const getArticle = await prisma.article.findUnique({
            where: {
                id,
            }
        });

        if (!getArticle) {
            return res.status(404).json({ status: 404, message: `Article with ID ${id} not found!` });
        }

        if (getArticle.authorId !== req.id && !req.isAdmin) {
            console.log(getArticle.authorId, req.id);
            return res.status(403).json({ message: "You can't delete this article." });
        }

        const deletedArticle = await prisma.article.delete({
            where: {
                id,
            }
        });

        res.status(200).json({ status: 200, message: "Article has been deleted", article: deletedArticle });

    } catch (err) {
        res.status(500).json(err);
    }
});

export default Router;