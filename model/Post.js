import mongoose, { VirtualType } from 'mongoose';

const PostSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    claps: {
      type: Number,
      default: 0,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    shares: {
      type: Number,
      default: 0,
    },
    postViews: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    shedduledPublished: {
      type: Date,
      default: null,
    },
    //Un Post tendra muchos likes
    like: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    //Un Post tendra muchos disLike
    disLike: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    //Guarda todos los comentarios asociado al Post
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Post = mongoose.model('Post', PostSchema);
export default Post;
