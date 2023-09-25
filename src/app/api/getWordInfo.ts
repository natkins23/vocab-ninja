import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/db'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'GET':
            // Handle GET request
            res.status(200).json({ message: 'GET request received' })
            break
        case 'POST':
            // Handle POST request
            res.status(200).json({ message: 'POST request received' })
            break
        default:
            res.status(405).end() // Method Not Allowed
            break
    }
}
