import { stringify } from "querystring";
import React from "react";

import * as questionsJson from "@questions/questions_halloween_2022_01.json"

const answers = [
    'Foo (30)',
    'Bar (23)',
    'Bazinga (16)',
    'Hello (14)',
    'World (11)',
    'Goodnight (7)',
    'Moon (1)',
]

interface QuestionJson {
    readonly question: string
    readonly answers: ReadonlyArray<AnswerJson>
}

interface AnswerJson {
    readonly text: string
    readonly score: number
}

// TODO
// const mapQuestions = (questionsJson: ReadonlyArray<QuestionJson>): Question[] {
    
// }


export default () => {

    console.log("questions:", JSON.stringify(questionsJson))
    console.log("question count:", questionsJson.length)
    
    const [flips, setFlips] = React.useState({} as Record<string, boolean>)
    const [currentQuestion, setCurrentQuestion] = React.useState(1)

    const flip = (id: string) => {
        const flipped = flips[id]
        setFlips({...flips, [id]: !flipped})
    }

    const createButton = (text: string, id: string): any => {
        const flipped = flips[id]
        const color = flipped ? 'bg-gray-100' : 'bg-gray-500'
        return (
            <button type="submit" className={`text-center ${color} cursor-pointer rounded-md ${flipped ? 'flipped' : ''}`} onClick={() => flip(id)}>
                {text}
            </button>
        )
        }

    const onQuestionChange = (val: React.ChangeEvent<HTMLSelectElement>) => {
        // console.log("Question changed:", val.target.value)
        setCurrentQuestion(parseInt(val.target.value))
    }

    return (<React.Fragment>
        <div className="flex mx-[5px] px-[2px] py-[10px] min-h-[250px]">
            <div className="w-1/2 m-[2px] ">
                {(createButton('Answer 1 (50)', 'answer-1'))}
            </div>
            <div className="w-1/2 m-[2px] ">
                {(createButton('Answer 2 (30)', 'answer-2'))}
            </div>
        </div>
        <div className="flex w-full">
            {currentQuestion}
            <select name="questions" id="questions" value={currentQuestion} onChange={val => onQuestionChange(val)}>
                <option value="1" id="question-1">Question 1</option>
                <option value="2" id="question-2">Question 2</option>
                <option value="3" id="question-3">Question 3</option>
            </select>
        </div>
        {/* <div className="flex w-full p-[5px]">
            <button type="submit" className="text-right rounded-full bg-green-300 px-[10px]" onClick={() => setFlips({})}>
                Reset
            </button>
        </div> */}
    </React.Fragment>)
}
