import { MouseEventHandler } from 'react'
import { ArticleModel } from '../models/ArticleModel'

type Props = {
  article: ArticleModel
  onClick: MouseEventHandler<HTMLButtonElement>
}

const Article = ({ article, onClick }: Props) => {
  return (
    <button className='article' onClick={onClick}>
      <p className='mr-2'>{article.name}</p>
      <p className='mr-2'>{article.code}</p>
      <p className='mr-2'>{article.article}</p>
    </button>
  )
}

export default Article
