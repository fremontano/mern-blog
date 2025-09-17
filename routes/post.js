import express from 'express';
import isLogging from '../middleware/isLoggin.js';
import { createPost, deletePost, getPostById, getPosts, updatePost } from '../controller/post.js';

const router = express.Router();

router.post('/',isLogging, createPost);
router.get('/',getPosts);
router.get('/:id',getPostById);
router.put('/:id',isLogging, updatePost);
router.delete('/:id',isLogging, deletePost);

export default router;