'use client'

import React, { useState, useRef } from 'react'
import WordCard from './WordCard'
import { Input } from './ui/input'
import WordNavigation from './WordNavigation'
import { MdSend } from 'react-icons/md'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'

type Props = {}

const StudyPage = (props: Props) => {
    const StudyChoices = ['Flashcard', 'Multiple Choice', 'Text Input']
    const [studyChoice, setStudyChoice] = useState('Flashcard')
    const [showDefinition, setShowDefinition] = useState<boolean>(false)
    const [answerStatus, setAnswerStatus] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleChoiceClick = (choice: string) => {
        setStudyChoice(choice)
    }

    const handleSubmit = () => {
        // Generate a random number between 0 and 1
        const randomNumber = Math.random().toFixed(2)
        setAnswerStatus(`Answer: ${randomNumber}`)
        if (inputRef.current) {
            inputRef.current.blur()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit()
        }
    }

    return (
        <div className="flex flex-col items-center justify-start w-screen h-screen gap-5 py-20">
            <div className="flex items-center justify-center w-fit rounded-md bg-gray-300 p-2">
                {StudyChoices.map((choice, index) => (
                    <div
                        key={index}
                        className={`cursor-pointer hover:text-gray-400 p-2 ${
                            choice === studyChoice &&
                            ' text-sky-600 font-semibold'
                        }`}
                        onClick={() => handleChoiceClick(choice)}
                    >
                        {choice}
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-2 items-center justify-center py-40 w-full">
                <WordCard
                    showDefinition={showDefinition}
                    setShowDefinition={setShowDefinition}
                    studyChoice={studyChoice}
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
                            onKeyDown={handleKeyDown}
                        />
                        <div onClick={handleSubmit}>
                            <MdSend size={25} />
                        </div>
                    </div>
                )}
                {studyChoice === 'Multiple Choice' && (
                    <div className="flex items-center justify-center w-[50%] gap-3 outline-none"></div>
                )}
                {answerStatus && (
                    <div className="select-none">{answerStatus}</div>
                )}
            </div>
            <WordNavigation />
        </div>
    )
}

export default StudyPage
