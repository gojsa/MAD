import { useState, useEffect } from 'react'
import { useAppDispatch } from '../app/hooks'

import { setVat } from '../features/retailSlice'

const useVAT = (totalAmount: string) => {
  const [PDV, setPDV] = useState('')

  const dispatch = useAppDispatch()

  useEffect(() => {
    const pdvAmount = (parseFloat(totalAmount) / 100) * 14.5299

    const rounded = pdvAmount.toFixed(2)

    setPDV(rounded)
    dispatch(setVat(rounded))
  }, [totalAmount])
  return PDV
}

export default useVAT
