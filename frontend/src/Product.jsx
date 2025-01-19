import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlassIcon, XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import Navbar from './components/navbar'

function Products() {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedPerfume, setSelectedPerfume] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedNote, setSelectedNote] = useState('')
    const [results, setResults] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 9

    const noteInfo = {
        top: "Top notes are the first impression of a fragrance. They are light and evaporate quickly, typically lasting 5-15 minutes.",
        middle: "Middle notes (heart notes) emerge as top notes fade. They are the heart of the fragrance, lasting 20-60 minutes.",
        base: "Base notes are the foundation. They emerge last and last the longest, creating the lasting impression of the scent."
    }


    const [products, setProducts] = useState([])
    useEffect(() => {
        axios.get("/api/all")
            .then(response => setProducts(response.data))
            .catch(error => console.error("Error fetching data", error))
    }, [setProducts])

    const navigatetoSuggested = (name, scents, baseNote) => {
        navigate('/suggested', { state: { name, scents, baseNote } })
    }

    const handleCardClick = (product) => {
        setSelectedPerfume(product)
        setSelectedNote('')
        setResults(null)
        setIsModalOpen(true)
    }

    const handleFind = async () => {
        if (!selectedNote) return

        setIsLoading(true)
        try {
            if (selectedPerfume && selectedPerfume.name && selectedPerfume.fragrance) {
                const response = await axios.post('/api/prompt', {
                    name: selectedPerfume.name,
                    scents: selectedPerfume.fragrance,
                    notes: selectedNote
                }, { 
                    headers: {
                    'Content-Type': 'application/json'
                    }
                })
                const rawText = response.data.message.candidates[0].content.parts[0].text;
                const parsedResponse = JSON.parse(rawText);
                console.log(parsedResponse.response);
                setResults(parsedResponse.response);
            } else {
                console.error('Selected perfume is missing required properties')
            }
        } catch (error) {
            console.error('Error fetching recommendations:', error)
        }
        setIsLoading(false)
    }

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.fragrance.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
    const displayedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    return (
        <div className="w-full h- absolute bg-gradient-to-r from-purple-400 to-purple-700">
            <Navbar />

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-12">
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute w-6 h-6 left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search fragrances..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-4 pl-14 pr-4 rounded-xl border-2 border-blue-300 focus:outline-none focus:border-sky-500 text-lg bg-white/90 backdrop-blur-sm"
                        />
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedProducts.map((product, index) => (
                        <div 
                            key={index}
                            onClick={() => handleCardClick(product)}
                            className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                        >
                            <h2 className="text-xl font-bold text-gray-800 mb-4">{product.name}</h2>
                            <div className="flex gap-2 flex-wrap">
                                {product.fragrance.split(', ').map((note, noteIndex) => (
                                    <span
                                        key={noteIndex}
                                        className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-sm"
                                    >
                                        {note}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex flex-col items-center mt-8">
                    <span className="text-sm text-gray-700 dark:text-gray-400">
                        Showing <span className="font-semibold text-gray-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-gray-900 dark:text-white">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{filteredProducts.length}</span> Entries
                    </span>
                    <div className="inline-flex mt-2 xs:mt-0">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                            Prev
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                            Next
                        </button>
                    </div>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div 
                            className="absolute inset-0 bg-black/50"
                            onClick={() => setIsModalOpen(false)}
                        />
                        
                        <div className="relative bg-white rounded-xl max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                            <div className="py-10 px-20">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {selectedPerfume?.name}
                                    </h2>
                                    <button 
                                        onClick={() => setIsModalOpen(false)}
                                        className="text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        <XMarkIcon className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <h3 className="text-lg font-semibold">Select note type to find similar perfumes:</h3>
                                            <div className="group relative">
                                                <InformationCircleIcon className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-help" />
                                                <div className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-sm rounded-lg">
                                                    Different notes emerge at different stages as you wear the perfume
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 flex-wrap">
                                            {['top', 'middle', 'base'].map((note) => (
                                                <div key={note} className="relative group">
                                                    <button
                                                        onClick={() => setSelectedNote(note)}
                                                        className={`px-4 py-2 rounded-full transition-colors ${
                                                            selectedNote === note
                                                                ? 'bg-sky-500 text-white'
                                                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        {note.charAt(0).toUpperCase() + note.slice(1)} Notes
                                                    </button>
                                                    <div className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-sm rounded-lg z-10">
                                                        {noteInfo[note]}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleFind}
                                        disabled={!selectedNote || isLoading}
                                        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                                            !selectedNote || isLoading
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-sky-500 text-white hover:bg-sky-600'
                                        }`}
                                    >
                                        {isLoading ? 'Finding...' : 'Find Similar Perfumes'}
                                    </button>

                                    {results && (
                                        <div className="mt-6 space-y-4">
                                            <h3 className="text-lg font-semibold">Recommendations:</h3>
                                            <div className="space-y-4">
                                                {results.map((result, index) => {
                                                    const perfumeData = JSON.parse(result);
                                                    return (
                                                        <div key={index} className="p-4 bg-gray-50 rounded-lg relative">
                                                            <button 
                                                                onClick={() => navigator.clipboard.writeText(JSON.stringify(perfumeData))}
                                                                className="absolute end-2 top-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 inline-flex items-center justify-center"
                                                            >
                                                                <span id="default-icon-contact-details">
                                                                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                                                        <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"/>
                                                                    </svg>
                                                                </span>
                                                                <span id="success-icon-contact-details" className="hidden inline-flex items-center">
                                                                    <svg className="w-3.5 h-3.5 text-blue-700 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                                                                    </svg>
                                                                </span>
                                                            </button>
                                                            <h4 className="font-semibold">{perfumeData.name}</h4>
                                                            <p className="text-sm text-gray-600">{perfumeData.description}</p>
                                                            <div className="mt-2 text-sm">
                                                                <p><span className="font-medium">Top:</span> {perfumeData["top notes"]}</p>
                                                                <p><span className="font-medium">Middle:</span> {perfumeData["middle notes"]}</p>
                                                                <p><span className="font-medium">Base:</span> {perfumeData["base notes"]}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-800 bg-white/90 backdrop-blur-sm rounded-xl p-6 inline-block">
                            No fragrances found matching your search.
                        </p>
                    </div>
                )}
            </main>
        </div>
    )
}

export default Products