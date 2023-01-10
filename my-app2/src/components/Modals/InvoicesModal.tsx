import { Dialog } from '@headlessui/react'
import { Dispatch, SetStateAction } from 'react'
import TableInvoices from '../table/TableInvoices'

type Props = {
  open: boolean
  setOpenViewInvoices: Dispatch<SetStateAction<boolean>>
}

const ViewInvoicesModal = ({ open, setOpenViewInvoices }: Props) => {
  return (
    <Dialog open={open} onClose={() => setOpenViewInvoices(false)}>
      <div className='fixed inset-0' aria-hidden='true' />
      <div className='fixed inset-0 bg-[#349DD8] flex items-start justify-center'>
        <Dialog.Panel className='w-4/5 h-full'>
          <Dialog.Title className='w-full text-3xl font-semibold my-10 text-white text-start'>
            Pregled računa
          </Dialog.Title>
          {/* Table */}
          <div className='max-h-[75vh] min-h-[75vh] overflow-y-auto'>
            <TableInvoices setOpenViewInvoices={setOpenViewInvoices} />
          </div>
          <section className='w-full flex justify-evenly items-center'>
            <button
              onClick={() => setOpenViewInvoices(false)}
              className='p-5 outline-none  bg-gradient-to-b from-[#CFDBE2] to-[#349DD8] text-red text-2xl text-red-600 font-bold w-[300px]'
            >
              Zatvori
            </button>
          </section>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default ViewInvoicesModal
