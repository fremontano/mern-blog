import express from 'express';
import isLogging from '../middleware/isLoggin.js';
import { createComment, deleteComment, getComments, updateComment } from '../controller/comment.js';

const router = express.Router();

router.post('/',isLogging, createComment);
router.get('/', getComments);
router.put('/:id',isLogging, updateComment);
router.delete('/:id',isLogging, deleteComment);


export default router;