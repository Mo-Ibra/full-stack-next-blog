import express, { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';

import isAdmin from '../../middleware/auth/isAdmin.middleware';

import { createValidator } from 'express-joi-validation';

import { categorySchema } from '../../validation/category/category.schema';

const JoiMiddleWareValidator = createValidator();

const prisma = new PrismaClient();

const Router = express.Router();

/**
 * Get All Categories
 * 
 * @access Anyone
 */
Router.get('/', async (req: Request, res: Response) => {

    const categories = await prisma.category.findMany({});

    res.status(200).json({ status: 200, categories });
});

/**
 * Get Category By ID
 * 
 * @access Anyone
 */
Router.get('/:id', async (req: Request, res: Response) => {

    const id = Number(req.params.id);

    try {

        const category = await prisma.category.findUnique({
            where: {
                id: id,
            },
        });

        if (!category) {
            return res.status(404).json({ status: 404, message: `Category With ID: ${id} Not Found!` });
        }

        res.status(200).json({ status: 200, category });

    } catch (err) {

        res.status(500).json(err);

    }
});

/**
 * Create Category.
 * 
 * @access Admin
*/
Router.post('/', [isAdmin, JoiMiddleWareValidator.body(categorySchema)], async (req: Request, res: Response) => {

    const { name, description } = req.body;

    try {

        const createdCategory = await prisma.category.create({
            data: {
                name,
                description
            }
        });

        res.status(201).json({ status: 201, message: "Category has been created.", category: createdCategory });

    } catch (err) {
        res.status(500).json(err);
    }
});

/**
 * Update Category With ID
 * 
 * @access Admin.
*/
Router.put('/:id', [isAdmin, JoiMiddleWareValidator.body(categorySchema)], async (req: Request, res: Response) => {

    const id: number = Number(req.params.id);

    const { name, description } = req.body;

    try {

        const findCategory = await prisma.category.findUnique({
            where: {
                id,
            }
        });

        if (!findCategory) {
            return res.status(404).json({ status: 404, message: `Category with ID ${id} not found!` });
        }

        const updatedCategory = await prisma.category.update({
            where: {
                id,
            },
            data: {
                name,
                description
            }
        });

        res.status(202).json({ status: 202, message: 'Category has been updated.', category: updatedCategory });

    } catch(err) {
        res.status(500).json()
    }
});

/**
 * Delete Category.
 * 
 * @access Admin.
*/
Router.delete('/:id', [isAdmin], async (req: Request, res: Response) => {

    const id: number = Number(req.params.id);

    try {

        const findCategory = await prisma.category.findUnique({
            where: {
                id,
            }
        });

        if (!findCategory) {
            return res.status(404).json({ status: 404, message: "Category not found!" });
        }

        const deletedCategory = await prisma.category.delete({
            where: {
                id,
            }
        });

        res.status(201).json({ status: 201, message: "Category has been deleted", category: deletedCategory });

    } catch(err) {
        res.status(500).json(err);
    }
});

export default Router;