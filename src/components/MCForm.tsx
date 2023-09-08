'use client'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from '@/components/ui/use-toast'

type Props = {}

const MCForm = (props: Props) => {
    function shuffleArray(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[array[i], array[j]] = [array[j], array[i]]
        }
        return array
    }
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

    function pickThreeUniqueRandomWords(words: string[]): string[] {
        if (words.length < 3) {
            throw new Error(
                'The list must contain at least three unique words.'
            )
        }

        const uniqueWords = Array.from(new Set(words))
        const pickedWords: string[] = []

        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * uniqueWords.length)
            const randomWord = uniqueWords.splice(randomIndex, 1)[0]
            pickedWords.push(randomWord)
        }

        return pickedWords
    }

    const FormSchema = z.object({
        type: z.enum(['all', 'mentions', 'none'], {
            required_error: 'You need to select a notification type.',
        }),
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        toast({
            title: 'You submitted the following values:',
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">
                        {JSON.stringify(data, null, 2)}
                    </code>
                </pre>
            ),
        })
    }

    const [definitions, setDefinitions] = useState<string[]>([])
    const randomWords = useMemo(
        () => pickThreeUniqueRandomWords(words),
        [words]
    )
    useEffect(() => {
        const fetchDefinitions = async () => {
            const fetchedDefinitions: string[] = []
            for (const word of randomWords) {
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
                        fetchedDefinitions.push(
                            firstMeaning.definitions[0].definition
                        )
                    }
                } else {
                    console.log(`${word}: No definition found.`)
                }
            }
            // Add the correct definition here
            fetchedDefinitions.push('The correct definition')

            // Shuffle the definitions
            const shuffledDefinitions = shuffleArray([...fetchedDefinitions])

            setDefinitions(shuffledDefinitions)
        }

        fetchDefinitions()
    }, [randomWords]) // Dependency array

    return (
        <div className="flex justify-center items-center">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-2/3 space-y-6"
                >
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Pick the definition</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        {definitions.map(
                                            (definition, index) => (
                                                <FormItem
                                                    key={index}
                                                    className="flex items-center space-x-3 space-y-0"
                                                >
                                                    <FormControl>
                                                        <RadioGroupItem
                                                            value={definition}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        {definition}
                                                    </FormLabel>
                                                </FormItem>
                                            )
                                        )}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    )
}

export default MCForm
