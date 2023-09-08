import React from 'react'
import { Button } from './ui/button'

type Props = {}

const LandingPage = (props: Props) => {
    return (
        <div className="flex flex-col justify-center items-center h-screen gap-5">
            <h1 className="text-5xl">Vocab Mastery The Proven Way</h1>
            <div>
                <Button>Start Learning</Button>
            </div>
        </div>
    )
}

export default LandingPage
