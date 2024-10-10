import { Types } from "mongoose";

export interface TPayment {
  customerId: Types.ObjectId;
  transactionId: string;
  //   customerName: string;
  //   customerEmail: string;
  //   amount: number;
}
