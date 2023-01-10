import { MouseEvent, useEffect } from 'react'
import { toast } from 'react-toastify'

import {
  setCurrentTotal,
  setPaymentMethodTotal,
  setRebateValue,
  setSelectedArticle,
} from '../features/retailSlice'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import { usePostInvoiceArticleMutation } from '../app/services/invoiceArticleApi'
import {
  useGetLastInvoiceQuery,
  useUpdateRetailInvoiceMutation,
} from '../app/services/retailAPI'
import { get } from '../features/storageSlice'

import { useGetStorageConfiguratorQuery } from '../app/services/storageConfigApi'
import { useSelector } from 'react-redux'
import { useGetByOrgQuery } from '../app/services/storageApi'
import { skipToken } from '@reduxjs/toolkit/dist/query'

const useAddInvoiceArticle = () => {
  const {  organizational_units_id} = useSelector((state:any) => state.auth.user.placeOfExpense[0].organizational_unit)
  //Toasts
  const amountIssue = () =>
    toast('Dodaj količinu!', {
      position: 'top-left',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'light',
    })

  useEffect(() => {
    get()
  }, [])

  const { storages } = useAppSelector((state) => state.storage)
  
  const {data} =useGetByOrgQuery(organizational_units_id ?? skipToken)
  

  const { selectedArticle, paymentMethodTotal, total, selectedInvoice } =
    useAppSelector((state) => state.retail)

  const dispatch = useAppDispatch()

  const { data: lastInvoice } = useGetLastInvoiceQuery()
  const { data: storageConfig } = useGetStorageConfiguratorQuery( 
    'storage_movement_types'
  )


  const [postInvoiceArticle, { error, isError }] = usePostInvoiceArticleMutation()
  const [updateInvoice] = useUpdateRetailInvoiceMutation()

  const movementType = storageConfig?.find(
    (el) => el.storage_movement_types === 'Prodaja'
  )

  

  const handleAddInvoiceArticle = (e: MouseEvent<any>) => {
    e.preventDefault()
    if (!selectedArticle || !selectedArticle.amount || !selectedArticle.total)
      return amountIssue()
    if (!lastInvoice) return error2()
    if (
      selectedInvoice.fiscal_status === 'Y' ||
      selectedInvoice?.fiscal_number?.includes('S')
    )
      return storning()
      

    postInvoiceArticle({
      article: {
        storage_id: data ? data?.storage_id : '',
        article_name: selectedArticle.name,
        article_id: selectedArticle.article_id,
        description: selectedArticle.description,
        value_with_vat: selectedArticle.sale_price,
        type_of_good: selectedArticle.type_of_goods,
        source: 'source',
        source_number: 'source number',
        storage_location: 'storage locaton',
        amount: selectedArticle.amount.toString(),
        unit_of_measure: selectedArticle.unit_of_measure || 'kom',
        selling_price: selectedArticle.total.toString(),
        discount: selectedArticle.discount || '0',
        sale_value: selectedArticle.sale_price,
        vat: '17',
        sale_value_with_vat: selectedArticle.total.toString(),
        // type_of_movement: movementType?.storage_movement_types || 'issue',
        type_of_movement: 'RESERVED',
      },
      invoiceId: lastInvoice.invoice_id,
    }).unwrap()
    .then((payload: any) => {
      isError ? toast.error(error as any) : toast.success(payload.message)
    
    })
    .catch((err: any) => toast.error(err.data.message))
    

    const newInvoice = {
      ...lastInvoice,
      total_invoice: total,
    }

    delete newInvoice.created_at
    delete newInvoice.updated_at
    updateInvoice(newInvoice)
    dispatch(
      setPaymentMethodTotal(
        paymentMethodTotal + parseFloat(selectedArticle.total)
      )
    )
    dispatch(setSelectedArticle({}))
    dispatch(setCurrentTotal(''))
    dispatch(setRebateValue(''))
  }

  //Toasts
  const storning = () =>
    toast('Nemoguće dodavanje artikla na fiskalizovanu fakturu', {
      type: 'error',
      position: 'top-left',
      hideProgressBar: true,
      pauseOnHover: true,
    })
  const error2 = () =>
    toast(
      'Došlo je do greške. Molimo osvježite stranicu i napravite novi račun.',
      {
        type: 'error',
        position: 'top-left',
        hideProgressBar: true,
        pauseOnHover: true,
      }
    )

  return handleAddInvoiceArticle
}

export default useAddInvoiceArticle
