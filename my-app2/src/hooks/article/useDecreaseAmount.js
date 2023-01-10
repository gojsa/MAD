import { MouseEvent } from 'react'
import { toast } from 'react-toastify'

import {
  setCurrentTotal,
  setRebateValue,
  setSelectedArticle,
  setSelectecedInvoiceArticles,
  setPaymentMethodTotal,
} from '../../features/retailSlice'

import {
  useCancelInvoiceArticleMutation,
  useDeleteInvoiceArticleMutation,
} from '../../app/services/invoiceArticleApi'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

const useReduceAmount = () => {
  const {
    selectedArticle,
    selectedInvoice,
    selectedInvoiceArticles,
    isStorning,
    paymentMethodTotal,
  } = useAppSelector((state) => state.retail)

  const dispatch = useAppDispatch()

  const [deleteInvoiceArticle] = useDeleteInvoiceArticleMutation()
  const [cancelInvoiceArticle] = useCancelInvoiceArticleMutation()

  const handleReduceAmount = (e) => {
    e.preventDefault()
    if (
      !selectedArticle.amount ||
      !selectedArticle.sale_value ||
      !selectedArticle.invoice_article_id ||
      !selectedArticle.sale_value_with_vat ||
      !selectedArticle.discount
    )
      return
    if (selectedInvoice.fiscal_status === 'Y' && !isStorning) return storning()
    if (isStorning) {
      const index = selectedInvoiceArticles.findIndex(
        (el) => el.article_id === selectedArticle.article_id
      )

      const newAmout = parseInt(selectedArticle.amount) - 1
      let discount

      if (selectedArticle.discount.includes('%')) {
        discount =
          ((parseFloat(selectedArticle.sale_value) * newAmout) / 100) *
          parseInt(selectedArticle.discount)
      }
      if (!selectedArticle.discount.includes('%')) {
        discount = parseFloat(selectedArticle.discount) * newAmout
      }

      if (discount === undefined) return issue()
      const new_selling_price = (
        parseFloat(selectedArticle.sale_value) * newAmout -
        discount
      ).toString()

      const newArr = [...selectedInvoiceArticles]

      if (newAmout <= 0) newArr.splice(index, 1)
      if (newAmout > 0) {
        const updatedArticle = {
          ...selectedArticle,
          amount: newAmout.toString(),
          selling_price: new_selling_price,
        }
        newArr.splice(index, 1, updatedArticle)
      }

      dispatch(setSelectecedInvoiceArticles(newArr))
      dispatch(
        setSelectedArticle({
          ...selectedArticle,
          amount: newAmout.toString(),
          selling_price: new_selling_price,
        })
      )
    } else {
      const newAmout = parseInt(selectedArticle.amount) - 1
      let discount

      if (selectedArticle.discount.includes('%')) {
        discount =
          ((parseFloat(selectedArticle.sale_value) * newAmout) / 100) *
          parseInt(selectedArticle.discount)
      }
      if (!selectedArticle.discount.includes('%')) {
        discount = parseFloat(selectedArticle.discount) * newAmout
      }

      if (discount === undefined) return issue()
      const new_selling_price = (
        parseFloat(selectedArticle.sale_value) * newAmout -
        discount
      ).toString()

      if (newAmout <= 0) {
        deleteInvoiceArticle(selectedArticle.invoice_article_id)
        dispatch(setSelectedArticle({}))
        dispatch(setCurrentTotal(''))
        dispatch(setRebateValue(''))
      } else {
        cancelInvoiceArticle({
          invoice_article_id: selectedArticle.invoice_article_id,
          storage_id: 1,
          article_id: selectedArticle.article_id,
          saldo: 1,
          storage_movement_id: selectedArticle.storage_movement_id,
          selling_price: new_selling_price,
        })
        // updateInvoiceArticle({
        //   ...selectedArticle,
        //   amount: newAmout.toString(),
        //   selling_price: new_selling_price,
        //   type_of_movement: 'issue',
        // })
        dispatch(
          setSelectedArticle({
            ...selectedArticle,
            amount: newAmout.toString(),
            selling_price: new_selling_price,
          })
        )
        dispatch(
          setPaymentMethodTotal(
            paymentMethodTotal -
              parseFloat(selectedArticle.sale_value) -
              (parseFloat(selectedArticle.sale_value) / 100) *
                parseFloat(selectedArticle.discount)
          )
        )
      }
    }
  }

  //Toasts
  const storning = () =>
    toast('Nemoguće brisanje artikala na fiskalizovanu fakturu', {
      type: 'error',
      position: 'top-left',
      hideProgressBar: true,
      pauseOnHover: true,
    })
  const issue = () =>
    toast('Došlo je do greške', {
      type: 'error',
      position: 'top-left',
      hideProgressBar: true,
      pauseOnHover: true,
    })

  return handleReduceAmount
}

export default useReduceAmount
