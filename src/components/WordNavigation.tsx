'use client'
import React, { useState } from 'react'
import { LuSpace } from 'react-icons/lu'
import {
    BsFillArrowRightSquareFill,
    BsFillArrowDownSquareFill,
    BsFillArrowLeftSquareFill,
    BsFillArrowUpSquareFill,
    BsKeyboardFill,
} from 'react-icons/bs'

type Props = {}

const WordNavigation = (props: Props) => {
    const [showShortcuts, setShowShortcuts] = useState(true)

    const toggleShortcuts = () => {
        setShowShortcuts(!showShortcuts)
    }

    return (
        <div className="absolute bottom-0 right-0 pb-5 pr-32 select-none">
            <div className="absolute bottom-0 right-0 p-5 cursor-pointer">
                <BsKeyboardFill size={40} onClick={toggleShortcuts} />
            </div>
            <div
                className={`flex gap-5 transition-all duration-500 ${
                    showShortcuts ? 'opacity-100' : 'opacity-0 translate-x-10'
                }`}
            >
                <div className="flex flex-col justify-center items-center gap-3">
                    <BsFillArrowLeftSquareFill size={25} />
                    <div>Previous</div>
                </div>
                <div className="flex flex-col justify-center items-center gap-3">
                    <BsFillArrowDownSquareFill size={25} />
                    <div>Meaning</div>
                </div>

                <div className="flex flex-col justify-center items-center gap-3">
                    <BsFillArrowUpSquareFill size={25} />
                    <div>Audio</div>
                </div>

                <div className="flex flex-col justify-center items-center gap-3">
                    <BsFillArrowRightSquareFill size={25} />
                    <div>Next</div>
                </div>
            </div>
        </div>
    )
}

export default WordNavigation
