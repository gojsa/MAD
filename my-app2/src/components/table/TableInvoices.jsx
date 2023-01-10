import { useMemo, useEffect } from 'react'
import * as Ai from 'react-icons/ai'
import * as Fa from 'react-icons/fa'

// import { DBRetailInvoice } from '../../../root/models/RetailInvoiceModel'
import { invoiceColumns as cols } from './invoiceColumns'

import {
  useDeleteRetailInvoiceMutation,
  useGetLastInvoiceQuery,
  useGetRetailInvoicesQuery,
} from '../../app/services/retailAPI'

import { setSelectedInvoice } from '../../features/retailSlice'
import { useFilters, usePagination, useTable } from 'react-table'
import { toast } from 'react-toastify'
import Pagination from './Pagination'
import { useDispatch } from 'react-redux'

// type Props = {
//   setOpenViewInvoices: React.Dispatch<SetStateAction<boolean>>
// }

const TableInvoices = ({ setOpenViewInvoices }) => {
  const { data: retailInvoices } = useGetRetailInvoicesQuery()
  const { data: lastInvoice } = useGetLastInvoiceQuery()

  const dispatch = useDispatch()

  const articles = useMemo(() => retailInvoices || [], [retailInvoices])

  const columns = useMemo(() => cols, [])

  const [deleteRetailInvoice, { data, error }] =
    useDeleteRetailInvoiceMutation()

  const issue = () =>
    toast('Nije moguće brisanje fiskalizovane fakture', {
      position: 'top-left',
      pauseOnHover: true,
      type: 'error',
      hideProgressBar: true,
    })

  useEffect(() => {
    if (error?.data?.message) issue()
  }, [error])

  // <T extends { original: DBRetailInvoice }>
  const handleSelect = (row) => {
    const invoice = row.original
    if (lastInvoice?.invoice_number === invoice.invoice_number) {
      dispatch(setSelectedInvoice({}))
    } else {
      dispatch(setSelectedInvoice(invoice))
    }
    setOpenViewInvoices(false)
  }

  const handleDeleteInvoice = (row) => {
    deleteRetailInvoice(row.original.invoice_id)
  }

  const tableHooks = (hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        id: 'view',
        Header: 'view',
        Cell: ({ row }) => (
          <div className='w-full flex justify-center items-center cursor-pointer h-full'>
            <Ai.AiFillEye
              className='h-6 w-6'
              onClick={() => handleSelect(row)}
            />
          </div>
        ),
      },
      {
        id: 'delete',
        Header: 'Obriši',
        Cell: ({ row }) => (
          <div className='w-full flex justify-center items-center cursor-pointer h-full'>
            <Fa.FaTrashAlt
              className='h-6 w-6'
              onClick={() => handleDeleteInvoice(row)}
            />
          </div>
        ),
      },
    ])
  }

  const tableInstance = useTable(
    {
      columns,
      data: articles,
      initialState: { hiddenColumns: ['organisation_unit_id', 'user_id'] },
    },
    useFilters,
    tableHooks,
    usePagination
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    page,
    prepareRow,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    pageCount,
    setPageSize,
  } = tableInstance

  return (
    <>
      <Pagination
        nextPage={nextPage}
        previousPage={previousPage}
        canNextPage={canNextPage}
        canPreviousPage={canPreviousPage}
        pageOptions={pageOptions}
        state={state}
        gotoPage={gotoPage}
        pageCount={pageCount}
        setPageSize={setPageSize}
      />
      <div className='table-wraper'>
        <table {...getTableProps()} className='retail-table-articles'>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index, arr) => (
                  <th
                    {...column.getHeaderProps()}
                    className={
                      index === arr.length - 1
                        ? 'px-2 py-5 text-center text-xl font-bold text-white h-[60px]'
                        : 'px-2 py-5 text-center text-xl font-bold text-white border-r-[1px] border-white h-[60px]'
                    }
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default TableInvoices
