const path = require("node:path")
const fs = require("node:fs/promises")

const word5LetterPath = path.join(__dirname, "resources", "words_5_letter.txt")
console.log("Path to output:", word5LetterPath)

const input = "h*art"
console.log("Matches for: " + input)
const regexStr = "^" + input.replaceAll("*", "[a-z]") + "$"
const regex = new RegexExp(regexStr)

const main = async () => {
    const file = await fs.open(word5LetterPath)
    // console.log("file:", file)
    for await (const line of file.readLines()) {
        if (line?.length === 5) {
            console.log(line);
        }
    }
}

main()
