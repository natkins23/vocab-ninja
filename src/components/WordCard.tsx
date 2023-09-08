'use client'
import { BsChevronRight } from 'react-icons/bs'
import { BsChevronLeft } from 'react-icons/bs'

import { AiTwotoneSound } from 'react-icons/ai'
import { LiaExternalLinkSquareAltSolid } from 'react-icons/lia'
import Link from 'next/link'

type WordCardProps = {
    showDefinition: boolean
    studyChoice: string
    handleNextWord: () => void
    handleClick: () => void
    audio: HTMLAudioElement | null
    definition: string | null
    currentWord: string
}

const WordCard: React.FC<WordCardProps> = ({
    showDefinition,
    studyChoice,
    handleNextWord,
    handleClick,
    audio,
    definition,
    currentWord,
}) => {
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
                        href={`https://www.google.com/search?q=word+pronunciation+${currentWord}`}
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
                {showDefinition ? definition : currentWord}
            </div>
        </div>
    )
}

export default WordCard
