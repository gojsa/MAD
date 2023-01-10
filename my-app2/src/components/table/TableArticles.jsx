import { useMemo } from 'react'
import { cols } from './columns'
import { useTable } from 'react-table'

import { setSelectedArticle } from '../../features/retailSlice'
import useArticles from '../../hooks/article/useArticles'
import { useDispatch, useSelector } from 'react-redux'

const TableArticles = () => {
  const articles = useArticles()

  const { selectedArticle } = useSelector((state) => state.retail)

  const dispatch = useDispatch()

  const data = useMemo(() => articles || [], [articles])

  const columns = useMemo(() => cols, [])

  const tableHooks = (hooks) => {
    hooks.visibleColumns.push((columns) => [...columns])
  }

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    tableHooks
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance

  return (
    <div className='table-wraper'>
      <table {...getTableProps()} className='retail-table-articles'>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index, arr) => (
                <th
                  {...column.getHeaderProps()}
                  className={
                    index === arr.length - 1
                      ? 'px-2 py-5 text-center text-xl font-bold text-white h-[60px]'
                      : 'px-2 py-5 text-center text-xl font-bold text-white border-r-[1px] border-white h-[60px]'
                  }
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row)
            return (
              <tr
                {...row.getRowProps({
                  onClick: () => {
                    /* select the row here */
                    if (
                      row.original.article_name ===
                        selectedArticle.article_name &&
                      row.original.selling_price ===
                        selectedArticle.selling_price
                    ) {
                      dispatch(setSelectedArticle({}))
                    } else dispatch(setSelectedArticle(row.original))
                  },
                })}
                className={
                  index % 2
                    ? row.original.article_name ===
                        selectedArticle.article_name &&
                      row.original.selling_price ===
                        selectedArticle.selling_price
                      ? 'bg-[#349DD8] border-[1px] border-gray-700'
                      : 'bg-[#D8F3DC]'
                    : row.original.article_name ===
                        selectedArticle.article_name &&
                      row.original.selling_price ===
                        selectedArticle.selling_price
                    ? 'bg-[#349DD8] border-[1px] border-gray-700'
                    : 'bg-white'
                }
              >
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default TableArticles
