import mongoose from 'mongoose';
import moment from 'moment';

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      default: moment().format('MM/DD/YYYY')
    },

  },
  { timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);
export default Category;
