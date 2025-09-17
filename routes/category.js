import express from 'express';
import isLogging from '../middleware/isLoggin.js';
import { createCategory, deleteCategory, getCategories, updateCategory } from '../controller/category.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/',isLogging, createCategory);
router.put('/:id', isLogging, updateCategory);
router.delete('/:id',isLogging, deleteCategory);    

export default router;