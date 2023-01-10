export interface ArticleModel {
  article_id?: number
  article: number
  code: string
  name: string
  description: string
  unit_of_measure: string
  negative_stock: string
  stock_type: string
  book_groups: string
  type_of_goods: string
  type_of_service: string
  type_z_t: string
  customs_tariff_group: string
  goods_with_origin: string
  inventory_account: string
  account_expense: string
  average_entry_price: string
  sale_price: string
  last_entry_price: string
  average_selling_price: string
  last_sale_price: string
  total_stock: string
  quantity_on_the_production_order: string
  quantity_on_the_sales_order: string
  quantity_on_the_purchase_order: string
  procurement_time: string
  way_the_article_was_created: string
  component_number: string
  operation_plan_number: string
  inventory_valuation: string
  valid: string
}

export interface DBArticleModel extends ArticleModel {
  article_id: number
}
