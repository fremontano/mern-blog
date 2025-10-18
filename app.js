import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from '././routes/user.js';
import postRouter from '././routes/post.js';
import commentRouter from '././routes/comment.js';
import categoryRouter from '././routes/category.js';

import dbConnection from './config/db.js';
// sendEmail("fremontano24@gmail.com", "Fremontano", "xgfxgsvsgyh");


// Middleware
dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

//Database
dbConnection();

//Cargar Configuraciones de Rutas
//Rutas
app.use('/api/v1/users', userRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/comments', commentRouter);

//Test
app.get('/', (req, res) => {
  res.send('Hello World test');
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server Running on PORT ${process.env.PORT || 4000}`);
});
