import { setAutoAdd } from '../features/retailSlice'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { useGetLastInvoiceQuery } from '../app/services/retailAPI'

const Header = () => {
  const { selectedInvoice, autoAdd } = useAppSelector((state) => state.retail)
  const { data: lastInvoice } = useGetLastInvoiceQuery()

  const dispatch = useAppDispatch()

  var today = new Date()
  var dd = String(today.getDate()).padStart(2, '0')
  var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
  var yyyy = today.getFullYear()

  const { user } = useAppSelector((state) => state.auth)

  return (
    <div className='bg-[#4CABE0] text-black h-full w-full row-start-1 row-end-2 flex justify-evenly items-center'>
      <label className='text-xl font-semibold'>
        Broj računa:{' '}
        {selectedInvoice.invoice_number
          ? selectedInvoice.invoice_number
          : lastInvoice?.invoice_number
          ? lastInvoice.invoice_number
          : ''}
      </label>
      <label className='text-xl font-semibold'>
        Broj fiskalnog:{' '}
        {selectedInvoice.fiscal_number !== undefined
          ? selectedInvoice.fiscal_number
          : lastInvoice
          ? lastInvoice.fiscal_number
          : ''}
      </label>
      {/* <label className='text-2xl font-bold'>Naziv prodavnice</label> */}
      <label className='text-xl font-semibold'>
        Uposlenik:{' ' + user?.user_name}{' '}
      </label>
      <label className='text-xl font-semibold'>
        Datum: {' ' + dd + '/' + mm + '/' + yyyy}
      </label>

      <div className='checkbox-wrapper-21'>
        <label className='control control--checkbox'>
          Barcode
          <input
            type='checkbox'
            checked={autoAdd}
            onChange={() => dispatch(setAutoAdd(!autoAdd))}
          />
          <div className='control__indicator'></div>
        </label>
      </div>
    </div>
  )
}

export default Header
