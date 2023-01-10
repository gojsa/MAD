import { useState, useEffect } from 'react'

const useReceipt = (givenAmount: number, totalAmount: string) => {
  const [reciept, setReciept] = useState(0)

  useEffect(() => {
    const reciept = givenAmount - parseFloat(totalAmount)

    setReciept(reciept)
  }, [givenAmount, totalAmount])

  return reciept
}

export default useReceipt
