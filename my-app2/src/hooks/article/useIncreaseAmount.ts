import { MouseEvent } from 'react'
import { toast } from 'react-toastify'
import {
  setPaymentMethodTotal,
  setSelectedArticle,
} from '../../features/retailSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { useUpdateInvoiceArticleMutation } from '../../app/services/invoiceArticleApi'

const useIncreaseAmount = () => {
  const { selectedArticle, selectedInvoice, isStorning, paymentMethodTotal } =
    useAppSelector((state) => state.retail)

  const dispatch = useAppDispatch()

  const [updateInvoiceArticle] = useUpdateInvoiceArticleMutation()

  const handleAddAmount = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (
      !selectedArticle.amount ||
      !selectedArticle.sale_value ||
      !selectedArticle.discount ||
      !selectedArticle.value_with_vat ||
      !selectedArticle.sale_value_with_vat
    )
      return
    if (selectedInvoice.fiscal_status === 'Y' || isStorning) return storning()
    else {
      const newAmout = parseInt(selectedArticle.amount) + 1
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

      updateInvoiceArticle({
        ...selectedArticle,
        amount: newAmout.toString(),
        selling_price: new_selling_price,
        type_of_movement: 'issue',
      })
      dispatch(
        setSelectedArticle({
          ...selectedArticle,
          amount: newAmout.toString(),
          selling_price: new_selling_price,
          type_of_movement: 'issue',
        })
      )
      dispatch(
        setPaymentMethodTotal(
          paymentMethodTotal +
            parseFloat(selectedArticle.sale_value) -
            (parseFloat(selectedArticle.sale_value) / 100) *
              parseFloat(selectedArticle.discount)
        )
      )
    }
  }

  //Toasts
  const storning = () =>
    toast('Nemoguće dodavanje artikla', {
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

  return handleAddAmount
}

export default useIncreaseAmount
