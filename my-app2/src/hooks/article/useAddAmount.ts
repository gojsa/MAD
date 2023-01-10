import { ChangeEvent } from 'react'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setSelectedArticle } from '../../features/retailSlice'

const useAddAmount = () => {
  const { selectedArticle } = useAppSelector((state) => state.retail)

  const dispatch = useAppDispatch()

  const addAmount = (e: ChangeEvent<HTMLInputElement>) => {
    if (!selectedArticle.sale_price) return
    dispatch(
      setSelectedArticle({
        ...selectedArticle,
        amount: e.target.value,
        total:
          parseFloat(selectedArticle.sale_price) * parseInt(e.target.value),
      })
    )
  }

  return addAmount
}

export default useAddAmount
