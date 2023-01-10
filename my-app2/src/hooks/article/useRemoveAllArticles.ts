import { MouseEvent } from 'react'
import { toast } from 'react-toastify'
import { reset } from '../../features/retailSlice'
import {
  useCancelInvoiceArticleMutation,
  useDeleteAllInvoiceArticlesMutation,
  useGetInvoiceArticlesQuery,
} from '../../app/services/invoiceArticleApi'
import { useGetLastInvoiceQuery } from '../../app/services/retailAPI'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

const useRemoveAllArticles = () => {
  const dispatch = useAppDispatch()

  const { selectedInvoice, isStorning } = useAppSelector(
    (state) => state.retail
  )

  const { data: lastInvoice } = useGetLastInvoiceQuery()

  const { data: invoiceArticles } = useGetInvoiceArticlesQuery(
    lastInvoice?.invoice_id,
    {
      skip: lastInvoice?.invoice_id ? false : true,
    }
  )

  const [deleteAllArticles] = useDeleteAllInvoiceArticlesMutation()
  const [cancelInvoiceArticle] = useCancelInvoiceArticleMutation()
  const arr = invoiceArticles?.map((art) => ({
    invoice_article_id: art.invoice_article_id,
    storage_id: 1,
    selling_price: art.selling_price,
    storage_movement_id: art.storage_movement_id,
    article_id: art.article_id,
    saldo: parseInt(art.amount!),
  }))

  const handleRemoveAllArticles = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!arr) return
    if (selectedInvoice.fiscal_status === 'Y' || isStorning) return storning()

    if (!lastInvoice) return
    dispatch(reset())

    cancelInvoiceArticle(arr)
    deleteAllArticles(lastInvoice.invoice_id)
  }

  //Toasts
  const storning = () =>
    toast('Nemoguće brisanje svih artikala', {
      type: 'error',
      position: 'top-left',
      hideProgressBar: true,
      pauseOnHover: true,
    })

  return handleRemoveAllArticles
}

export default useRemoveAllArticles
