import ActionBtns from './sidebar/ActionBtns'
import ReturnChangeSection from './sidebar/ReturnChangeSection'
import TotalPriceDisplay from './sidebar/TotalPriceDisplay'
import TypeOfPayment from './sidebar/TypeOfPayment'

const RetailSidebar = () => {
  return (
    <div className='retail-sidebar'>
      <TotalPriceDisplay />
      <ActionBtns />
      <ReturnChangeSection />
      <TypeOfPayment />
    </div>
  )
}

export default RetailSidebar
