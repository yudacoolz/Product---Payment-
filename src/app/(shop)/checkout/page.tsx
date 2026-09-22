"use client";

import { createNotification, createOrder } from "@/services/order.service";
import { useCartStore } from "@/stores/cart-store";
import { OrderItem } from "@/types/order";
import { CreateNotifDto } from "@/validations/notification.validation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options?: {
          onSuccess?: (result: CreateNotifDto) => void;
          onPending?: (result: CreateNotifDto) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        },
      ) => void;
    };
  }
}

interface PaymentType {
  id: number;
  name: string;
  value: string;
  payment_type: string;
}

const banks: PaymentType[] = [
  { id: 1, name: "bca", value: "bca", payment_type: "bank_transfer" },
  { id: 2, name: "bni", value: "bni", payment_type: "bank_transfer" },
];

const checkoutPage = () => {
  const router = useRouter();
  // const cart = useCartStore((state) => state.cart);
  // const updateCartItem = useCartStore((state) => state.updateCartItem);
  const cart = useCartStore.getState().cart;

  console.log("cart Store: ", cart);
  const [changeJumlah, setChangeJumlah] = useState<Record<string, number>>({});
  const [grossAmmount, setGrossAmmount] = useState(0);
  const [paymentType, setPaymentType] = useState<PaymentType | null>(null);

  const intitialJumlah: Record<string, number> = {};

  //  output changeJumlah :
  // {
  //   0f972ff3-f45d-4c4a-9444-76a27561dfc5 : 2
  //   52012358-45ad-4ce6-8a91-12e127621e9c : 1
  // }

  useEffect(() => {
    cart.forEach((item) => (intitialJumlah[item.product.id] = item.jumlah));
    setChangeJumlah(intitialJumlah);
  }, []);
  console.log("changeJumlah: ", changeJumlah);
  console.log("intitialJumlah: ", intitialJumlah);

  useMemo(() => {
    let gross_ammount: number = 0;
    cart.forEach((item) => {
      const total_per_item = changeJumlah[item.product.id] * item.product.price;
      gross_ammount += total_per_item;
    });
    setGrossAmmount(gross_ammount);
  }, [changeJumlah]);

  console.log("grossAmmount : ", grossAmmount);

  const handleCheckout = async () => {
    const orderItems = cart.map((item, i) => ({
      // order_Item_id: i + 1,
      // order_Item_id: item.,
      product: item.product,
      jumlah: changeJumlah[item.product.id] ?? item.jumlah,
    }));

    console.log("orderItems", orderItems);

    if (!paymentType) {
      console.error("payment type is required");
      return;
    }

    const order = {
      orderItems: orderItems,
      payment_type: paymentType?.payment_type,
      bank_transfer: {
        bank: paymentType?.value,
      },
    };

    console.log("final order: ", order);

    try {
      // SNAP //
      const data = await createOrder(order);

      // CORE API //
      // const data = await createOrder(order);

      console.log("res checkout : ", data);
      window.snap.pay(data.token, {
        onSuccess: async (result) => {
          console.log("SUCCESS:", result);
          try {
            await createNotification(result);
          } catch (err) {
            console.log(err);
          }

          router.push("/notification");
        },

        onPending: (result) => {
          console.log("PENDING:", result);
        },

        onError: (result) => {
          console.log("ERROR:", result);
        },

        onClose: () => {
          console.log("Payment popup closed");
        },
      });
      // router.push(``);
    } catch (err) {
      console.log(err);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h2 className="font-serif text-2xl font-semibold">Data tidak ada</h2>
        <p className="mt-2 text-sm text-muted">
          No products selected for checkout yet.
        </p>
        <Link
          href="/carts"
          className="mt-6 inline-block rounded-full bg-foreground px-6 py-3 font-semibold text-background hover:opacity-90"
        >
          Back to Cart
        </Link>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="font-serif text-3xl font-bold">Checkout</h1>
      <p className="mt-1 text-sm text-muted">
        Review your order and choose a payment method.
      </p>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        {/* LEFT SIDE */}
        <div className="w-full lg:w-[70%]">
          <h2 className="mb-3 text-lg font-semibold">
            Products ({cart.length})
          </h2>

          {cart.map((item, i) => (
            <div
              className="mb-4 flex flex-col gap-4 rounded-2xl border border-line bg-card p-5 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              key={i}
            >
              {/* product info */}
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-accent/10 font-serif text-2xl font-bold text-accent">
                  {item.product.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold">{item.product.name}</p>
                  <p className="text-xs text-muted">ID #{item.product.id}</p>
                  <p className="mt-1 text-sm text-muted">
                    Rp {item.product.price.toLocaleString("id-ID")} / pcs
                  </p>
                </div>
              </div>

              {/* jumlah + subtotal */}
              <div className="flex items-center justify-between gap-6">
                <div className="flex flex-col">
                  <label
                    htmlFor={`jumlah-${item.product.id}`}
                    className="mb-1 text-xs text-muted"
                  >
                    Jumlah
                  </label>
                  <input
                    id={`jumlah-${item.product.id}`}
                    type="number"
                    min={1}
                    className="w-20 rounded-full border border-line bg-transparent px-3 py-2 text-center focus:border-accent focus:outline-none"
                    value={changeJumlah[item.product.id] ?? item.jumlah}
                    onChange={(e) =>
                      setChangeJumlah({
                        ...changeJumlah,
                        [item.product.id]: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="min-w-28 text-right">
                  <p className="text-xs text-muted">Subtotal</p>
                  <p className="font-semibold">
                    Rp{" "}
                    {(
                      (changeJumlah[item.product.id] ?? item.jumlah) *
                      item.product.price
                    ).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-[30%]">
          <div className="flex flex-col gap-4 rounded-2xl border border-line bg-card p-5 shadow-sm lg:sticky lg:top-20">
            <div>
              <h2 className="text-lg font-semibold">Payment Method</h2>
              <p className="mb-3 text-xs text-muted">
                Bank Transfer (Virtual Account)
              </p>

              <ul className="flex flex-col gap-2">
                {banks.map((item, i) => (
                  <li key={item.id}>
                    <label
                      htmlFor={`bank-${item.id}`}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border-2 px-4 py-3 transition ${
                        paymentType?.value === item.value
                          ? "border-accent bg-accent/10"
                          : "border-line hover:bg-subtle"
                      }`}
                    >
                      <span className="font-semibold">
                        {item.name.toUpperCase()}
                      </span>
                      <input
                        id={`bank-${item.id}`}
                        name="paymentType"
                        type="radio"
                        className="h-4 w-4 accent-accent"
                        value={item.value}
                        checked={paymentType?.value === item.value}
                        onChange={() => setPaymentType(item)}
                      />
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* summary */}
            <div className="border-t border-line pt-4">
              <div className="flex justify-between text-sm text-muted">
                <span>Payment</span>
                <span>
                  {paymentType ? paymentType.name.toUpperCase() : "-"}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <h2 className="font-semibold">Total</h2>
                <p className="text-xl font-bold text-accent">
                  Rp {grossAmmount.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleCheckout()}
              disabled={!paymentType}
              className="w-full rounded-full bg-foreground p-3 font-semibold text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Proceed to Payment
            </button>
            {!paymentType && (
              <p className="text-center text-xs text-muted">
                Choose a bank first to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default checkoutPage;
