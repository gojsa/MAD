import { ChangeEvent } from 'react'

import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

import {
  setCurrentTotal,
  setRebateValue,
  setSelectedArticle,
} from '../../features/retailSlice'

const useAddRebate = () => {
  //Toasts
  const rebateIssue = () =>
    toast('Dodaj cijenu i amountičinu!', {
      position: 'top-left',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'light',
    })

  const { selectedArticle }: { selectedArticle: any } = useAppSelector(
    (state) => state.retail
  )

  const dispatch = useAppDispatch()

  //Rebate can be added as a percentage of a value (in currency)
  //When added in currency it will be multiplied by amout of articles added
  const addRebate = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.name === 'value') {
      if (!selectedArticle.amount || !selectedArticle.sale_price)
        return rebateIssue()

      dispatch(setRebateValue(e.target.value))
      //Total for current selected article
      const total =
        selectedArticle.amount * selectedArticle.sale_price -
        parseFloat(e.target.value) * selectedArticle.amount
      dispatch(setCurrentTotal(total.toFixed(2)))
      dispatch(
        setSelectedArticle({
          ...selectedArticle,
          discount: parseFloat(e.target.value).toFixed(2),
          total: total.toFixed(2),
        })
      )
    } else {
      if (!selectedArticle.amount || !selectedArticle.sale_price)
        return rebateIssue()

      //Total for current selected article
      const total =
        selectedArticle.amount * selectedArticle.sale_price -
        ((selectedArticle.amount * selectedArticle.sale_price) / 100) *
          parseInt(e.target.value)
      dispatch(setCurrentTotal(total.toFixed(2)))
      dispatch(
        setSelectedArticle({
          ...selectedArticle,
          total: total.toFixed(2),
          discount: parseInt(e.target.value).toFixed(2) + '%',
        })
      )
      dispatch(setRebateValue(e.target.value))
    }
  }

  return addRebate
}

export default useAddRebate
