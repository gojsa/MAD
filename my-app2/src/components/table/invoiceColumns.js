import { Column } from 'react-table'
import { RetailInvoiceObject } from '../../models/RetailInvoiceModel'

export const invoiceColumns = [
  { Header: 'Broj fiskalnog', accessor: 'fiscal_number' },
  { Header: 'Broj računa', accessor: 'invoice_number' },
  { Header: 'Organisation ID', accessor: 'organisation_unit_id' },
  { Header: 'Total', accessor: 'total_invoice' },
  { Header: 'Subtotal', accessor: 'subtotal_without_vat' },
  { Header: 'Discount', accessor: 'discount' },
  { Header: 'Status', accessor: 'status' },
  { Header: 'User ID', accessor: 'user_id' },
  {
    Header: 'Datum',
    accessor: 'date',
    Cell: ({ row }) => {
      let year = row.original.date.toString().slice(0, 4)
      let month = row.original.date.toString().slice(5, 7)
      let day = row.original.date.toString().slice(8, 10)
      return `${day}/${month}/${year}`
    },
  },
]
