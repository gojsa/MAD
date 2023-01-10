import { MouseEvent, ChangeEvent } from 'react'
import { setEdited, setPaymentMethods } from '../../features/retailSlice'

import { useGetMethodsOfPaymentQuery } from '../../app/services/methodOfPaymentApi'

import { Dialog } from '@headlessui/react'
import Select from 'react-select'
import { methodOfPaymentSelect } from '../../data'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

type Props = {
  open: boolean
  index: number
  onClose: React.Dispatch<React.SetStateAction<boolean>>
}

const EditTypeOfPaymentModal = ({ open, onClose, index }: Props) => {
  const { paymentMethods, edited } = useAppSelector((state) => state.retail)

  const dispatch = useAppDispatch()

  const { data: paymentOptions } = useGetMethodsOfPaymentQuery()

  const options = paymentOptions?.map((method) => ({
    label: method.name,
    value: method.method_of_payment_id,
  }))

  const handleChangePymentMethod = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const newArr = [...paymentMethods]
    const editedObj = {
      ...paymentMethods[index],
      ...edited,
    }

    newArr.splice(index, 1, editedObj)
    dispatch(setPaymentMethods(newArr))
    onClose(false)
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setEdited({
        ...edited,
        [e.target.name]: parseFloat(e.target.value),
      })
    )
  }

  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
      <div className='edit-payment-modal-wraper'>
        <Dialog.Panel className='edit-payment-method-modal'>
          <Dialog.Title className='edit-payment-modal-title'>
            Izmjeni način plaćanja
          </Dialog.Title>
          <div>
            <input
              type='number'
              placeholder='Iznos'
              name='total'
              onChange={onChange}
              defaultValue={paymentMethods[index]?.total}
            />
            <Select
              options={options as any}
              styles={methodOfPaymentSelect}
              placeholder='Način plaćanja'
              defaultValue={{
                value: paymentMethods[index]?.name,
                label: paymentMethods[index]?.name,
              }}
              onChange={(option) => {
                if (option) {
                  dispatch(
                    setEdited({
                      ...edited,
                      name: option.label,
                      method_of_payment_id: parseInt(option.value),
                    })
                  )
                }
              }}
            />
            <section>
              <button className='quit' onClick={() => onClose(false)}>
                Odustani
              </button>
              <button className='save' onClick={handleChangePymentMethod}>
                Potvrdi
              </button>
            </section>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default EditTypeOfPaymentModal
