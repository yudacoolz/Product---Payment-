"use client";

import PaginationComponent from "@/components/Pagination";
import { createNotification, getOrders } from "@/services/order.service";
import { Order } from "@/types/order";
import { Pagination } from "@/types/pagination";
import { CreateNotifDto } from "@/validations/notification.validation";
import {
  ChevronDown,
  Clock,
  CreditCard,
  Package,
  ReceiptText,
  RefreshCw,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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

// badge colors for each order status
const statusStyle: Record<string, string> = {
  PENDING: "border-accent/30 bg-accent/10 text-accent",
  PAID: "border-emerald-200 bg-emerald-50 text-emerald-700",
  EXPIRED: "border-line bg-subtle text-muted",
  FAILED: "border-red-200 bg-red-50 text-red-600",
  CANCELLED: "border-line bg-subtle text-muted",
};

const filters = ["ALL", "PENDING", "PAID", "EXPIRED", "FAILED", "CANCELLED"];

const formatDate = (date: Date) =>
  new Date(date).toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

export default function NotificationPage() {
  const [dataOrder, setDataOrder] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [openOrder, setOpenOrder] = useState<Order["order_id"] | null>(null);
  const [payingId, setPayingId] = useState<Order["order_id"] | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [metaData, setMetaData] = useState<Pagination | null>(null);

  const [pesanChild, setPesanCHild] = useState("");

  const handlePesanChild = (pesan: string) => {
    setPesanCHild(pesan);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOrders({ page, limit });
        console.log("orders + Meta: ", data);
        setDataOrder(data.data);
        setMetaData(data.meta);
        setTotalPage(data.meta.totalPages);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, limit, refreshKey]);

  const handleCheckOut = async (item: Order) => {
    try {
      console.log("res checkout : ", item);
      setPayingId(item.order_id);
      window.snap.pay(item.snap_token, {
        onSuccess: async (result) => {
          console.log("SUCCESS:", result);
          try {
            await createNotification(result);
          } catch (err) {
            console.log(err);
          }
          setPayingId(null);
          setRefreshKey(refreshKey + 1);
        },

        onPending: (result) => {
          console.log("PENDING:", result);
          setPayingId(null);
        },

        onError: (result) => {
          console.log("ERROR:", result);
          setPayingId(null);
        },

        onClose: () => {
          console.log("Payment popup closed");
          setPayingId(null);
        },
      });
      // router.push(``);
    } catch (err) {
      console.log(err);
      setPayingId(null);
    }
  };

  const visibleOrders =
    activeFilter === "ALL"
      ? dataOrder
      : dataOrder.filter((item) => item.status === activeFilter);

  const pendingCount = dataOrder.filter(
    (item) => item.status === "PENDING",
  ).length;

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl">My Orders</h1>
          <p className="mt-1 text-sm text-muted">
            {loading
              ? "Loading your orders..."
              : pendingCount > 0
                ? `You have ${pendingCount} order${
                    pendingCount > 1 ? "s" : ""
                  } waiting for payment.`
                : "All your orders and their payment status."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setLoading(true);
            setRefreshKey(refreshKey + 1);
          }}
          className="flex w-fit items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold transition hover:bg-subtle"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* STATUS FILTERS */}
      <div className="mt-6 flex flex-wrap gap-2 border-b border-line pb-4">
        {filters.map((status) => {
          const count =
            status === "ALL"
              ? dataOrder.length
              : dataOrder.filter((item) => item.status === status).length;

          return (
            <button
              key={status}
              type="button"
              onClick={() => setActiveFilter(status)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeFilter === status
                  ? "bg-foreground text-background"
                  : "bg-subtle text-muted hover:text-foreground"
              }`}
            >
              {status === "ALL"
                ? "All"
                : status.charAt(0) + status.slice(1).toLowerCase()}
              <span className="ml-2 opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {/* LOADING SKELETON */}
      {loading && (
        <div className="mt-6 flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-line bg-card p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="h-4 w-40 rounded-full bg-subtle" />
                <div className="h-6 w-20 rounded-full bg-subtle" />
              </div>
              <div className="mt-4 h-3 w-56 rounded-full bg-subtle" />
              <div className="mt-2 h-3 w-32 rounded-full bg-subtle" />
              <div className="mt-5 h-8 w-28 rounded-full bg-subtle" />
            </div>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && visibleOrders.length === 0 && (
        <div className="mt-6 rounded-2xl border border-line bg-card p-12 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-subtle">
            <ReceiptText className="h-7 w-7 text-muted" />
          </div>
          <p className="mt-4 font-semibold">
            {dataOrder.length === 0
              ? "Data tidak ada"
              : `No ${activeFilter.toLowerCase()} orders`}
          </p>
          <p className="mt-1 text-sm text-muted">
            {dataOrder.length === 0
              ? "You haven't placed any order yet."
              : "Try another filter to see your other orders."}
          </p>
          {dataOrder.length === 0 && (
            <Link
              href="/products"
              className="mt-6 inline-block rounded-full bg-foreground px-6 py-3 font-semibold text-background transition hover:opacity-90"
            >
              Browse products
            </Link>
          )}
        </div>
      )}

      {/* ORDER LIST */}
      {!loading && visibleOrders.length > 0 && (
        <div className="mt-6 flex flex-col gap-4">
          {visibleOrders.map((item) => {
            const isOpen = openOrder === item.order_id;
            const itemCount = item.items?.length ?? 0;

            return (
              <div
                className="rounded-2xl border border-line bg-card p-5 shadow-sm transition hover:shadow-md"
                key={item.order_id}
              >
                {/* order id + status */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
                  <div>
                    <p className="text-xs text-muted">Order ID</p>
                    <p className="font-mono text-sm font-semibold break-all">
                      {item.order_id}
                    </p>
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDate(item.createdAt)}
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold tracking-wide ${
                      statusStyle[item.status] ?? statusStyle.EXPIRED
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* payment info + total */}
                <div className="flex flex-wrap items-end justify-between gap-4 py-4">
                  <div className="flex flex-wrap gap-6">
                    <div>
                      <p className="flex items-center gap-1.5 text-xs text-muted">
                        <CreditCard className="h-3.5 w-3.5" />
                        Payment Type
                      </p>
                      <p className="mt-1 text-sm font-semibold capitalize">
                        {item.payment_type && item.payment_type !== "unknown"
                          ? item.payment_type.replace(/_/g, " ")
                          : "-"}
                      </p>
                    </div>

                    <div>
                      <p className="flex items-center gap-1.5 text-xs text-muted">
                        <Wallet className="h-3.5 w-3.5" />
                        Payment Name
                      </p>
                      <p className="mt-1 text-sm font-semibold uppercase">
                        {item.payment_name && item.payment_name !== "unknown"
                          ? item.payment_name
                          : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-muted">Gross Amount</p>
                    <p className="text-xl font-bold text-accent">
                      Rp {item.gross_amount.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                {/* products in this order (collapsible) */}
                {itemCount > 0 && (
                  <div className="border-t border-line pt-3">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenOrder(isOpen ? null : item.order_id)
                      }
                      className="flex w-full items-center justify-between rounded-xl px-1 py-2 text-sm font-semibold transition hover:bg-subtle"
                    >
                      <span className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted" />
                        {itemCount} product{itemCount > 1 ? "s" : ""}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-muted transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <ul className="mt-2 flex flex-col gap-2">
                        {item.items.map((orderItem) => (
                          <li
                            key={orderItem.product.id}
                            className="flex items-center gap-3 rounded-xl bg-subtle p-3"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 font-serif text-lg font-bold text-accent">
                              {orderItem.product.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold">
                                {orderItem.product.name}
                              </p>
                              <p className="text-xs text-muted">
                                Rp{" "}
                                {orderItem.product.price.toLocaleString(
                                  "id-ID",
                                )}{" "}
                                x {orderItem.jumlah}
                              </p>
                            </div>
                            <p className="text-sm font-semibold">
                              Rp{" "}
                              {(
                                orderItem.product.price * orderItem.jumlah
                              ).toLocaleString("id-ID")}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* pay action */}
                {item.status === "PENDING" && (
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                    <p className="text-xs text-muted">
                      Finish the payment before it expires.
                    </p>
                    <button
                      className="rounded-full bg-accent px-6 py-2.5 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() => handleCheckOut(item)}
                      disabled={payingId === item.order_id}
                      type="button"
                    >
                      {payingId === item.order_id ? "Opening..." : "Pay Now"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* PAGINATION */}
      <div className="w-full">
        <p>total Page: {metaData?.totalPages}</p>
        <p>total Data: {metaData?.total}</p>
        <div className="flex items-center justify-between w-[60%] border">
          <button
            disabled={!metaData?.hasPrevPage}
            className={`${!metaData?.hasPrevPage ? "bg-red-500" : ""} p-2 border rounded`}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>
          {Array.from({ length: totalPage }, (_, index) => index + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`${pageNumber === page ? "bg-blue-400 text-white" : "text-slate-600"} p-2 border rounded`}
              >
                {pageNumber}
              </button>
            ),
          )}

          <button
            disabled={!metaData?.hasNextPage}
            className={`${!metaData?.hasNextPage ? "bg-red-500" : ""} p-2 border rounded`}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>

      <PaginationComponent addMessage={handlePesanChild} />
      <p>{pesanChild}</p>
    </main>
  );
}
