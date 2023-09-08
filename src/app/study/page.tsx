import StudyPage from '@/components/StudyPage'
import { prisma } from '@/lib/db'
import { getAuthSession } from '@/lib/nextauth'
import { redirect } from 'next/navigation'
import words from '@/lib/tempConsts'

async function fetchFromAPI(word: string) {
    let wordData = null
    try {
        const response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        )
        const data = await response.json()

        if (data && data.length > 0) {
            wordData = data
        } else {
            console.log(`${word}: No definition found.`)
        }
    } catch (error) {
        console.error(
            `fetchFromAPI: Failed to fetch definition for ${word}: ${error}`
        )
    }

    return wordData
}

async function checkWordDB(word: string) {
    const fetchedWord = await prisma.word.findUnique({
        where: {
            word: word,
        },
        include: {
            meanings: {
                include: {
                    definitions: true,
                },
            },
        },
    })
    return fetchedWord
}

async function addWordToDatabase(word: string) {
    const fetchedData = await fetchFromAPI(word)
    if (!fetchedData || fetchedData.length === 0) {
        console.log(`checkWordExists: No data found for ${word}`)
    }

    const APIwordData = fetchedData[0]
    try {
        const newWordData = {
            word: APIwordData.word,
            pronunciation: APIwordData.phonetics[0].audio,
            meanings: {
                create: APIwordData.meanings.map((meaning: any) => ({
                    partOfSpeech: meaning.partOfSpeech,
                    definitions: {
                        create: meaning.definitions.map((defs: any) => ({
                            definition: defs.definition,
                        })),
                    },
                })),
            },
        }

        const newWord = await prisma.word.create({
            data: newWordData,
        })

        console.log(newWord)
    } catch (error: any) {
        if (error.code === 'P2002') {
            console.log('AddWords: Unique constraint violation. Skipping.')
        } else {
            console.error(`AddWords: An unknown error occurred:`, word, error)
        }
    }
}

async function fetchWords(words: string[]) {
    let wordData = []
    for (const word of words) {
        const DBwordData = await checkWordDB(word)
        if (DBwordData) {
            console.log(`${word} exists in the database, fetching...`)
            wordData.push(DBwordData)
        } else {
            console.log(`${word} not in DB, making API call...`)
            const newWordData = await addWordToDatabase(word)
            const DBwordData = await checkWordDB(word)
            if (DBwordData) {
                console.log(
                    `newly added word ${word} is now in database, fetching...`
                )
                wordData.push(DBwordData)
            }
        }
        wordData.map((word) => console.log('word', word.word))
    }
}
// async function logAllWords() {
//     const allWords = await prisma.word.findMany({
//         include: {
//             meanings: true, // Include meanings in the result
//         },
//     })
//     console.log('All words in the database:', allWords)
// }

// async function findWordDefinition() {
//     try {
//         // Find the word "word" and its associated meanings and definitions
//         const word = await prisma.word.findUnique({
//             where: {
//                 text: 'word',
//             },
//             include: {
//                 meanings: {
//                     include: {
//                         definitions: true,
//                     },
//                 },
//             },
//         })

//         if (!word) {
//             console.log('The word "word" was not found in the database.')
//             return
//         }

//         console.log(`Word: ${word.text}`)
//         word.meanings.forEach((meaning, index) => {
//             console.log(`  Meaning ${index + 1} (${meaning.partOfSpeech}):`)
//             meaning.definitions.forEach((definition, defIndex) => {
//                 console.log(
//                     `    Definition ${defIndex + 1}: ${definition.text}`
//                 )
//             })
//         })
//     } catch (error) {
//         console.error('An error occurred:', error)
//     } finally {
//         await prisma.$disconnect()
//     }
// }
async function cleanDatabase() {
    try {
        // Delete child records first to satisfy foreign key constraints
        const deleteDefinitions = await prisma.definition.deleteMany({})
        const deleteMeanings = await prisma.meaning.deleteMany({})

        // Now delete parent records
        const deleteWords = await prisma.word.deleteMany({})

        console.log(
            `Deleted ${deleteDefinitions.count} definitions, ${deleteMeanings.count} meanings, and ${deleteWords.count} words from the database.`
        )
    } catch (error) {
        console.error(`An error occurred while cleaning the database: ${error}`)
    }
}

export async function Home() {
    // main()
    fetchWords(words)
    // cleanDatabase()
    const session = await getAuthSession()
    if (!session?.user) {
        return redirect('/')
    }

    return (
        <div>
            <StudyPage words={words} />
        </div>
    )
}

export default Home
