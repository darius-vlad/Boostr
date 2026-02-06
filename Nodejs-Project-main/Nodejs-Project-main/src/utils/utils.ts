import fs from 'fs'

export default function writeJsonToFile(jsonObject: any) {
    fs.writeFile('./my_test_file.txt', JSON.stringify(jsonObject), 'utf8',
        (err : Error | null) => {
            if (err) throw err;
            console.log("Data has been written to file!")
        })
}
