export interface UserType {
  companies: Company[]
  email: string
  functions: string[]
  name: string
  placeOfExpense: PlaceOfExpense[]
  token: string
  user_name: string
  users_id: string
}

export interface Company {
  companies_id: number
  name: string
}

export interface PlaceOfExpense {
  name: string
  organizational_unit: OrganizationalUnit
  places_of_expenses_id: number
}

export interface OrganizationalUnit {
  companies_id: number
  name: string
  organizational_units_id: number
}
