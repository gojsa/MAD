import { MouseEvent, useEffect } from 'react'
import { toast } from 'react-toastify'

import { usePostMethodOfPaymentOnInvoiceMutation } from '../../app/services/methodOfPaymentApi'
import {
  useCheckStorageStatusQuery,
  useCreateRetailInvoiceMutation,
  useGetLastInvoiceQuery,
  usePrintRetailInvoiceOnRegisterMutation,
} from '../../app/services/retailAPI'

import { reset, setIsLoading } from '../../features/retailSlice'

import { useAppDispatch, useAppSelector } from '../../app/hooks'

const usePrintInvoiceToRegister = () => {
  const organisation_unit_id = parseInt(localStorage.getItem('companyId')!)
  const { paymentMethods, total, selectedInvoice } = useAppSelector(
    (state) => state.retail
  )

  const checkPaymentMethodTotal = paymentMethods.reduce((prev, curr) => {
    return prev + curr.total
  }, 0)

  const { user } = useAppSelector((state) => state.auth)

  const dispatch = useAppDispatch()

  const { data: lastInvoice, refetch } = useGetLastInvoiceQuery()
  const [printInvoice, { isLoading }] =
    usePrintRetailInvoiceOnRegisterMutation()
  const [createRetailInvoice] = useCreateRetailInvoiceMutation()
  const [postMethodOfPaymentToInvoice] =
    usePostMethodOfPaymentOnInvoiceMutation()
  const { isError, refetch: checkStorageStatus } = useCheckStorageStatusQuery(
    lastInvoice?.invoice_id!,
    {
      skip: lastInvoice?.invoice_id ? false : true,
    }
  )

  useEffect(() => {
    dispatch(setIsLoading(isLoading))
  }, [isLoading])

  const handlePrintInvoice = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (checkPaymentMethodTotal.toFixed(2) !== total.toString())
      return notEqual()

    //Dont allow invoice to be printed if it was already printed
    if (selectedInvoice.fiscal_status === 'Y') return storning()

    //Dont allow invoice tok be printed if method(s) of payment haven't been selected
    if (!lastInvoice || paymentMethods.length === 0) return noTypeOfPayment()

    //Check for storage issues
    //if issus dont print
    await checkStorageStatus()
    if (isError) return issue()

    //POST payment method(s) to invocie
    await postMethodOfPaymentToInvoice({
      invoice_id: lastInvoice.invoice_id,
      methods_of_payment: paymentMethods,
    })
    //Print invoice to register
    await printInvoice({ invoiceId: lastInvoice.invoice_id, total: total })
    //Creating new invoice to reset the state
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
    dispatch(reset())
  }

  //Toasts
  const storning = () =>
    toast('Nemoguće dodavanje artikla na fiskalizovanu fakturu', {
      type: 'error',
      position: 'top-left',
      hideProgressBar: true,
      pauseOnHover: true,
    })
  const noTypeOfPayment = () =>
    toast('Dodajte način plaćanja', {
      position: 'top-left',
      type: 'error',
      pauseOnHover: true,
      hideProgressBar: true,
    })
  const issue = () =>
    toast('Storage issue', {
      position: 'top-left',
      type: 'error',
      pauseOnHover: true,
      hideProgressBar: true,
    })
  const notEqual = () =>
    toast('Greška u iznosu načina plaćanja', {
      position: 'top-left',
      type: 'error',
      pauseOnHover: true,
      hideProgressBar: true,
    })

  return handlePrintInvoice
}

export default usePrintInvoiceToRegister
