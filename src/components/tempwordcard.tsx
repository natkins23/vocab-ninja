'use client'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { BsChevronRight } from 'react-icons/bs'
import { BsChevronLeft } from 'react-icons/bs'

import { AiTwotoneSound } from 'react-icons/ai'
import { LiaExternalLinkSquareAltSolid } from 'react-icons/lia'
import Link from 'next/link'

type WordCardProps = {
    showDefinition: boolean
    setShowDefinition: React.Dispatch<React.SetStateAction<boolean>>
    studyChoice: string
}

const WordCard: React.FC<WordCardProps> = ({
    showDefinition,
    setShowDefinition,
    studyChoice,
}) => {
    const words = useMemo(
        () => [
            'Aberration',
            'Capitulate',
            'Debilitate',
            'Enervate',
            'Facetious',
            'Garrulous',
            'Harangue',
            'Ineffable',
            'Juxtapose',
            'Kaleidoscope',
            'Lugubrious',
            'Munificent',
            'Nefarious',
            'Obfuscate',
            'Pernicious',
            'Quintessential',
            'Recalcitrant',
            'Sycophant',
            'Trepidation',
            'Ubiquitous',
        ],
        []
    ) // Memoized
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [definition, setDefinition] = useState<string | null>(null)
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

    const fetchDefinition = useCallback(async () => {
        const word = words[currentIndex]
        const response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        )
        const data = await response.json()

        if (data && data.length > 0) {
            const firstMeaning = data[0].meanings[0]
            if (
                firstMeaning &&
                firstMeaning.definitions &&
                firstMeaning.definitions.length > 0
            ) {
                setDefinition(firstMeaning.definitions[0].definition)
                //check audio
                if (data[0].phonetics[0]?.audio) {
                    const audio = new Audio(data[0].phonetics[0].audio)
                    setAudio(audio)
                } else {
                    setAudio(null) // Reset audio
                }
            }
        } else {
            console.log(`${word}: No definition found.`)
        }
    }, [currentIndex, words])

    useEffect(() => {
        fetchDefinition()
    }, [currentIndex, fetchDefinition])

    const handleNextWord = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length)
        setShowDefinition(false) // Reset to show word when moving to the next word
    }, [words.length, setShowDefinition])

    const handlePreviousWord = useCallback(() => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + words.length) % words.length
        )
        setShowDefinition(false) // Reset to show word when moving to the previous word
    }, [words.length, setShowDefinition])

    const handleClick = () => {
        setShowDefinition(!showDefinition)
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Check if the focused element is an input field
            if (document.activeElement?.tagName === 'INPUT') {
                return
            }

            switch (event.code) {
                case 'ArrowDown':
                    if (studyChoice === 'Flashcard')
                        setShowDefinition(!showDefinition)
                    break
                case 'ArrowUp':
                    if (audio && !showDefinition) audio.play()
                    break
                case 'ArrowRight':
                    handleNextWord()
                    break
                case 'ArrowLeft':
                    handlePreviousWord()
                    break
                default:
                    break
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [
        showDefinition,
        handleNextWord,
        setShowDefinition,
        audio,
        handlePreviousWord,
        studyChoice,
    ])

    return (
        <div className="">
            <div className="flex justify-center items-center">
                <button
                    className="flex flex-col justify-center items-center"
                    onClick={handleNextWord}
                >
                    <BsChevronLeft size={35} />
                </button>
                {studyChoice === 'Flashcard' && (
                    <button
                        onClick={handleClick}
                        className="border p-4 m-2 cursor-pointer rounded-md hover:bg-gray-100"
                    >
                        Flip
                    </button>
                )}
                {audio && !showDefinition && (
                    <button onClick={() => audio.play()}>
                        <AiTwotoneSound
                            className="text-gray-500 hover:text-gray-700"
                            size={30}
                        />
                    </button>
                )}
                {!audio && !showDefinition && (
                    <Link
                        target="_blank"
                        href={`https://www.google.com/search?q=word+pronunciation+${words[currentIndex]}`}
                    >
                        <LiaExternalLinkSquareAltSolid
                            className="text-gray-500 hover:text-gray-700"
                            size={30}
                        />
                    </Link>
                )}
                <button
                    className="flex flex-col justify-center items-center"
                    onClick={handleNextWord}
                >
                    <BsChevronRight size={35} />
                </button>
            </div>
            <div
                className={`${
                    showDefinition ? `text-xl` : `text-4xl`
                } flex justify-center items-center `}
            >
                {showDefinition ? definition : words[currentIndex]}
            </div>
        </div>
    )
}

export default WordCard
