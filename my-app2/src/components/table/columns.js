export const cols = [
  { Header: 'Šifra', accessor: 'article_id' },
  { Header: 'Artikal', accessor: 'article_name' },
  { Header: 'Komada', accessor: 'amount' },
  {
    Header: 'Cijena',
    accessor: 'sale_value',
  },
  {
    Header: 'Rabat',
    accessor: 'discount',
    Cell: ({ row }) => {
      return parseFloat(row.original.discount) * parseFloat(row.original.amount)
    },
  },
  { Header: 'Total', accessor: 'selling_price' },
]
