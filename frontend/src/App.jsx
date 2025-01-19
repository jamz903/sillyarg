import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from './components/navbar'
import { useNavigate } from 'react-router-dom'

function App() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  useEffect(() => {
    axios.get("/api/")
      .then(response => setMessage(response.data.message))
      .catch(error => console.error("Error fetching data", error))
  }, [setMessage])

  const navigatetoProduct = () => {
    navigate('/product')
  }
  
  return (
    <div className="w-full h-full absolute bg-gradient-to-r from-purple-400 to-purple-700">
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <div className="max-w-2xl mx-auto bg-white/90 rounded-2xl p-8 backdrop-blur-sm shadow-xl">
          <h1 className="text-5xl font-bold mb-6 text-gray-800">Welcome to SillyArg</h1>
          <p className="text-xl text-gray-600 mb-8">
            A playful take on "sillage" - the trail of scent left in the air by perfume. 
            We're here to help you find your next signature scent!
          </p>
          <button 
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
            onClick={navigatetoProduct}
          >
            Get Started
          </button>
        </div>
      </main>
    </div>
  )
}

export default App