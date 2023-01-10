import { useEffect, useState } from 'react'
import { setSelectecedInvoiceArticles } from '../../features/retailSlice'

import { useGetInvoiceArticlesQuery } from '../../app/services/invoiceArticleApi'
import { useGetLastInvoiceQuery } from '../../app/services/retailAPI'
import { DBInvoiceArticleModel } from '../../models/InvoiceArticleModel'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

const useArticles = () => {
  const [articles, setArticles] = useState([] as DBInvoiceArticleModel[])

  const { selectedInvoiceArticles } = useAppSelector((state) => state.retail)

  const dispatch = useAppDispatch()

  const { selectedInvoice } = useAppSelector((state) => state.retail)
  const { data: lastInvoice } = useGetLastInvoiceQuery()

  const invoiceId = selectedInvoice.invoice_id
    ? selectedInvoice.invoice_id
    : lastInvoice?.invoice_id

  const { data: InvoiceArticles } = useGetInvoiceArticlesQuery(invoiceId, {
    refetchOnMountOrArgChange: invoiceId,
    skip: invoiceId ? false : true,
  })

  useEffect(() => {
    if (selectedInvoice.fiscal_status) {
      dispatch(setSelectecedInvoiceArticles(InvoiceArticles))
      setArticles(InvoiceArticles || [])
    } else {
      setArticles(InvoiceArticles || [])
    }
  }, [InvoiceArticles])

  return selectedInvoice.fiscal_status ? selectedInvoiceArticles : articles
}

export default useArticles
