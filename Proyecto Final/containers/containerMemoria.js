import fs from 'fs';

async function read(name) {
    try {
        const result = JSON.parse(await fs.promises.readFile(`./${name}.txt`,'utf-8'))
        return result
    } catch (err) {
        return(err)
    }
}

async function update(name, data) {
    try {
        fs.promises.writeFile(`./${name}.txt`,JSON.stringify(data))
    } catch (err) {
        return(err)
    }
}

export { read, update }