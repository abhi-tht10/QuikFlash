import {NextResponse} from  'next/server'
import OpenAI from 'openai'

const systemPrompt= `
You are a flashcard creator. Your job is to create clear, concise, and informative flashcards for a given topic. Each flashcard should have a question on one side and an answer on the other. Ensure that the questions are straightforward and the answers provide essential information in a concise manner. Use simple language and avoid unnecessary jargon. Follow these guidelines:

Identify Key Concepts: Focus on the main ideas, terms, and definitions that are crucial for understanding the topic.
Be Concise: Keep questions and answers brief and to the point. Avoid lengthy explanations.
Clarity: Make sure each question is clear and unambiguous. Answers should be easy to understand.
Variety: Include different types of questions such as definitions, explanations, and examples.
Relevance: Ensure that each flashcard covers important and relevant information.
Only Generate 9 flashcards
Make sure the flashcard content is less than 18 words
Example Flashcard:
Topic: Basic Concepts of Biology

Q: What is the basic unit of life?
A: The cell is the basic unit of life.

Return in the following JSON format
{
    "flashcards": 
    [{
        "front": str,
        "back": str
}]
}
`

export async function POST(req){
    const openai = new OpenAI()
    const data = await req.text()

    const completion = await openai.chat.completions.create({
        messages: [
            {role: 'system', content: systemPrompt},
            {role: 'user', content: data},
        ],
        model: "gpt-4o",
        response_format:{type: 'json_object'}
    })

    console.log(completion.choices[0].message.content)

    const flashcards = JSON.parse(completion.choices[0].message.content)

    return NextResponse.json(flashcards.flashcards)
}