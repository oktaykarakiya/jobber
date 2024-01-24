import fs from 'fs'

export default function read_file(filename) {
    let file = []

    try {
        const data = fs.readFileSync(`${filename}.json`, 'utf8');
        const jsonData = JSON.parse(data);
        file = jsonData
    } catch (err) {
        console.error(err);
    }

    return file
}