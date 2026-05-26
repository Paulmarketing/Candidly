import { GoogleGenerativeAI } from '@google/generative-ai'

// Client Gemini — server only
export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Modèle utilisé : Gemini 1.5 Flash (gratuit, rapide, supporte les PDFs)
export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
