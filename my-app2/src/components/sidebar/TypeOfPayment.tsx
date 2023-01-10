import { useState } from 'react'
import { toast } from 'react-toastify'
import { useAppSelector } from '../../app/hooks'
import EditTypeOfPaymentModal from '../Modals/EditTypeOfPaymentModal'

const TypeOfPayment = () => {
  const [openEdit, setOpenEdit] = useState(false)
  const [paymentIndex, setPaymentIndex] = useState(0)

  const { paymentMethods, selectedInvoice } = useAppSelector(
    (state) => state.retail
  )

  const SImethodOfPayment: { method: number; total: number; name: string }[] =
    selectedInvoice.method_of_payment
      ? JSON.parse(selectedInvoice?.method_of_payment)
      : []

  //Toasts
  const storning = () =>
    toast('Nije moguća izmjena na fiskalizovanu fakturu', {
      type: 'error',
      hideProgressBar: true,
      position: 'top-left',
      pauseOnHover: true,
    })

  return (
    <>
      <div className='w-full text-center mt-5 flex flex-col xl:h-[150px] h-[300px] overflow-y-auto pb-10 hover:cursor-pointer'>
        {(SImethodOfPayment.length ? SImethodOfPayment : paymentMethods).map(
          (method, i) => (
            <div
              key={i}
              onClick={() => {
                if (selectedInvoice.fiscal_status === 'Y') return storning()
                setOpenEdit(true)
                setPaymentIndex(i)
              }}
              className='w-full flex bg-gradient-to-b from-[#CEDBE4] to-[#3A9FD8] relative items-center mb-2'
            >
              <label className='w-full h-10 mb-0'>{method.total}</label>
              <label className='w-full h-10 mb-0 font-semibold'>
                {method.name}
              </label>
            </div>
          )
        )}
      </div>
      <EditTypeOfPaymentModal
        open={openEdit}
        onClose={setOpenEdit}
        index={paymentIndex}
      />
    </>
  )
}

export default TypeOfPayment
