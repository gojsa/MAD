import useIncreaseAmount from '../../hooks/article/useIncreaseAmount'
import useDecreaseAmount from '../../hooks/article/useDecreaseAmount'
import useRemoveArticle from '../../hooks/article/useRemoveArticle'
import useRemoveAllArticles from '../../hooks/article/useRemoveAllArticles'

import * as Bs from 'react-icons/bs'
import * as Hi from 'react-icons/hi'

const ActionBtns = () => {
  const handleIncreaseAmount = useIncreaseAmount()
  const handleDecreaseAmount = useDecreaseAmount()
  const removeAllArticles = useRemoveAllArticles()
  const handleRemoveArticle = useRemoveArticle()
  return (
    <div>
      <div className='flex justify-evenly mt-10 mb-3'>
        <button className='action-btn' onClick={handleIncreaseAmount}>
          <Bs.BsPlusLg className='h-10 w-10' />
        </button>
        <button className='action-btn' onClick={handleDecreaseAmount}>
          <Hi.HiMinus className='h-10 w-10' />
        </button>
        <button
          className='theme-gradient w-full h-[60px] mx-1 font-semibold'
          onClick={handleRemoveArticle}
        >
          Obriši artikal
        </button>
      </div>
      <div className='w-full flex justify-center items-center'>
        <button
          className='w-full theme-gradient text-center font-semibold h-[60px]'
          onClick={removeAllArticles}
        >
          Obriši sve artikle
        </button>
      </div>
    </div>
  )
}

export default ActionBtns
