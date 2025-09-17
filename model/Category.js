import mongoose from 'mongoose';

const CategorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  share: {
    type: Number,
    default: 0,
  },
  posts: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: false,
  },
});

const Category = mongoose.model('Category', CategorySchema);
export default Category;
