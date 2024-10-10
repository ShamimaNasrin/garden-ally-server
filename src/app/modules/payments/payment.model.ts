import { Schema, model } from "mongoose";
import { TPayment } from "./payment.interface";

const PaymentSchema = new Schema<TPayment>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    // customerName: {
    //   type: String,
    //   required: true,
    // },
    // customerEmail: {
    //   type: String,
    //   required: true,
    // },
    // amount: {
    //     type: Number,
    //     required: true,
    //   },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const PaymentModel = model<TPayment>("Payment", PaymentSchema);
