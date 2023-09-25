'use client'

import React, { useCallback, useEffect } from 'react'
import { Button } from './ui/button'
import { signIn } from 'next-auth/react'

type Props = {
    text: string
}

const SignInButton = ({ text }: Props) => {
    const testHandler = useCallback(async () => {
        fetch('/api/getWordInfo')
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((error) => console.error('Error:', error))
    }, [])

    useEffect(() => {
        testHandler()
    }, [testHandler])

    return (
        <Button
            onClick={() => {
                signIn('google').catch(console.error)
            }}
        >
            {text}
        </Button>
    )
}

export default SignInButton
