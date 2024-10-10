import { Schema, model } from "mongoose";
import { TComment, TPost } from "./post.interface";

// Comment Schema
const CommentSchema = new Schema<TComment>({
  comment: {
    type: String,
    required: true,
    trim: true,
  },
  commentatorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// Post Schema
const PostSchema = new Schema<TPost>(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ["Vegetables", "Flowers", "Landscaping", "Indoor Plants"],
      required: true,
    },
    upVoteNumber: {
      type: Number,
      default: 0,
    },
    downVoteNumber: {
      type: Number,
      default: 0,
    },
    comments: [CommentSchema],
    isPremium: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const PostModel = model<TPost>("Post", PostSchema);
// export const Comment = model<TComment>("Comment", CommentSchema);
