// import "midtrans-client";
declare module "midtrans-client";
// declare module "midtrans-client" {
//   interface ItemDetail {
//     id: string;
//     price: number;
//     quantity: number;
//     name: string;
//   }

//   interface CustomerDetails {
//     first_name?: string;
//     last_name?: string;
//     email?: string;
//     phone?: string;
//   }

//   // The shipped @types package only declares `transaction_details`, but Snap
//   // accepts (and we send) more than that.
//   interface SnapTransactionParameters {
//     item_details?: ItemDetail[];
//     customer_details?: CustomerDetails;
//     credit_card?: { secure?: boolean };
//   }

//   // `createTransactionToken` is a real method on Snap, it is just missing from
//   // @types/midtrans-client. It returns only the token; `createTransaction`
//   // returns the token *and* the redirect_url, which is why the route uses that.
//   interface Snap {
//     createTransactionToken(parameter: SnapTransactionParameters): Promise<string>;
//   }
// }

// declare global {
//   interface SnapCallbacks {
//     onSuccess?: (result: unknown) => void;
//     onPending?: (result: unknown) => void;
//     onError?: (result: unknown) => void;
//     onClose?: () => void;
//   }

//   interface Window {
//     snap?: {
//       pay: (token: string, callbacks?: SnapCallbacks) => void;
//     };
//   }
// }
