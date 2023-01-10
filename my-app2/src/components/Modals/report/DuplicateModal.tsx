import { useState, MouseEvent } from 'react'
import { Dialog } from '@headlessui/react'
import KeyboardModal from '../KeyboardModal'
import { usePrintDuplicateInvoiceOnRegisterMutation } from '../../../app/services/retailAPI'
import { useAppSelector } from '../../../app/hooks'
import { toast } from 'react-toastify'

type Props = {
  setOpenDuplicate: React.Dispatch<React.SetStateAction<boolean>>
  openDuplicate: boolean
  setOpenReport: React.Dispatch<React.SetStateAction<boolean>>
}

const DuplicateModal = ({
  setOpenDuplicate,
  openDuplicate,
  setOpenReport,
}: Props) => {
  const [storned, setStorned] = useState(false)
  const [duplicateID, setDuplicateID] = useState('')
  const [openKeyBoard, setOpenKeyBoard] = useState(false)

  const { selectedInvoice } = useAppSelector((state) => state.retail)

  const [printDuplicateInvoice] = usePrintDuplicateInvoiceOnRegisterMutation()

  const handePrintDuplicateInvoice = (e: MouseEvent) => {
    e.preventDefault()
    if (selectedInvoice.fiscal_status === 'Y') return storning()
    if (storned) {
      printDuplicateInvoice({
        number: duplicateID,
        command: 'SRR',
      })
    } else {
      printDuplicateInvoice({
        number: duplicateID,
        command: 'SFR',
      })
    }
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
      <Dialog open={openDuplicate} onClose={() => setOpenDuplicate(false)}>
        <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
        <div className='duplicate-modal-wraper'>
          <Dialog.Panel className='duplicate-modal'>
            <Dialog.Title className='duplicate-modal-title'>
              Duplikat
            </Dialog.Title>
            <form>
              <div>
                <input
                  type='text'
                  value={duplicateID ? duplicateID : ''}
                  onClick={() => setOpenKeyBoard(true)}
                  onChange={(e) => setDuplicateID(e.target.value)}
                  placeholder='Broj za duplikat...'
                />
                <div className='checkbox-wrapper-21'>
                  <label className='control control--checkbox text-black'>
                    Stornirani
                    <input
                      type='checkbox'
                      checked={storned}
                      onChange={() => setStorned(!storned)}
                    />
                    <div className='control__indicator'></div>
                  </label>
                </div>
              </div>
              <div className='w-full flex justify-evenly items-center mb-5'>
                <button
                  onClick={() => setOpenDuplicate(false)}
                  className='quit'
                >
                  Odustani
                </button>
                <button
                  onClick={(e) => {
                    handePrintDuplicateInvoice(e)
                    setOpenDuplicate(false)
                    setOpenReport(false)
                    setDuplicateID('')
                  }}
                  className='save'
                >
                  Printaj
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      <KeyboardModal
        duplicate={true}
        displayKeyboard={openKeyBoard}
        setDisplayKeyboard={setOpenKeyBoard}
        setGivenAmount={setDuplicateID}
      />
    </>
  )
}

export default DuplicateModal
