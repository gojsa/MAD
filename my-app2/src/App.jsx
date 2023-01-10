import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from './app/hooks'
import FunctionsContainer from './components/FunctionContainer'
import Header from './components/Header'
import InsertArticle from './components/InsertArticle'
import RetailSidebar from './components/RetailSidebar'
import Spinner from './components/Spinner'
import TableArticles from './components/table/TableArticles'
import Login from './components/Login'
import Main from './components/Main'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import './App.css'
import { useSelector } from 'react-redux'

function App() {
 

  const { user } = useSelector((state) => state.auth)

  return (
    // <div>
    //   <Header />
    //   <div className='h-full w-full row-start-2 row-end-3 grid grid-rows-[120px,auto,140px] grid-cols-[auto_minmax(20%,170px)]'>
    //     <InsertArticle />
    //     <TableArticles />
    //     <FunctionsContainer />
    //     <RetailSidebar />
    //   </div>
    //   {isLoading && (
    //     <div className='z-10 absolute top-0 left-0 right-0 bottom-0 bg-black/50 flex justify-center items-center'>
    //       <Spinner />
    //     </div>
    //   )}
    // </div>
    <>
    <Routes>
    <Route path='/' element={user ? <Main /> : <Navigate to='/login' />}>

    </Route>
    <Route path='/login' element={!user ? <Login /> : <Navigate to='/' />} />
    </Routes>
    <ToastContainer />
    </>
  )
}

export default App
