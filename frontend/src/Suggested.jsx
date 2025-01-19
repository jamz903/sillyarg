import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './components/navbar';

function Suggested(name, scents, notes) {
    const [isLoading, setIsLoading] = useState(false)
    const [results, setResults] = useState(null)
    
    const handleFind = async () => {
        if (!selectedNote) return

        setIsLoading(true)
        try {
            const response = await axios.post('/prompt', {
                name: name,
                scents: scents,
                notes: notes
            })
            setResults(response.data.message)
        } catch (error) {
            console.error('Error fetching recommendations:', error)
        }
        setIsLoading(false)
    }

    return (
        <div className="w-full h- absolute bg-gradient-to-r from-purple-400 to-purple-700">
            <Navbar />
        </div>
    );
}

export default Suggested;