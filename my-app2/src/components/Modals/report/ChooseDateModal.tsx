import { MouseEvent, useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import ReactDatePicker from 'react-datepicker'
import { usePrintPeriodicReportInvoiceOnRegisterMutation } from '../../../app/services/retailAPI'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { toast } from 'react-toastify'
import { setIsLoading } from '../../../features/retailSlice'

type Props = {
  open: boolean
  setOpenChoose: React.Dispatch<React.SetStateAction<boolean>>
  setOpenReport: React.Dispatch<React.SetStateAction<boolean>>
}

const ChooseDatePeriodModal = ({
  open,
  setOpenChoose,
  setOpenReport,
}: Props) => {
  const [dateFrom, setDateFrom] = useState(new Date())
  const [dateTo, setDateTo] = useState(new Date())

  const dispatch = useAppDispatch()

  const { selectedInvoice } = useAppSelector((state) => state.retail)

  const [printPeriodicReportInvoice, { isLoading }] =
    usePrintPeriodicReportInvoiceOnRegisterMutation()

  useEffect(() => {
    dispatch(setIsLoading(isLoading))
  }, [isLoading])

  const handlePrintPeriodicReportInvoice = (
    e: MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault()
    if (dateFrom instanceof Date && dateTo instanceof Date)
      printPeriodicReportInvoice({ dateFrom: dateFrom, dateTo: dateTo })
  }

  //Toasts
  const storning = () =>
    toast('Nemoguće dodavanje artikla na fiskalizovanu fakturu', {
      type: 'error',
      position: 'top-left',
      hideProgressBar: true,
      pauseOnHover: true,
    })

  return (
    <>
      <Dialog open={open} onClose={() => setOpenChoose(false)}>
        <div className='fixed inset-0 bg-black/30' aria-hidden='true' />

        <div className='choose-date-modal-wraper'>
          <Dialog.Panel className='choose-date-modal'>
            <Dialog.Title className='choose-date-modal-title'>
              Periodični
            </Dialog.Title>
            <div className='choose-date-modal-date-wraper'>
              <label>Od</label>
              <ReactDatePicker
                className='choose-date-modal-date-picker'
                placeholderText='Datum od'
                selected={dateFrom}
                onChange={(date: Date) => setDateFrom(date)}
              />
              <label>Do</label>
              <ReactDatePicker
                className='choose-date-modal-date-picker'
                placeholderText='Datum do'
                selected={dateTo}
                onChange={(date: Date) => setDateTo(date)}
              />
            </div>
            <section>
              <button
                onClick={() => {
                  setOpenChoose(false)
                }}
                className='quit'
              >
                Odustani
              </button>
              <button
                onClick={(e) => {
                  if (selectedInvoice.fiscal_status === 'Y') return storning()
                  handlePrintPeriodicReportInvoice(e)
                  setOpenChoose(false)
                  setOpenReport(false)
                }}
                className='save'
              >
                Printaj
              </button>
            </section>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}

export default ChooseDatePeriodModal
