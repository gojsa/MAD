import { Fragment, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Listbox, Transition } from '@headlessui/react'
// import { languages } from '../data/languages'
import { HiSelector } from 'react-icons/hi'
import { AiOutlineCheck, AiOutlineEye, AiOutlineEyeInvisible, AiOutlineUser } from 'react-icons/ai'
import { RiLockPasswordLine } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { getCompany, getCompanyId } from '../features/companySlice'
import { setCredentials } from '../features/authSlice'
// import { useCookies } from 'react-cookie'
import { useLoginMutation } from '../app/services/auth/authApi'
// import { io } from 'socket.io-client'

// type LocationProps = {
//   state: {
//     from: Location
//   }
// }

// type CookiesType = {
//   userConra: {
//     emailConra: string
//     passwordConra: string
//   }
// }
// let socket
const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  // const [selected, setSelected] = useState(languages[0])
  // const [cookies, setCookie] = useCookies(['userConra'])
  const [showPassword, setShowPassword] = useState(false)

  //Initialize
  const navigate = useNavigate()
  let location = useLocation() /*as unknown as LocationProps */
  const dispatch = useDispatch()

  //RTK query
  const [login, { isLoading, isError, error }] = useLoginMutation()
  const { user } = useSelector((state) => state.auth)

  let from = location.state?.from?.pathname || '/'

  // useEffect(() => {
  //   if (cookies?.emailConra?.length > 0) {
  //     setEmail(cookies.emailConra)
  //     setPassword(cookies.passwordConra)
  //   }
  // }, [cookies.emailConra, cookies.passwordConra, cookies.userConra])


  //LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const userData = { email, password }

      const user = await login(userData).unwrap()
      dispatch(setCredentials(user))
      localStorage.setItem('user', JSON.stringify(user))
      console.log(user);
      //   socket.emit('login', user.users_id)
      // if (remember) {
      //   setCookie('emailConra', email, { path: '/' })
      //   setCookie('passwordConra', password, { path: '/' })
      // }
      if (user && user.companies.length > 1) {
        navigate('/company-select')
      } else {
        localStorage.setItem('company', user?.companies[0].name)
        localStorage.setItem('companyId', user?.companies[0].companies_id)
        dispatch(getCompany(user?.companies[0].name))
        dispatch(getCompanyId(user?.companies[0].companies_id))
        navigate(from, { replace: true })
      }
    } catch (er) {
      toast.error(er.data.message)
      console.log(er.data.message)
    }
  }
  return (
    <div className='absolute top-0 bottom-0 left-0 right-0 font-sans bg-gradient-to-br login'>
      <div className='container flex items-center justify-center flex-1 h-full mx-auto'>
        <div className='w-full max-w-lg'>
          <div className='leading-loose'>
            <form
              onSubmit={handleSubmit}
              className='max-w-sm p-10 m-4 bg-white bg-opacity-40 rounded shadow-xl backdrop-blur-sm drop-shadow-lg'
            >
              <p className='text-lg font-bold text-center text-gray-800'>PRIJAVA</p>

              <div className='relative mt-2 mb-5'>
                <label className='block text-base font-semibold text-gray-800' htmlFor='email'>
                  Email ili korisničko ime
                </label>
                <div className='flex items-center rounded bg-slate-300'>
                  <AiOutlineUser size={35} className='px-2 py-1' />
                  <input
                    className='w-full pl-3 outline-none'
                    type='text'
                    id='ime'
                    placeholder='Upišite email ili username'
                    aria-label='ime'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onInvalid={(e) => e.target.setCustomValidity('Upišite email.')}
                    onInput={(e) => e.target.setCustomValidity('')}
                  />
                </div>
              </div>
              <div className='mb-5 '>
                <label className='block text-base font-semibold text-gray-800'>Šifra</label>
                <div className='flex items-center justify-between rounded bg-slate-300'>
                  <div className='flex items-center w-full'>
                    <RiLockPasswordLine size={35} className='px-2 py-1' />
                    <input
                      className='w-full pl-3 outline-none'
                      type={showPassword ? 'text' : 'password'}
                      id='password'
                      placeholder='Upišite šifru'
                      aria-label='password'
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onInvalid={(e) => e.target.setCustomValidity('Upišite šifru.')}
                      onInput={(e) => e.target.setCustomValidity('')}
                    />
                  </div>
                  {showPassword ? (
                    <AiOutlineEye
                      className='px-2 py-1 cursor-pointer'
                      size={35}
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <AiOutlineEyeInvisible
                      className='px-2 py-1 cursor-pointer'
                      size={35}
                      onClick={() => setShowPassword(true)}
                    />
                  )}
                </div>
              </div>

              <div className='flex items-center justify-between'>
                {/* Remember me opcija */}
                <div className='flex items-center justify-start'>
                  <label className='space-x-3 cursor-pointer label'>
                    <input
                      type='checkbox'
                      checked={remember}
                      className='checkbox checkbox-sm'
                      onChange={(e) => setRemember(!remember)}
                    />
                    <span className='label-text'>Zapamti me</span>
                  </label>
                </div>

                {/* Zaboravljena šifra */}
                <Link to='/forgot-password' className='text-sm'>
                  Zaboravljena šifra?
                </Link>
              </div>

              <div className='flex items-center justify-between mt-4'>
                <button
                  className='w-full px-4 py-1 font-light tracking-wider text-white bg-gray-900 rounded btn disabled:loading disabled:bg-gray-200 hover:bg-gray-800'
                  type='submit'
                  disabled={isLoading}
                >
                  Prijava
                </button>
              </div>
              {isError && (
                <div className='flex items-center justify-center'>
                  <span className='text-xs text-center text-red-700'>{error?.error}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      {/* <div className='absolute w-40 right-10 top-3'>
        <div>
          <Listbox value={selected} onChange={setSelected}>
            <div className='relative mt-1'>
              <Listbox.Button className='relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm'>
                <div className='flex items-center justify-center space-x-3'>
                  <span>{<selected.flag className='w-6 h-6' />}</span>
                  <span className='block truncate'>{selected.name}</span>
                </div>
                <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                  <HiSelector className='w-5 h-5 text-gray-400' aria-hidden='true' />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave='transition ease-in duration-100'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <Listbox.Options className='absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                  {languages.map((language, languageIdx) => (
                    <Listbox.Option
                      key={languageIdx}
                      className={({ active }) =>
                        `cursor-default select-none relative py-2 pl-10 pr-4 ${
                          active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'
                        }`
                      }
                      value={language}
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {language.name}
                          </span>
                          {selected ? (
                            <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600'>
                              <AiOutlineCheck className='w-5 h-5' aria-hidden='true' />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div> */}
    </div>
  )
}

export default Login
