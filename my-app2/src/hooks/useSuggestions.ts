import { useEffect, useState, ChangeEvent } from 'react'
import { setPaymentMethodTotal } from '../features/retailSlice'
import { useAppDispatch, useAppSelector } from '../app/hooks'

import {
  useGetInvoiceArticlesQuery,
  usePostInvoiceArticleMutation,
  useUpdateInvoiceArticleMutation,
} from '../app/services/invoiceArticleApi'
import { useGetLastInvoiceQuery } from '../app/services/retailAPI'
import { useGetStorageConfiguratorQuery } from '../app/services/storageConfigApi'
import { DBArticleModel } from '../models/ArticleModel'
import { useSelector } from 'react-redux'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useGetByOrgQuery } from '../app/services/storageApi'
import { toast } from 'react-toastify'
import { isError } from 'util'

const useSuggestions = <TObj extends DBArticleModel>(arr: TObj[]) => {
  const [searchObj, setSearchObj] = useState<TObj | Partial<TObj> | undefined>()
  const [filteredArr, setFilteredArr] = useState<TObj[]>([])
  const [openFiltered, setOpenFiltered] = useState(false)

  const { paymentMethodTotal, autoAdd, selectedInvoice } = useAppSelector(
    (state) => state.retail
  )
  const dispatch = useAppDispatch()

  const { organizational_units_id } = useSelector((state: any) => state.auth.user.placeOfExpense[0].organizational_unit)

  const { data } = useGetByOrgQuery(organizational_units_id ?? skipToken)

  const keys = searchObj ? Object.entries(searchObj) : []

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchKey = e.target.name
    const searchValue = e.target.value

    setSearchObj((prev) => ({ ...prev, [searchKey]: searchValue }))
  }

  const { data: lastInvoice } = useGetLastInvoiceQuery()
  const { data: invoiceArticles } = useGetInvoiceArticlesQuery(
    lastInvoice?.invoice_id,
    { skip: lastInvoice?.invoice_id ? false : true }
  )
  const { data: storageConfig } = useGetStorageConfiguratorQuery(
    'storage_movement_types'
  )

  const [postInvoiceArticle, { isError: postError,error:postErrorMessage, }] = usePostInvoiceArticleMutation()
  const [updateInvoiceArticle, { isError: putError,error:putErrorMessage }] = useUpdateInvoiceArticleMutation()

  useEffect(() => {
    if(putError) console.log(postErrorMessage)
    if(postError) console.log(putErrorMessage)
  },[postError,putError])

  const movementType = storageConfig?.find(
    (el) => el.storage_movement_types === 'Prodaja'
  )

  useEffect(() => {
    const filtered = arr.filter((obj) => {
      let myObj

      keys.forEach((key) => {
        const keyOfObj = obj[key[0] as keyof TObj]

        if (!key[1]) return

        switch (typeof keyOfObj) {
          case 'string':
            let val = key[1] as string | number
            val = val.toString()
            //Auto add article if entire key is typed in
            //This enables RF-ID to auto add articles
            const stornedLastInvoice = lastInvoice?.fiscal_number
              ?.toString()
              .includes('S')

            if (Object.keys(selectedInvoice).length !== 0)
              return console.log('Nije moguće dodavanje artikala')

            if (
              keyOfObj === val &&
              autoAdd &&
              lastInvoice?.fiscal_status !== 'Y' &&
              !stornedLastInvoice
            ) {
              const newArticle = arr.find(
                (el) => el[key[0] as keyof TObj] === val
              )
              if (newArticle) {
                const articleInCart = invoiceArticles?.find(
                  (art) => art.article_id === newArticle.article_id
                )
                if (articleInCart) {
                  //PUT invoiceArticle
                  const newAmout = parseInt(articleInCart.amount) + 1
                  const discount =
                    ((parseFloat(articleInCart.sale_value) * newAmout) / 100) *
                    parseInt(articleInCart.discount)

                  updateInvoiceArticle({
                    ...articleInCart,
                    amount: newAmout.toString(),
                    selling_price: (
                      parseFloat(articleInCart.sale_value) * newAmout -
                      discount
                    ).toString(),
                    type_of_movement: 'issue',
                  }).unwrap()
                  .then((payload: any) => {
                    putError ? toast.error(putError as any) : toast.success(payload.message)
                  
                  })
                  .catch((err: any) => toast.error(err.data.message))

                  dispatch(
                    setPaymentMethodTotal(
                      paymentMethodTotal + parseFloat(newArticle.sale_price)
                    )
                  )
                } else {
                  //POST invoiceArticle
                  if (!lastInvoice?.invoice_id) return
                  postInvoiceArticle({
                    article: {
                      storage_id: data ? data?.storage_id : '',
                      article_name: newArticle.name,
                      article_id: newArticle.article_id,
                      description: newArticle.description || 'issue',
                      value_with_vat: newArticle.sale_price,
                      type_of_good: newArticle.type_of_goods || 'issue',
                      source: 'source',
                      source_number: 'source number',
                      storage_location: 'storage locaton',
                      amount: "1",
                      unit_of_measure: newArticle.unit_of_measure || 'kom',
                      selling_price: newArticle.sale_price.toString(),
                      discount: '0',
                      sale_value: newArticle.sale_price,
                      vat: '17',
                      sale_value_with_vat: newArticle.sale_price.toString(),
                      type_of_movement: 'RESERVED',
                    },
                    invoiceId: lastInvoice.invoice_id,
                  }).unwrap()
                  .then((payload: any) => {
                    postError ? toast.error(postError as any) : toast.success(payload.message)
                  
                  })
                  .catch((err: any) => toast.error(err.data.message))

                  dispatch(
                    setPaymentMethodTotal(
                      paymentMethodTotal + parseFloat(newArticle.sale_price)
                    )
                  )
                }
                setSearchObj(undefined)
              }
            }
            if (
              keyOfObj
                .toLocaleLowerCase()
                .startsWith(val.toLocaleLowerCase()) ||
              keyOfObj.toLocaleLowerCase().includes(val.toLocaleLowerCase())
            ) {
              myObj = obj
            }
            break
          case 'number':
            let keyValue = key[1] as string | number
            keyValue = keyValue.toString()
            if (
              keyOfObj
                .toString()
                .toLocaleLowerCase()
                .startsWith(keyValue.toLocaleLowerCase()) ||
              keyOfObj
                .toString()
                .toLocaleLowerCase()
                .includes(keyValue.toLocaleLowerCase()) ||
              keyOfObj.toString().toLocaleLowerCase() ===
              keyValue.toLocaleLowerCase()
            ) {
              myObj = obj
            }
            break
        }
      })
      return myObj
    })

    setFilteredArr(filtered)
    setOpenFiltered(true)
  }, [searchObj])

  const issue = (i: string) => toast(i, { type: 'error', position: 'top-right', hideProgressBar: true, pauseOnHover: true })

  //If article has been selected suggestion modal will close
  //When article is selected searchObj can return to default state
  useEffect(() => {
    if (!openFiltered) setSearchObj(undefined)
  }, [openFiltered])

  return {
    searchObj,
    filteredArr,
    openFiltered,
    handleChange,
    setSearchObj,
    setOpenFiltered,
  }
}

export default useSuggestions
