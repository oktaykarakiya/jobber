import fs from 'fs'

export default function write_file(data, name) {
    const jsonData = JSON.stringify(data, null, 2)
  
    fs.writeFile(`${name}.json`, jsonData, (err) => {
      if (err) {
        console.error('An error occurred:', err);
        return;
      }
      console.log('File has been saved.');
    })
  }
  