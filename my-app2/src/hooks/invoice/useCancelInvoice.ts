import { MouseEvent, useEffect } from 'react'

import { useGetInvoiceArticlesQuery } from '../../app/services/invoiceArticleApi'
import {
  useCancelInvoiceMutation,
  useStornoRetailInvoiceOnRegisterMutation,
} from '../../app/services/retailAPI'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setIsLoading } from '../../features/retailSlice'

const useCancelInvoice = () => {
  const { selectedInvoiceArticles, selectedInvoice } = useAppSelector(
    (state) => state.retail
  )
  const { data: allSelectedInvoiceArticles } = useGetInvoiceArticlesQuery(
    selectedInvoice.invoice_id,
    { skip: selectedInvoice.invoice_id ? false : true }
  )

  const dispatch = useAppDispatch()

  //Used as storno func
  const [cancelInvoice] = useCancelInvoiceMutation()
  const [stornoInvoice, { isLoading, data }] =
    useStornoRetailInvoiceOnRegisterMutation()

  useEffect(() => {
    dispatch(setIsLoading(isLoading))
  }, [isLoading])

  const handleCancelInvoice = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!selectedInvoice.fiscal_status || selectedInvoiceArticles.length === 0)
      return
    const allArticlesAmount = allSelectedInvoiceArticles?.reduce(
      (prev, curr) => {
        return prev + parseInt(curr.amount)
      },
      0
    )

    const selectedInvoiceArticleAmount = selectedInvoiceArticles?.reduce(
      (prev, curr) => {
        return prev + parseInt(curr.amount!)
      },
      0
    )
    const cancelType =
      selectedInvoiceArticleAmount === allArticlesAmount ? 'S' : 'DS'

    stornoInvoice(selectedInvoice.invoice_id)
      .unwrap()
      .then((data) => {
        //Extracting fiscal_number from response
        const lines = data?.body?.split('\n')
        const line = lines![5]
        const value = line.substring(
          line.indexOf('>') + 1,
          line.lastIndexOf('<')
        )

        cancelInvoice({
          srrNumber: value,
          articles: selectedInvoiceArticles,
          cancel_type: cancelType,
          invoice_id: selectedInvoice.invoice_id,
        })
      })
  }

  return handleCancelInvoice
}

export default useCancelInvoice
