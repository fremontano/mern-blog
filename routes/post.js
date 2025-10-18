import express from 'express';
import isLogging from '../middleware/isLoggin.js';
import { claps, createPost, deletePost, dislikePost, getPostById, getPosts, likePost, updatePost } from '../controller/post.js';

const router = express.Router();

router.post('/',isLogging, createPost);
router.get('/',getPosts);
router.get('/:id',getPostById);
router.put('/:id',isLogging, updatePost);
router.put('/likes/:id',isLogging, likePost);
router.put('/claps/:id',isLogging, claps);
router.put('/dislike/:id', isLogging, dislikePost);
router.delete('/:id',isLogging, deletePost);

export default router;