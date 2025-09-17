import Category from '../model/Category.js';

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const foundCategory = await Category.findOne({ name });
    if (foundCategory) {
      return res.status(400).json({
        status: 'fail',
        message: 'El nombre de la categoría ya existe',
      });
    }

    const newCategory = await Category.create({
      name,
      author: req.userAuth._id, // este usuario se asigna con el token, id real del usuario logeado
    });

    return res.status(201).json({
      status: 'success',
      message: 'Categoría creada exitosamente',
      data: newCategory,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});

    return res.status(200).json({
      status: 'success',
      message: 'Lista de Categorías',
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: 'Categoría no encontrada',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Categoría eliminada correctamente',
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: 'Categoría no encontrada',
      });
    }

    // Actualizar el nombre si se proporciona
    category.name = req.body.name || category.name;

    const categoryUpdate = await category.save();

    return res.status(200).json({
      status: 'success',
      message: 'Categoría actualizada correctamente',
      data: categoryUpdate,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

export {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory
};
