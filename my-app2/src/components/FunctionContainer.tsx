import { useState, MouseEvent } from 'react'

import ReportModal from './Modals/report/ReportModal'
import ViewInvoicesModal from './Modals/InvoicesModal'
import useCreateNewInvoice from '../hooks/invoice/useCreateNewInvoice'
import PaymentMethodOptions from './Modals/PaymentMethodOptionsModal'
import usePrintInvoiceToRegister from '../hooks/invoice/usePrintInvoiceToRegister'
import useCancelInvoice from '../hooks/invoice/useCancelInvoice'

import { setIsStorning } from '../features/retailSlice'
import { toast } from 'react-toastify'
import { useGetLastInvoiceQuery } from '../app/services/retailAPI'
import { useAppDispatch, useAppSelector } from '../app/hooks'

const FunctionsContainer = () => {
  const [openReport, setOpenReport] = useState(false)
  const [openViewInvoices, setOpenViewInvoices] = useState(false)
  const [openPaymentMethod, setOpenPaymentMethod] = useState(false)

  const { isStorning, selectedInvoice } = useAppSelector(
    (state) => state.retail
  )

  const { data: lastInvoice } = useGetLastInvoiceQuery()

  const dispatch = useAppDispatch()

  const handleCancelInvoice = useCancelInvoice()

  const handleCreateNewInvoice = useCreateNewInvoice()

  const handlePrintInvoice = usePrintInvoiceToRegister()

  const printInvoice = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (
      !selectedInvoice?.invoice_number?.toString().includes('S') &&
      isStorning &&
      selectedInvoice?.fiscal_status === 'Y'
    ) {
      handleCancelInvoice(e)
      return
    }
    if (
      lastInvoice?.invoice_number.toString().includes('S') ||
      selectedInvoice?.invoice_number?.toString().includes('S') ||
      (lastInvoice?.fiscal_status === 'Y' && !isStorning) ||
      selectedInvoice?.fiscal_status === 'Y'
    )
      return storning()

    if (
      !lastInvoice?.invoice_number.toString().includes('S') &&
      Object.keys(selectedInvoice).length === 0 &&
      lastInvoice?.fiscal_status !== 'Y'
    ) {
      handlePrintInvoice(e)
      return
    }
  }

  //Toasts
  const storning = () =>
    toast('Nemoguće printanje fakture', {
      type: 'error',
      position: 'top-left',
      hideProgressBar: true,
      pauseOnHover: true,
    })
  const issue = () =>
    toast('Odaberite fakturu za storno', {
      type: 'error',
      position: 'top-left',
      hideProgressBar: true,
      pauseOnHover: true,
    })

  return (
    <>
      <div className='function-slider'>
        <button
          className='t-1 col-end-2 row-start-1 row-end-2 function'
          onClick={handleCreateNewInvoice}
        >
          Novi račun
        </button>
        <button
          className='t-2 col-end-3 row-start-1 row-end-2 function'
          onClick={printInvoice}
        >
          Printaj račun
        </button>
        <button
          className='t-3 col-end-4 row-start-1 row-end-2 function'
          onClick={() => {
            if (selectedInvoice.fiscal_status !== 'Y') return issue()
            dispatch(setIsStorning(!isStorning))
          }}
        >
          Storno
        </button>
        <button
          className='col-start-4 col-end-5 row-start-1 row-end-2 function'
          onClick={() => setOpenReport(true)}
        >
          Izvještaj
        </button>
        <button
          className='col-start-1 col-end-2 row-start-2 row-end-3 function'
          onClick={() => setOpenViewInvoices(true)}
        >
          Pregled računa
        </button>
        <button
          className='col-start-2 col-end-3 row-start-2 row-end-3 function'
          onClick={() => setOpenPaymentMethod(!openPaymentMethod)}
        >
          Način plaćanja
        </button>
      </div>
      <ReportModal openReport={openReport} setOpenReport={setOpenReport} />
      <ViewInvoicesModal
        open={openViewInvoices}
        setOpenViewInvoices={setOpenViewInvoices}
      />
      <PaymentMethodOptions
        open={openPaymentMethod}
        setOpen={setOpenPaymentMethod}
      />
    </>
  )
}

export default FunctionsContainer
