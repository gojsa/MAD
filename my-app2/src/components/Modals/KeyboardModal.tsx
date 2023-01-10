import { Dialog } from '@headlessui/react'
import { MouseEvent } from 'react'

type Props = {
  duplicate?: boolean
  setGivenAmount: React.Dispatch<React.SetStateAction<number>> | any
  setDisplayKeyboard: React.Dispatch<React.SetStateAction<boolean>>
  displayKeyboard: boolean
}

const KeyboardModal = ({
  setGivenAmount,
  setDisplayKeyboard,
  displayKeyboard,
  duplicate,
}: Props) => {
  const onBtnClick = (e: MouseEvent<HTMLButtonElement>, num: number) => {
    e.preventDefault()

    setGivenAmount((prev:any) => {
      return parseInt(prev.toString() + num)
    })
  }

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setGivenAmount(0)
  }

  return (
    <Dialog open={displayKeyboard} onClose={() => setDisplayKeyboard(false)}>
      <div
        className={
          duplicate
            ? 'w-[300px] h-[300px] bg-[#222433] drop-shadow-[0px_0px__10px_rgba(0,0,0,0.9)] absolute right-[43%] top-[52%]'
            : 'w-[300px] h-[300px] bg-[#222433] drop-shadow-[0px_0px__10px_rgba(0,0,0,0.9)] absolute right-10 top-[720px]'
        }
      >
        <Dialog.Panel className='w-full h-full'>
          <div className='w-full h-full grid grid-rows-4 grid-cols-3 gap-2 p-4'>
            <button
              onClick={(e) => onBtnClick(e, 1)}
              className='input-keyborad-btn'
            >
              1
            </button>
            <button
              onClick={(e) => onBtnClick(e, 2)}
              className='input-keyborad-btn'
            >
              2
            </button>
            <button
              onClick={(e) => onBtnClick(e, 3)}
              className='input-keyborad-btn'
            >
              3
            </button>
            <button
              onClick={(e) => onBtnClick(e, 4)}
              className='input-keyborad-btn'
            >
              4
            </button>
            <button
              onClick={(e) => onBtnClick(e, 5)}
              className='input-keyborad-btn'
            >
              5
            </button>
            <button
              onClick={(e) => onBtnClick(e, 6)}
              className='input-keyborad-btn'
            >
              6
            </button>
            <button
              onClick={(e) => onBtnClick(e, 7)}
              className='input-keyborad-btn'
            >
              7
            </button>
            <button
              onClick={(e) => onBtnClick(e, 8)}
              className='input-keyborad-btn'
            >
              8
            </button>
            <button
              onClick={(e) => onBtnClick(e, 9)}
              className='input-keyborad-btn'
            >
              9
            </button>
            <button onClick={handleDelete} className='theme-gradient'>
              C
            </button>
            <button
              onClick={(e) => onBtnClick(e, 0)}
              className='input-keyborad-btn'
            >
              0
            </button>
            <button
              onClick={() => setDisplayKeyboard(false)}
              className='theme-gradient'
            >
              Zatvori
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default KeyboardModal
