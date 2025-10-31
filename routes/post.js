import express from 'express';

import isLogging from '../middleware/isLoggin.js';
import { claps, createPost, deletePost, dislikePost, getPostById, getPosts, likePost, schedule, updatePost } from '../controller/post.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.post('/',isLogging, upload.single('image'), createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.put('/:id', isLogging, upload.single('image'), updatePost);
router.put('/likes/:id', isLogging, likePost);

router.put('/claps/:id', isLogging, claps);
router.put('/schedule/:postId', isLogging, schedule);
router.put('/dislike/:id', isLogging, dislikePost);
router.delete('/:id', isLogging, deletePost);

export default router;