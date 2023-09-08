import React, { useState, ChangeEvent, KeyboardEvent } from 'react'
import { stemmer } from 'stemmer'
import Definition from './Definition'
import { ImSearch } from 'react-icons/im'

interface Suggestion {
    word: string
    score: number
}

const Dictionary: React.FC = () => {
    const [query, setQuery] = useState<string>('')
    const [suggestions, setSuggestions] = useState<Suggestion[]>([])
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
    const [wordData, setWordData] = useState<any | null>(null)

    const fetchSuggestions = async (input: string) => {
        if (input) {
            const response = await fetch(
                `https://api.datamuse.com/sug?s=${input}`
            )
            const data: Suggestion[] = await response.json()
            setSuggestions(data.slice(0, 3)) // Limit to 3 suggestions
        } else {
            setSuggestions([])
        }
    }
    const fetchDefinition = async (
        word: string,
        isStemmed: boolean = false
    ): Promise<void> => {
        setQuery(word)
        setSuggestions([])

        // Updated API endpoint
        const response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        )
        const data = await response.json()

        // Check if the word exists in the response
        if (data && data.length > 0) {
            setWordData(data[0])

            const firstMeaning = data[0].meanings[0]
            if (
                firstMeaning &&
                firstMeaning.definitions &&
                firstMeaning.definitions.length > 0
            ) {
                const definition = firstMeaning.definitions[0].definition
            }
        } else if (!isStemmed) {
            // If word not found, try stemming and fetching again
            const stemmedWord = stemmer(word)
            return fetchDefinition(stemmedWord, true) // Recursive call with the stemmed word and isStemmed set to true
        } else {
            console.log(`${word}: No definition found.`)
        }
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value
        setQuery(inputValue)
        fetchSuggestions(inputValue)
        setSelectedIndex(null) // Reset the selected index
    }
    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (selectedIndex !== null && suggestions[selectedIndex]) {
                fetchDefinition(suggestions[selectedIndex].word)
            } else if (query) {
                fetchDefinition(query)
                setQuery('') // Clear the input
            }
            setSelectedIndex(null) // Reset the selected index
        } else if (e.key === 'ArrowDown') {
            e.preventDefault() // Prevent the default action (scrolling)
            setSelectedIndex((prev) =>
                prev === null || prev >= suggestions.length - 1 ? 0 : prev + 1
            )
        } else if (e.key === 'ArrowUp') {
            e.preventDefault() // Prevent the default action (scrolling)
            setSelectedIndex((prev) =>
                prev === null || prev <= 0 ? suggestions.length - 1 : prev - 1
            )
        }
    }

    return (
        <div>
            <input
                type="text"
                className="transition-all ease-in-out focus:outline-none transform w-32 focus:w-64 border-transparent border-2 focus:border-gray-300  rounded-full px-2 outline-none mb-4"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder={`dictionary`}
            />

            {query && (
                <ul className="bg-white border border-gray-300 rounded shadow-lg">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className={`p-2 cursor-pointer ${
                                index === selectedIndex ? 'bg-gray-200' : ''
                            } hover:bg-gray-100`} // Conditionally apply bg-gray-200
                            onClick={() => fetchDefinition(suggestion.word)}
                        >
                            {suggestion.word}
                        </li>
                    ))}
                </ul>
            )}
            {wordData && <Definition wordData={wordData} />}
        </div>
    )
}

export default Dictionary
