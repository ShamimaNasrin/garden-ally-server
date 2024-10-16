import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// http://localhost:5000/api
// https://garden-ally-server.vercel.app/api

export const initiatePayment = async (paymentData: any) => {
  console.log("Payment initiat data:", paymentData);
  try {
    const response = await axios.post(process.env.PAYMENT_URL!, {
      store_id: process.env.STORE_ID,
      signature_key: process.env.SIGNATURE_KEY,
      tran_id: paymentData.transactionID,
      success_url: `http://localhost:5000/api/payment/confirmation?transactionId=${paymentData.transactionId}&status=success`,
      fail_url: `http://localhost:5000/api/payment/confirmation?&status=failed`,
      cancel_url: "http://localhost:3000/",
      amount: paymentData.totalPrice,
      currency: "BDT",
      desc: "Merchant Registration Payment",
      cus_name: paymentData.customerName,
      cus_email: paymentData.customerEmail,
      cus_add1: paymentData.customerAddress,
      cus_add2: "N/A",
      cus_city: "Dhaka",
      cus_state: "N/A",
      cus_postcode: "N/A",
      cus_country: "Bangladesh",
      cus_phone: paymentData.customerPhone,
      type: "json",
    });
    return response.data;
  } catch (error) {
    throw new Error("Payment initiation failed!");
  }
};

export const verifyPayment = async (tnxId: string) => {
  try {
    const response = await axios.get(process.env.PAYMENT_VERIFY_URL!, {
      params: {
        store_id: process.env.STORE_ID,
        signature_key: process.env.SIGNATURE_KEY,
        type: "json",
        request_id: tnxId,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Payment validation failed!");
  }
};
