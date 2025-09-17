import Post from '../model/Post.js';
import User from '../model/User.js';
import Category from '../model/Category.js';

const createPost = async (req, res) => {
  try {
    const { title, content, categoryId } = req.body;

    if (!title || !content || !categoryId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Title, content y categoryId son requeridos',
      });
    }

    // Verificar si ya existe un post con ese título
    const postFound = await Post.findOne({ title });
    if (postFound) {
      return res.status(400).json({
        status: 'fail',
        message: 'Post ya existe',
      });
    }

    // Crear el post
    const post = await Post.create({
      title,
      content,
      category: categoryId,
      author: req.userAuth._id,
    });

    // Asociar Post con el Usuario
 // Asociar Post con el Usuario
    await User.findByIdAndUpdate(
      req.userAuth._id,
      { $push: { post: post._id } },
      { new: true }
    );

    // Asociar Post con la Categoría
    await Category.findByIdAndUpdate(
      categoryId,
      { $push: { posts: post._id } },
      { new: true }
    );

    // Obtener post con populate
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username email')
      .populate('category', 'name');

    return res.status(201).json({
      status: 'success',
      message: 'Post creado con éxito',
      data: populatedPost,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).populate('comments')
    //   .populate('author', 'username email')
    //   .populate('category', 'name');

    return res.status(200).json({
      status: 'success',
      message: 'Lista de Posts',
      data: posts,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        status: 'fail',
        message: 'Post no encontrado',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Detalle del Post',
      data: post,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, categoryId } = req.body;
    // Buscar el post por ID
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        status: 'fail',
        message: 'Post no encontrado',
      });
    }

    // Solo el autor puede actualizar el post
    if (post.author.toString() !== req.userAuth._id.toString()) {
      return res.status(403).json({
        status: 'fail',
        message: 'No tienes permiso para actualizar este post',
      });
    }

    // Actualizar campos
    post.title = title || post.title;
    post.content = content || post.content;
    post.category = categoryId || post.category;

    const updatedPost = await post.save();

    return res.status(200).json({
      status: 'success',
      message: 'Post actualizado correctamente',
      updatePost,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'Post no encontrado' });
    }

    if (post.author.toString() !== req.userAuth._id.toString()) {
      return res.status(403).json({
        status: 'fail',
        message: 'No tienes permiso para eliminar este post',
      });
    }

    // Eliminar post directamente
    await Post.findByIdAndDelete(id);

    // Remover referencia en el usuario
    await User.findByIdAndUpdate(req.userAuth._id, {
      $pull: { posts: post._id },
    });

    // Remover referencia en la categoría
    await Category.findByIdAndUpdate(post.category, {
      $pull: { posts: post._id },
    });

    return res
      .status(200)
      .json({ status: 'success', message: 'Post eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

export {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost
};
