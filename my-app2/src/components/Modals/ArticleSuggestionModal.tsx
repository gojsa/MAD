import Article from '../Article'

import { MouseEvent, SetStateAction } from 'react'
import { ArticleModel } from '../../models/ArticleModel'

type Props = {
  filteredArticlesArr: ArticleModel[]
  setOpenFiltered: React.Dispatch<SetStateAction<boolean>>
  addArticle: (e: MouseEvent<HTMLButtonElement>, article: ArticleModel) => void
}

const ArticleSuggestionModal = ({
  filteredArticlesArr,
  setOpenFiltered,
  addArticle,
}: Props) => {
  return (
    <>
      <div
        className='fixed left-[20%] top-[100px] bg-black/30'
        aria-hidden='true'
      />
      <div className='filtered-articles-modal'>
        <div className='flex justify-start items-center w-full'>
          <h1 className='text-white text-lg'>Odaberi artikal:</h1>
        </div>
        <div className='flex flex-col justify-start items-center max-h-[300px] overflow-y-auto py-5'>
          {filteredArticlesArr.map((article, index) => (
            <Article
              key={index}
              article={article}
              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                addArticle(e, article)
                setOpenFiltered(false)
              }}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default ArticleSuggestionModal
