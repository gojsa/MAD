import { MouseEvent } from 'react'
import { toast } from 'react-toastify'

import {
  setCurrentTotal,
  setRebateValue,
  setSelectecedInvoiceArticles,
  setSelectedArticle,
} from '../../features/retailSlice'

import {
  useCancelInvoiceArticleMutation,
  useDeleteInvoiceArticleMutation,
} from '../../app/services/invoiceArticleApi'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

const useRemoveArticle = () => {
  const {
    selectedArticle,
    selectedInvoice,
    isStorning,
    selectedInvoiceArticles,
  } = useAppSelector((state) => state.retail)

  const dispatch = useAppDispatch()

  const [deleteArticle] = useDeleteInvoiceArticleMutation()
  const [cancelInvoiceArticle] = useCancelInvoiceArticleMutation()

  const handleRemoveArticle = (e) => {
    e.preventDefault()
    if (!selectedArticle.invoice_article_id || !selectedArticle.amount) return

    if (selectedInvoice.fiscal_status === 'Y') return storning()

    if (selectedInvoice.fiscal_status === 'Y' && isStorning) {
      const index = selectedInvoiceArticles.findIndex(
        (el) => el.article_id === selectedArticle.article_id
      )

      const newArr = [...selectedInvoiceArticles]
      newArr.splice(index, 1)
      dispatch(setSelectecedInvoiceArticles(newArr))
    }

    cancelInvoiceArticle({
      selling_price: selectedArticle.selling_price,
      invoice_article_id: selectedArticle.invoice_article_id,
      storage_id: 1,
      storage_movement_id: selectedArticle.storage_movement_id,
      article_id: selectedArticle.article_id,
      saldo: parseInt(selectedArticle.amount),
    })
    deleteArticle(selectedArticle.invoice_article_id)
    dispatch(setSelectedArticle({}))
    dispatch(setCurrentTotal(''))
    dispatch(setRebateValue(''))
  }

  //Toasts
  const storning = () =>
    toast('Nemoguće brisanje artikla na fiskalizovanoj fakturu', {
      type: 'error',
      position: 'top-left',
      hideProgressBar: true,
      pauseOnHover: true,
    })

  return handleRemoveArticle
}

export default useRemoveArticle
