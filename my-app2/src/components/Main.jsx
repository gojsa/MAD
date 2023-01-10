import {useEffect,useState}from 'react'
import Header from './Header'
import InsertArticle from './InsertArticle'
import TableArticles from './table/TableArticles'
import FunctionsContainer from './FunctionContainer'
import RetailSidebar from './RetailSidebar'
import Spinner from './Spinner'
import { useAppSelector } from '../app/hooks'
import { get, remove, update, reset } from '../features/storageSlice'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { useGetByOrgQuery } from '../app/services/storageApi'

const Main=()=>{
  const [data,setData]=useState([])
  const dispatch=useDispatch()

    const { isLoading } = useAppSelector((state) => state.retail)

    const {  organizational_units_id} = useSelector((state) => state.auth.user.placeOfExpense[0].organizational_unit)


    useEffect(() => {
      // const fetchData=async()=>{
      //   const payload=await axios.get(`${process.env.REACT_APP_URL}/api/storage/getbyorg/${organizational_units_id}`)
      //   setData( payload.data)
      // }
      // fetchData()
    }, [])
    const {data:storagess}=useGetByOrgQuery(organizational_units_id)
    console.log(storagess);
    return(
        <div>
      <Header />
      <div className='h-full w-full row-start-2 row-end-3 grid grid-rows-[120px,auto,140px] grid-cols-[auto_minmax(20%,170px)]'>
        <InsertArticle />
        <TableArticles />
        <FunctionsContainer />
        <RetailSidebar />
      </div>
      {isLoading && (
        <div className='z-10 absolute top-0 left-0 right-0 bottom-0 bg-black/50 flex justify-center items-center'>
          <Spinner />
        </div>
      )}
    </div>
    )
}

export default Main