import { useState, MouseEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'

import { useGetAllArticlesQuery } from '../app/services/articlesApi'

import useAddInvoiceArticle from '../hooks/useAddInvoiceArticle'
import useSuggestions from '../hooks/useSuggestions'
import useAddAmount from '../hooks/article/useAddAmount'
import useAddRebate from '../hooks/article/useAddRebate'

import ArticleSuggestionModal from './Modals/ArticleSuggestionModal'
import RebateInputDropdown from './RebateInputDropdown'
import { ArticleModel } from '../models/ArticleModel'
import { setSelectedArticle } from '../features/retailSlice'

import { ToastContainer, toast } from 'react-toastify';

const InsertArticle = () => {
  const { selectedArticle, currentTotal, rebateValue } = useAppSelector(
    (state) => state.retail
  )

  const dispatch = useAppDispatch()

  const { data: allArticles } = useGetAllArticlesQuery()

  const [rebateInputType, setRebateInputType] = useState('percentage')

  const {
    searchObj,
    filteredArr,
    openFiltered,
    handleChange,
    setOpenFiltered,
  } = useSuggestions(allArticles || [])

  const addAmount = useAddAmount()

  const addRebate = useAddRebate()

  const handleAddInvoiceArticle = useAddInvoiceArticle()

  const addArticle = (
    e: MouseEvent<HTMLButtonElement>,
    article: ArticleModel
  ) => {
    e.preventDefault()
    dispatch(setSelectedArticle(article))
  }

  return (
    <form className='insert-article' onSubmit={handleAddInvoiceArticle}>
      <button onSubmit={handleAddInvoiceArticle}></button>
      {/* <ToggleBarcode /> */}

      <input
        type='text'
        name='code'
        onChange={handleChange}
        value={selectedArticle.code || searchObj?.code || ''}
        placeholder='Barkod'
      />
      <input
        type='text'
        name='name'
        onChange={handleChange}
        value={
          selectedArticle.name ||
          selectedArticle.article_name ||
          searchObj?.name ||
          ''
        }
        placeholder='Naziv'
      />
      <input
        type='text'
        name='article_id'
        onChange={handleChange}
        value={selectedArticle.article_id || searchObj?.article_id || ''}
        placeholder='Šifra'
      />
      <input
        type='number'
        name='sale_price'
        onChange={handleChange}
        value={
          selectedArticle.sale_price ||
          selectedArticle.sale_value ||
          searchObj?.sale_price ||
          ''
        }
        placeholder='Cijena'
      />
      <input
        type='text'
        name='unit_of_measure'
        onChange={handleChange}
        value={
          selectedArticle.unit_of_measure || searchObj?.unit_of_measure || ''
        }
        placeholder='Mjerna jedinica'
      />
      <input
        type='number'
        name='amount'
        onChange={addAmount}
        value={selectedArticle.amount || ''}
        placeholder='Količina'
      />
      {rebateInputType === 'percentage' ? (
        <input
          type='text'
          name='percentage'
          value={rebateValue || selectedArticle.discount || ''}
          onChange={addRebate}
          placeholder='Rabat %'
        />
      ) : (
        <input
          type='number'
          name='value'
          value={rebateValue || ''}
          onChange={addRebate}
          placeholder='Rabat KM'
        />
      )}
      <input
        type='number'
        name='total'
        readOnly
        value={currentTotal || selectedArticle?.total || ''}
        placeholder='Total'
      />
      <RebateInputDropdown setRebateInputType={setRebateInputType} />
      {openFiltered && filteredArr.length !== 0 && (
        <ArticleSuggestionModal
          filteredArticlesArr={filteredArr}
          setOpenFiltered={setOpenFiltered}
          addArticle={addArticle}
        />
      )}
    </form>
  )
}

export default InsertArticle
