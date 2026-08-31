import { NextRequest, NextResponse } from "next/server";
import Midtrans from "midtrans-client";
import _ from "lodash";
import { randomUUID } from "crypto";

const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export async function POST(req: NextRequest) {
  console.log(req);
  interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }

  const data: CartItem[] = await req.json();

  if (data.length === 0) {
    throw new Error("data not found");
  }

  console.log("data: ", data);

  const itemDetails = data.map((item) => {
    return {
      key: item.id,
      id: item.id,
      name: item.name,
      price: _.ceil(parseFloat(item.price.toString())),
      quantity: item.quantity,
    };
  });

  // const itemDetails = data.map((item) => ({
  //   id: String(item.id),
  //   name: item.name,
  //   price: _.ceil(Number(item.price)),
  //   quantity: item.quantity,
  // }));

  console.log("itemDetails: ", itemDetails);

  const grossAmount = _.sumBy(
    itemDetails,
    (item) => item.price * item.quantity,
  );

  const parameter = {
    item_details: [itemDetails],
    transaction_details: {
      order_id: `ORDER-${randomUUID()}`,
      gross_amount: grossAmount,
    },
  };

  const token = await snap.createTransactionToken(parameter);
  return NextResponse.json({
    token,
  });
}
