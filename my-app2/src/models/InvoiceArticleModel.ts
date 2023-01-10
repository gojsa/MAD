export interface InvoiceArticleModel {
  storage_id: number
  article_name: string
  article_id: number
  storage_movement_id: number
  description: string
  value_with_vat: string
  type_of_good: string
  source: string
  source_number: string
  storage_location: string
  amount: string
  unit_of_measure: string
  selling_price: string
  discount: string
  sale_value: string
  vat: string
  sale_value_with_vat: string
  type_of_movement: string
  valid: string
}

export interface DBInvoiceArticleModel extends InvoiceArticleModel {
  created_at: Date
  invoice_article_id: number
  invoice_id: number
  type: null
  updated_at: Date
}

export interface CancelInvoiceBody extends DBInvoiceArticleModel {
  saldo: number
}
