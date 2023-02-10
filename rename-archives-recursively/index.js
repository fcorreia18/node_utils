import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url';

// fs.rm()
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
import { opendir } from 'fs/promises';

async function changeExtensionToMp4(dirname){
    try {
      const dir = await opendir(dirname);
      for await (const dirent of dir){
        const filePath = path.join(dirname, dirent.name);
        if (dirent.isDirectory()) {
            await changeExtensionToMp4(filePath)
          }else if(path.extname(filePath)!== ".mp4" && path.extname(filePath) === ".ts"){// the condition second part is to not overwrite other files such as index.js, the extension must be the atual files extension that you want to change
            const newFileName = path.join(path.dirname(filePath),path.basename(filePath, path.extname(filePath)) +".mp4" )
            fs.rename(filePath, newFileName, err =>{
                if (err) console.error(err)
                console.log("Files successfully renamed")
            })
        }
      }
    } catch (err) {
      console.error(err);
    }
}


function changeExtension(dir) {
    fs.readdir(dir, (err, files) => {
      if (err) {
        console.error(err);
        return;
      }
      files.forEach(file => {
        const filePath = path.join(dir, file);
        fs.stat(filePath, (err, stat) => {
          if (err) {
            console.error(err);
            return;
          }
          if (stat.isDirectory()) {
            changeExtension(filePath);
          } else if (path.extname(filePath) !== '.mp4' && path.extname(filePath) === ".ts") {// ".ts" must be the actual files extension that you want to change
            const newFilePath = path.join(path.dirname(filePath), path.basename(filePath, path.extname(filePath)) + '.mp4');
            fs.rename(filePath, newFilePath, err => {
              if (err) {
                console.error(err);
              }
            });
          }
        });
      });
    });
  }

  const directory = __dirname;//'/path/to/directory'in my case I put the files in the same directory as my index.js


//changeExtension(__dirname); second alternative
// await changeExtensionToMp4(directory)