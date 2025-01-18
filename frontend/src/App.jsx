import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [message, setMessage] = useState('')
  useEffect(() => {
    axios.get("/api/")
      .then(response => setMessage(response.data.message))
      .catch(error => console.error("Error fetching data", error))
  }, [setMessage])
  return (
    <div className="w-full h-full absolute bg-gradient-to-r from-blue-400 to-emerald-400">
      <header className="flex justify-between items-center text-black py-6 px-8 md:px-32 bg-white drop-shadow-md">
        <a href="#" className="font-bold">
          SILLYARG
        </a>

        <ul className="hidden xl:flex items-center gap-12 font-semibold text-base">
          <li className="p-3 hover:bg-sky-400 hover:text-white rounded-md transition-all cursor-pointer">Home</li>
          <li className="p-3 hover:bg-sky-400 hover:text-white rounded-md transition-all cursor-pointer">Products</li>
        </ul>

        <div className="relative hidden md:flex items-center justify-center gap-3">
          <i className="absolute w-4 h-4 left-3 text-gray-500"><MagnifyingGlassIcon /></i>
          <input type="text" placeholder="Search..." className="py-2 pl-10 rounded-xl border-2 border-blue-300 focus:bg-slate-100 focus:outline-sky-500"/>
        </div>
      </header>
      <div>
      <h1 className="text-3xl font-bold">{message}</h1>
      </div>
    </div>
  )
}

export default App
