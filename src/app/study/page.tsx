import StudyPage from '@/components/StudyPage'
import { prisma } from '@/lib/db'
import { getAuthSession } from '@/lib/nextauth'
import { redirect } from 'next/navigation'
import words from '@/lib/seedWords'

type Definition = {
    id: string
    definition: string
    meaningId: string
}

type Meaning = {
    id: string
    partOfSpeech: string
    wordId: string
    definitions: Definition[]
}

type WordData = {
    id: string
    word: string
    pronunciation: string | null
    meanings: Meaning[]
}

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

async function DBwordFetch(word: string) {
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

function simplifyWordData(wordData: WordData[]) {
    return wordData.map((word) => {
        const firstMeaning = word.meanings[0] // Get the first meaning object
        const firstDefinition = firstMeaning
            ? firstMeaning.definitions[0]
            : null // Get the first definition from the first meaning
        const partOfSpeech = firstMeaning ? firstMeaning.partOfSpeech : null // Get the part of speech from the first meaning

        return {
            word: word.word,
            pronunciation: word.pronunciation,
            partOfSpeech: partOfSpeech,
            definition: firstDefinition ? firstDefinition.definition : null,
        }
    })
}

async function fetchWords(words: string[]) {
    let wordData = []
    for (const word of words) {
        const DBwordData = await DBwordFetch(word)
        if (DBwordData) {
            console.log(`${word} exists in the database, fetching...`)
            wordData.push(DBwordData)
        } else {
            console.log(`${word} not in DB, making API call...`)
            await addWordToDatabase(word)
            const DBwordData = await DBwordFetch(word)
            if (DBwordData) {
                console.log(
                    `newly added word ${word} is now in database, fetching...`
                )
                wordData.push(DBwordData)
            }
        }
    }
    const simpleData = simplifyWordData(wordData)
    return simpleData
}
async function fetchWordListFromDB() {
    const wordListFromDB = await prisma.word.findMany({
        select: {
            word: true, // Only select the 'word' field
        },
    })
    // Convert the array of objects to an array of strings
    const wordArray = wordListFromDB.map((wordObj) => wordObj.word)
    return wordArray
}

// async function logAllWords() {
//     const allWords = await prisma.word.findMany({
//         include: {
//             meanings: true, // Include meanings in the result
//         },
//     })
//     console.log('All words in the database:', allWords)
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
    await fetchWords(words)
    const wordList = await fetchWordListFromDB()
    // cleanDatabase()
    const session = await getAuthSession()
    if (!session?.user) {
        return redirect('/')
    }

    return (
        <div>
            <StudyPage words={wordList} />
        </div>
    )
}

export default Home
