import { MouseEvent, useEffect } from 'react'
import { reset } from '../../features/retailSlice'
import { get } from '../../features/storageSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

import {
  useCreateRetailInvoiceMutation,
  useGetLastInvoiceQuery,
} from '../../app/services/retailAPI'

const useCreateNewInvoice = () => {
  const userId = JSON.parse(localStorage.getItem('user')!)?.users_id
  const organisation_unit_id = parseInt(localStorage.getItem('companyId')!)

  useEffect(() => {
    get()
  }, [])

  const { storages } = useAppSelector((state) => state.storage)

  const { user } = useAppSelector((state) => state.auth)

  const dispatch = useAppDispatch()

  const { data: lastInvoice, refetch } = useGetLastInvoiceQuery()
  const [createRetailInvoice] = useCreateRetailInvoiceMutation()

  const handleCreateNewInvoice = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    dispatch(reset())
    await createRetailInvoice({
      userId: user?.users_id!,
      invoiceObj: {
        date: new Date(),
        status: 'neplaćeno',
        currency: 'KM',
        subtotal_without_vat: '0',
        discount: '0%',
        vat: '14.5299%',
        total_invoice: '0',
        invoice_number: lastInvoice
          ? (parseInt(lastInvoice.invoice_number) + 1).toString()
          : '1',
        organisation_unit_id: organisation_unit_id,
      },
    })
    await refetch()
  }

  return handleCreateNewInvoice
}

export default useCreateNewInvoice
