import React, { useState } from 'react'
import { FaVolumeUp } from 'react-icons/fa'

interface DefinitionProps {
    wordData: any
}

const Definition: React.FC<DefinitionProps> = ({ wordData }) => {
    const [showAllDefinitions, setShowAllDefinitions] = useState<boolean>(false)

    return (
        <div>
            {/* Display word and sound */}
            {wordData?.word && (
                <div className="flex items-center justify-start gap-4">
                    <div className="text-4xl">{wordData.word}</div>
                    {wordData?.phonetics?.[0]?.audio && (
                        <span
                            onClick={() => {
                                const audio = new Audio(
                                    wordData.phonetics[0].audio
                                )
                                audio.play()
                            }}
                        >
                            <FaVolumeUp size={25} />
                        </span>
                    )}
                </div>
            )}

            {/* Display definitions */}
            {wordData?.meanings && (
                <div>
                    {showAllDefinitions ? (
                        wordData.meanings.map(
                            (meaning: any, meaningIdx: number) => (
                                <div key={meaningIdx}>
                                    <div className="border-2 border-green-500 w-fit py-1 px-2 rounded-full">
                                        {meaning.partOfSpeech}
                                    </div>
                                    <ol className="list-decimal pl-5">
                                        {meaning.definitions.map(
                                            (def: any, defIdx: number) => (
                                                <li key={defIdx}>
                                                    {def.definition}
                                                </li>
                                            )
                                        )}
                                    </ol>
                                </div>
                            )
                        )
                    ) : (
                        <div>
                            <div className="border-2 border-green-500 w-fit py-1 px-2 rounded-full">
                                {wordData.meanings[0].partOfSpeech}
                            </div>
                            <ol className="list-decimal pl-5">
                                <li>
                                    {
                                        wordData.meanings[0].definitions[0]
                                            .definition
                                    }
                                </li>
                            </ol>
                        </div>
                    )}

                    {wordData.meanings.some(
                        (meaning: any) => meaning.definitions.length > 1
                    ) && (
                        <button
                            onClick={() =>
                                setShowAllDefinitions(!showAllDefinitions)
                            }
                        >
                            <div className="italic text-xs">
                                {showAllDefinitions
                                    ? 'Show Less'
                                    : 'More Definitions'}
                            </div>
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

export default Definition
