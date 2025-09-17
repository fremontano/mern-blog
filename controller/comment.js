import Post from '../model/Post.js';
import Comment from '../model/Comment.js';

const createComment = async (req, res) => {
    try {
        const { message, postId } = req.body;

        const comment = await Comment.create({
            message,
            author: req.userAuth._id,
            postId
        });

        //Asociar Comment con Post
        await Post.findByIdAndUpdate(
            postId,
            { $push: { comments: comment._id } },
            { new: true }
        );

        return res.status(201).json({
            status: 'success',
            message: 'Comentario creado y asociado al post',
            data: comment
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};


const getComments = async(req, res)=>{
try {
    const comments = await Comment.find({});

    return res.status(200).json({
      status: 'success',
      message: 'Lista de Categorías',
      comments,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
}
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        status: 'fail',
        message: 'Comentario no encontrado',
      });
    }

    // Solo el autor puede actualizar el comentario
    if (comment.author.toString() !== req.userAuth._id.toString()) {
      return res.status(403).json({
        status: 'fail',
        message: 'No tienes permiso para actualizar este comentario',
      });
    }

    // Actualizar solo el mensaje
    comment.message = message || comment.message;

    const updatedComment = await comment.save();

    return res.status(200).json({
      status: 'success',
      message: 'Comentario actualizado correctamente',
      updatedComment
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};



const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        status: 'fail',
        message: 'Comentario no encontrado',
      });
    }

    // Solo el autor del comentario puede eliminarlo
    if (comment.author.toString() !== req.userAuth._id.toString()) {
      return res.status(403).json({
        status: 'fail',
        message: 'No tienes permiso para eliminar este comentario',
      });
    }

    // Eliminar el comentario
    await Comment.findByIdAndDelete(id);

    // Remover referencia en el post
    await Post.findByIdAndUpdate(comment.postId, {
      $pull: { comments: comment._id }
    });

    return res.status(200).json({
      status: 'success',
      message: 'Comentario eliminado correctamente',
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};



export { createComment, updateComment, deleteComment, getComments };
