import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate()
    const navigatetoProduct = () => {
        navigate('/product')
      }
    const navigateHome = () => {
        navigate('/')
    }
  return (
    <header className="flex justify-between items-center text-black py-6 px-8 md:px-32 bg-white drop-shadow-md">
        <a href="#" className="font-bold">
          SILLYARG
        </a>

        <ul className="hidden xl:flex items-center gap-12 font-semibold text-base">
          <li className="p-3 hover:bg-sky-400 hover:text-white rounded-md transition-all cursor-pointer" onClick={navigateHome}>Home</li>
          <li className="p-3 hover:bg-sky-400 hover:text-white rounded-md transition-all cursor-pointer" onClick={navigatetoProduct}>Products</li>
        </ul>

        <div className="relative hidden md:flex items-center justify-center gap-3">
          <i className="absolute w-4 h-4 left-3 text-gray-500"><MagnifyingGlassIcon /></i>
          <input type="text" placeholder="Search..." className="py-2 pl-10 rounded-xl border-2 border-blue-300 focus:bg-slate-100 focus:outline-sky-500"/>
        </div>
      </header>
  )
}

export default Navbar