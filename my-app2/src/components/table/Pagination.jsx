const Pagination = ({
  pageSize,
  setPageSize,
  pageIndex,
  pageOptions,
  gotoPage,
  canPreviousPage,
  previousPage,
  nextPage,
  canNextPage,
  pageCount,
}) => {
  return (
    <div className='flex items-end justify-between'>
      <div className='p-3 space-x-3'>
        <label>Prikaži</label>
        <select
          className='border border-gray-600 '
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[25, 50, 100, 250, 500, 1000].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
        <span>po stranici.</span>
      </div>
      <div className='p-3'>
        <div>
          Stranica{' '}
          <em>
            {pageIndex + 1} od {pageOptions.length}
          </em>
        </div>
        <button
          className='btn btn-sm'
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {'<<'}
        </button>
        <button
          className='btn btn-sm'
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          {'<'}
        </button>
        <button
          className='btn btn-sm'
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          {'>'}
        </button>
        <button
          className='btn btn-sm'
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {'>>'}
        </button>
      </div>
    </div>
  )
}

export default Pagination
