import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import Image from 'next/image'

type Props = {}

const Details: React.FC = () => {
    return (
        <div className="flex w-[70%]  justify-center gap-10">
            <div className="flex flex-col w-72  gap-10">
                <Card className=" h-32 p-2">
                    <CardTitle className="flex items-left gap-5">
                        Active Recall
                        <div className="">
                            <Image
                                width={30}
                                height={30}
                                src="/brain.png"
                                alt="brain"
                            />
                        </div>
                    </CardTitle>
                    Internalize vocabulary through strengthened memory retrieval
                </Card>
                <Card className=" h-32 p-2">
                    <CardTitle className="flex items-left gap-5">
                        Spaced Repetition{' '}
                        <div className="">
                            <Image
                                width={30}
                                height={30}
                                src="/brain.png"
                                alt="brain"
                            />
                        </div>
                    </CardTitle>
                    Review at optimal intervals for long-term retention
                </Card>
            </div>
        </div>
    )
}

export default Details
