import { ChangeEvent, useState, useRef } from 'react'
import { useAppSelector } from '../../app/hooks'
import useReceipt from '../../hooks/useReciept'
import KeyboardModal from '../../components/Modals/KeyboardModal'

const ReturnChangeSection = () => {
  //keyboard ref
  const inputRef = useRef(null)
  const [displayKeyboard, setDisplayKeyboard] = useState(false)
  const [givenAmount, setGivenAmount] = useState(0)
  const { total } = useAppSelector((state) => state.retail)

  const reciept = useReceipt(givenAmount, total.toString())
  return (
    <div className='w-full mt-10 relative'>
      <h2 className='text-white text-2xl mb-2'>Plaćeno:</h2>
      <div className='relative'>
        <input
          ref={inputRef}
          type='number'
          onClick={() => setDisplayKeyboard(true)}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setGivenAmount(parseFloat(e.target.value))
          }
          value={givenAmount !== 0 ? givenAmount : ''}
          className='shadow-input h-[60px] w-full bg-[#003E65] outline-none pl-4 text-2xl font-semibold text-white'
        />
        <KeyboardModal
          displayKeyboard={displayKeyboard}
          setDisplayKeyboard={setDisplayKeyboard}
          setGivenAmount={setGivenAmount}
        />
      </div>
      <div className='flex w-full mt-5 h-[60px]'>
        <h2 className='text-white text-2xl mb-2'>Za vratiti:</h2>
        <label className='ml-10 text-center text-2xl text-black font-semibold mb-0'>
          {givenAmount === 0 ? '' : reciept}
        </label>
      </div>
    </div>
  )
}

export default ReturnChangeSection
