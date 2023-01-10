export type RetailInvoiceObject = {
  date: string | Date
  status: string
  currency: string
  subtotal_without_vat: string
  discount: string
  vat: string
  total_invoice: string
  user_id: number
  organisation_unit_id: number
  fiscal_number: string
  invoice_number: string
}

export type DBRetailInvoice = {
  created_at?: string
  updated_at?: string
  currency: string
  customer_name: string
  customer_number: string
  customer_order_number: string
  date: string
  date_of_delivery: string
  date_of_order: string
  discount: string
  fiscal_number: string
  fiscal_status: string
  invoice_id: number
  invoice_number: string
  invoice_type: string
  method_of_payment: string
  organisation_unit_id: string
  required_delivery_date: string
  status: string
  subtotal_without_vat: string
  total_invoice: number
  user_id: string
  valid: string
  vat: string
}
