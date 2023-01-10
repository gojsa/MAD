import { useState, MouseEvent, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import React from 'react'

import DuplicateModal from './DuplicateModal'
import ChooseDateModal from './ChooseDateModal'
import {
  usePrintEndOfDayInvoiceOnRegisterMutation,
  usePrintPeriodicInvoiceOnRegisterMutation,
} from '../../../app/services/retailAPI'
import { useAppDispatch } from '../../../app/hooks'
import { setIsLoading } from '../../../features/retailSlice'

type Props = {
  openReport: boolean
  setOpenReport: React.Dispatch<React.SetStateAction<boolean>>
}

const ReportModal = ({ openReport, setOpenReport }: Props) => {
  const [openDuplicate, setOpenDuplicate] = useState(false)
  const [openChoose, setOpenChoose] = useState(false)

  const dispatch = useAppDispatch()

  const [printPeriodicInvoice, { isLoading: reportLoading }] =
    usePrintPeriodicInvoiceOnRegisterMutation()

  const [printEndOfDay, { isLoading }] =
    usePrintEndOfDayInvoiceOnRegisterMutation()

  useEffect(() => {
    dispatch(setIsLoading(isLoading))
  }, [isLoading])

  useEffect(() => {
    dispatch(setIsLoading(reportLoading))
  }, [reportLoading])

  const handlePrintPeriodicInvoice = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    printPeriodicInvoice({ dateFrom: new Date(), dateTo: new Date() })
  }

  const handlePrintEndOfDay = (e: MouseEvent) => {
    e.preventDefault()
    printEndOfDay()
  }

  return (
    <>
      <Dialog open={openReport} onClose={() => setOpenReport(false)}>
        <div className='fixed inset-0 bg-black/30' aria-hidden='true' />

        <div className='report-modal-wraper'>
          <Dialog.Panel className='report-modal'>
            <Dialog.Title className='report-modal-title'>
              Izvještaj
            </Dialog.Title>
            <div className='report-list'>
              <button
                onClick={() => {
                  setOpenChoose(true)
                }}
              >
                periodični
              </button>
              <button onClick={handlePrintPeriodicInvoice}>presjek</button>
              <button onClick={handlePrintEndOfDay}>kraj dana</button>
              <button onClick={() => setOpenDuplicate(true)}>duplikat</button>
            </div>
            <section>
              <button onClick={() => setOpenReport(false)} className='quit'>
                Odustani
              </button>
            </section>
          </Dialog.Panel>
        </div>
      </Dialog>
      <DuplicateModal
        setOpenReport={setOpenReport}
        setOpenDuplicate={setOpenDuplicate}
        openDuplicate={openDuplicate}
      />
      <ChooseDateModal
        open={openChoose}
        setOpenReport={setOpenReport}
        setOpenChoose={setOpenChoose}
      />
    </>
  )
}

export default ReportModal
