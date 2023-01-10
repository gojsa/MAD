import { Dialog } from '@headlessui/react'
import { MouseEvent } from 'react'
import { toast } from 'react-toastify'
import {
  setPaymentMethods,
  setPaymentMethodTotal,
} from '../../features/retailSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { useGetMethodsOfPaymentQuery } from '../../app/services/methodOfPaymentApi'

type Props = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const PaymentMethodOptions = ({ open, setOpen }: Props) => {
  const { paymentMethodTotal, paymentMethods, total } = useAppSelector(
    (state) => state.retail
  )

  const dispatch = useAppDispatch()

  const handlePaymentMethod = (
    e: MouseEvent<HTMLButtonElement>,
    method_of_payment_id: number,
    name: string
  ) => {
    e.preventDefault()
    if (!total || !paymentMethodTotal) return noAmount()
    dispatch(
      setPaymentMethods([
        ...paymentMethods,
        { method_of_payment_id, total: paymentMethodTotal, name },
      ])
    )
    dispatch(setPaymentMethodTotal(0))
    setOpen(false)
  }

  const { data: paymentOptions } = useGetMethodsOfPaymentQuery()

  //Toasts
  const noAmount = () =>
    toast('Dodajte artikal', {
      type: 'error',
      pauseOnHover: true,
      hideProgressBar: true,
      position: 'top-left',
    })

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
      <div className='payment-method-options-modal-wraper'>
        <Dialog.Panel className='payment-method-options-modal'>
          <Dialog.Title className='payment-method-options-modal-title'>
            Odaberite način plaćanja
          </Dialog.Title>
          <div className='options-list'>
            {paymentOptions?.map((option, i) => (
              <button
                key={i}
                onClick={(e) =>
                  handlePaymentMethod(
                    e,
                    option.method_of_payment_id,
                    option.name
                  )
                }
              >
                {option.name}
              </button>
            ))}
          </div>
          <section>
            <button
              className='quit'
              onClick={() => {
                setOpen(false)
              }}
            >
              Odustani
            </button>
          </section>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default PaymentMethodOptions
