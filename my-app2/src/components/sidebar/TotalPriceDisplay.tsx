import useTotal from '../../hooks/useTotal'
import useVAT from '../../hooks/useVAT'

const TotalPriceDisplay = () => {
  const total = useTotal()
  const PDV = useVAT(total)

  return (
    <div className='h-[150px] text-xl bg-gradient-to-b from-gray-600 to-gray-400 flex flex-col justify-center items-center'>
      <h1 className='text-[50px] font-semibold mt-2 mb-5'>{total}KM</h1>
      <h1 className='text-lg font-semibold text-white flex'>
        <label>PDV:</label>
        <p className='text-black ml-2'>{PDV}KM</p>
      </h1>
    </div>
  )
}

export default TotalPriceDisplay
