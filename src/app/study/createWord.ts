import { prisma } from '@/lib/db'

async function main() {
    const newWord = await prisma.word.create({
        data: {
            text: 'word',
            isStandard: true,
            meanings: {
                create: [
                    {
                        partOfSpeech: 'noun',
                        definitions: {
                            create: [
                                {
                                    text: 'A single distinct meaningful element of speech or writing, used with others to form a sentence.',
                                },
                            ],
                        },
                    },
                ],
            },
        },
    })

    console.log('New word created:', newWord)
}

main()
    .catch((e) => {
        console.error('Error:', e)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
