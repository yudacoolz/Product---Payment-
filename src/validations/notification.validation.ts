// bca_va_number
// :
// "97185458582773602074292"
// finish_redirect_url
// :
// "http://example.com?order_id=df97dfec-4320-4bcb-bd61-a8beb5d0dd38&status_code=200&transaction_status=settlement"
// fraud_status
// :
// "accept"
// gross_amount
// :
// "100000.00"
// order_id
// :
// "df97dfec-4320-4bcb-bd61-a8beb5d0dd38"
// payment_type
// :
// "bank_transfer"
// pdf_url
// :
// "https://app.sandbox.midtrans.com/snap/v1/transactions/1c9ebaee-9ff8-49a4-be7f-4d73e1bacc34/pdf"
// status_code
// :
// "200"
// status_message
// :
// "Success, transaction is found"
// transaction_id
// :
// "44fe2b71-a47c-4da1-bda2-33f40beca995"
// transaction_status
// :
// "settlement"
// transaction_time
// :
// "2026-09-14 16:48:30"
// va_numbers
// :
// Array(1)
// 0
// :
// {bank: 'bca', va_number: '97185458582773602074292'}
// length
// :
// 1

import z from "zod";

export const VaNumberSchema = z.object({
  bank: z.string().trim().min(1, "bank is required"),
  va_number: z.string().trim().min(1, "va_number is required"),
});

export const CreateNotifSchema = z.object({
  bca_va_number: z.string().trim().min(1, "bca_va_number is required"),

  finish_redirect_url: z
    .string()
    .trim()
    .url("finish_redirect_url must be a valid URL"),

  fraud_status: z.string().trim().min(1, "fraud_status is required"),

  gross_amount: z.coerce
    .number()
    .positive("gross_amount must be greater than 0"),

  order_id: z.string().trim().min(1, "order_id is required"),

  payment_type: z.string().trim().min(1, "payment_type is required"),

  pdf_url: z.string().trim().url("pdf_url must be a valid URL"),

  status_code: z.coerce
    .number()
    .int()
    .positive("status_code must be greater than 0"),

  status_message: z.string().trim().min(1, "status_message is required"),

  transaction_id: z.string().trim().min(1, "transaction_id is required"),

  transaction_status: z
    .string()
    .trim()
    .min(1, "transaction_status is required"),

  transaction_time: z.string().trim().min(1, "transaction_time is required"),

  va_numbers: z.array(VaNumberSchema),
});

export type CreateNotifDto = z.infer<typeof CreateNotifSchema>;
