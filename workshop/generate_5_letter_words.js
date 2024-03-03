// const { open, appendFile } = require('node:fs/promises');
// // const fs = require("node:fs/promises")
// const path = require("path")

// const wordsPath = path.join(__dirname, "resources", "words_alpha.txt")
// const words5LetterPath = path.join(__dirname, "resources", "words_5_letter.txt")
// // fs.readFileSync(wordsPath, "utf-8")



// (async () => {
//   const file = await open(wordsPath);

//   for await (const line of file.readLines()) {
//     if (line?.length === 5) {
//         console.log(line);
//         // await appendFile(words5LetterPath, line)
//     }
//   }
// })();

// see this code for functor implementations usable for Stream transforms (ie stream.pipe(map(xyz)).pipe(filter(xyz)))
// const { createWriteStream } = require("node:fs")
// createWriteStream(word5LetterPath, "utf-8")

const path = require("node:path")
const fs = require("node:fs/promises")

const wordFilePath = path.join(__dirname, "resources", "words_alpha.txt")
const word5LetterPath = path.join(__dirname, "resources", "words_5_letter.txt")
console.log("Path to source:", wordFilePath)
console.log("Path to output:", word5LetterPath)

fs.unlink(word5LetterPath)
const main = async () => {
    const file = await fs.open(wordFilePath)
    // console.log("file:", file)
    for await (const line of file.readLines()) {
        if (line?.length === 5) {
            console.log(line);
            await fs.appendFile(word5LetterPath, line + "\n", {encoding: "utf-8"})
        }
    }
}

main()