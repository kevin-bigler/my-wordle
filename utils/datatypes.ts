interface Question {
    readonly prompt: string
    readonly answers: ReadonlyArray<Answer>
}

interface Answer {
    readonly text: string
    readonly points: number
}

// come up with a better name for this type
interface QuestionList {
    readonly name: string
    readonly questions: ReadonlyArray<Question>
}
