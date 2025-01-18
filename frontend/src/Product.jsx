import React, { useState } from 'react'
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

  const noteInfo = {
    top: "Top notes are the first impression of a fragrance. They are light and evaporate quickly, typically lasting 5-15 minutes.",
    middle: "Middle notes (heart notes) emerge as top notes fade. They are the heart of the fragrance, lasting 20-60 minutes.",
    base: "Base notes are the foundation. They emerge last and last the longest, creating the lasting impression of the scent."
  }
  
  // Sample data
  const sampleProducts = [
    {
      name: "Narciso Eau De Parfum Poudree",
      fragrance: "Earthy & Woody, Floral, Fresh"
    },
    {
      name: "Light Blue Intense",
      fragrance: "Citrus, Marine, Floral"
    },
    {
      name: "Black Orchid",
      fragrance: "Oriental, Spicy, Woody"
    },
    {
      name: "La Vie Est Belle",
      fragrance: "Sweet, Floral, Gourmand"
    },
    {
      name: "Santal 33",
      fragrance: "Woody, Spicy, Leather"
    }
  ]

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
      const response = await axios.post('/prompt', {
        name: selectedPerfume.name,
        scents: selectedPerfume.fragrance,
        notes: selectedNote
      })
      setResults(response.data.message)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    }
    setIsLoading(false)
  }

  const filteredProducts = sampleProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.fragrance.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-full h-full absolute bg-gradient-to-r from-purple-400 to-purple-700">
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
          {filteredProducts.map((product, index) => (
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
                        {Object.values(results).map((perfume, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold">{perfume.name}</h4>
                            <p className="text-sm text-gray-600">{perfume.description}</p>
                            <div className="mt-2 text-sm">
                              <p><span className="font-medium">Top:</span> {perfume.top_notes}</p>
                              <p><span className="font-medium">Middle:</span> {perfume.middle_notes}</p>
                              <p><span className="font-medium">Base:</span> {perfume.base_notes}</p>
                            </div>
                          </div>
                        ))}
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