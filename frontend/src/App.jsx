import { useEffect, useState } from 'react'
import axios from "axios"
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    axios.get("/api/")
      .then(response => setMessage(response.data.message))
      .catch(error => console.error("Error fetching data", error))
  }, [setMessage])

  return (
    <div>
      <h1 className="text-3xl font-bold underline">{message}</h1>
    </div>
  )
}

export default App
