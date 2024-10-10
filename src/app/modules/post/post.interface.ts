import { Types } from "mongoose";

export type TComment = {
  _id?: string;
  comment: string;
  commentatorId: Types.ObjectId;
  isDeleted: boolean;
};

// Post Interface
export interface TPost {
  authorId: Types.ObjectId;
  title: string;
  description: string;
  images?: string[];
  category: "Vegetables" | "Flowers" | "Landscaping" | "Indoor Plants";
  upVoteNumber: number;
  downVoteNumber: number;
  comments?: TComment[];
  upVoterList: Types.ObjectId[];
  downVoterList: Types.ObjectId[];
  isPremium: boolean;
  isDeleted: boolean;
}
