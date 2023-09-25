'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import WordCard from './WordCard'
import { Input } from './ui/input'
import WordNavigation from './WordNavigation'
import { MdSend } from 'react-icons/md'
import MCForm from './MCForm'

type Props = {
    words: string[]
}

///theres a list
//user wants to study the list, and so needs the defs
//we check to see if we have the defs
//--->check local storage for the list
//--->check to see if the list matches the list in local storage
//--->on any list change we update local storage
//--->if we dont have a def, we fetch it

const StudyPage: React.FC<Props> = ({ words }) => {
    const StudyChoices = ['Flashcard', 'Multiple Choice', 'Text Input']
    const [studyChoice, setStudyChoice] = useState('Flashcard')
    const [showDefinition, setShowDefinition] = useState(false)
    const [showAnswer, setShowAnswer] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentDefinition, setCurrentDefinition] = useState<string | null>(
        null
    )
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

    const handleNextWord = () =>
        setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length)
    const handlePreviousWord = () =>
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + words.length) % words.length
        )

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
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
    }, [showDefinition, audio, studyChoice])

    const handleSubmit = () => {
        setShowAnswer(true)
        inputRef.current?.blur()
    }
    return (
        <div className="flex flex-col items-center justify-start w-screen h-screen gap-5 py-20">
            <div className="flex items-center justify-center w-fit rounded-md bg-gray-300 p-2">
                {StudyChoices.map((choice, index) => (
                    <button
                        key={index}
                        onClick={() => setStudyChoice(choice)}
                        className={`cursor-pointer hover:text-gray-400 p-2 ${
                            choice === studyChoice
                                ? 'text-sky-600 font-semibold'
                                : ''
                        }`}
                    >
                        {choice}
                    </button>
                ))}
            </div>
            <div className="flex flex-col gap-2 items-center justify-center py-40 w-full">
                <WordCard
                    showDefinition={showDefinition}
                    studyChoice={studyChoice}
                    currentWord={words[currentIndex]}
                    audio={audio}
                    handleClick={() => setShowDefinition(!showDefinition)}
                    handleNextWord={handleNextWord}
                    definition={currentDefinition}
                />
                {studyChoice === 'Text Input' && (
                    <div className="flex items-center justify-center w-[50%] gap-3 outline-none">
                        <Input
                            ref={inputRef}
                            className="bg-slate-200 outline-none border-none"
                            type="text"
                            placeholder={
                                showDefinition
                                    ? 'Enter word'
                                    : 'Enter definition'
                            }
                            onKeyDown={(e) =>
                                e.key === 'Enter' && handleSubmit()
                            }
                        />
                        <button onClick={handleSubmit}>
                            <MdSend size={25} />
                        </button>
                    </div>
                )}
                {studyChoice === 'Multiple Choice' && <MCForm />}
                {showAnswer && (
                    <div className="select-none">
                        {Math.random().toFixed(2)}
                    </div>
                )}
            </div>
            <WordNavigation />
        </div>
    )
}

export default StudyPage
