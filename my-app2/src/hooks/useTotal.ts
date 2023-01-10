import { useEffect, useState } from 'react'

import { setInvoiceTotal } from '../features/retailSlice'
import { useAppDispatch, useAppSelector } from '../app/hooks'

import useArticles from './article/useArticles'

const useTotal = () => {
  const [total, setTotal] = useState('')

  const { selectedInvoice, isStorning } = useAppSelector(
    (state) => state.retail
  )

  const dispatch = useAppDispatch()

  const articles = useArticles()

  useEffect(() => {
    if (!articles) return
    const summedAmount = articles.reduce((prev, curr) => {
      return prev + parseFloat(curr.selling_price!)
    }, 0)

    const rounded = summedAmount.toFixed(2)

    //Create negative total if invoice was printed and wants to be storned
    if (
      (selectedInvoice.fiscal_status === 'Y' && isStorning) ||
      (selectedInvoice?.invoice_number?.includes('S') && !isStorning)
    ) {
      const negativeTotal = -Math.abs(parseFloat(rounded))
      setTotal(negativeTotal.toString())
      dispatch(setInvoiceTotal(negativeTotal))
    } else {
      setTotal(rounded)
      dispatch(setInvoiceTotal(rounded))
    }
  }, [articles, isStorning])

  return total
}

export default useTotal
