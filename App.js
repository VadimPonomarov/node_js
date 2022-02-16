const fs = require('fs')
const path = require('path')

const {fancyText} = require('./fancy_text/fancyText')

const app = () => {

    fs.rmdirSync(path.join(process.cwd(), 'main'), {recursive: true})
    fs.rmdirSync(path.join(process.cwd(), 'another_folder'), {recursive: true})

    const readDirRecursive = (dirPath = 'another_folder') => {
        fs.readdir(path.join(process.cwd(), dirPath),
            {withFileTypes: true},
            (err, data) => {
                if (!data) {
                    return
                }
                data.forEach(item => {
                    if (fs.statSync(path.join(process.cwd(), dirPath, item.name)).isDirectory()) {
                        fs.rename(path.join(process.cwd(), dirPath, item.name),
                            path.join(process.cwd(), dirPath, `new_${item.name}`),
                            (err) => {
                                if (err) {
                                    throw err
                                }
                                readDirRecursive(path.join(dirPath, `new_${item.name}`))
                            })

                    } else {

                        fs.readFile(path.join(process.cwd(), dirPath, item.name), (err1, data) => {
                            if (err) {
                                throw err
                            }
                            console.log(data.toString())
                            fs.writeFile(path.join(process.cwd(), dirPath, item.name),
                                '',
                                (err) => {
                                    if (err) {
                                        throw err
                                    }
                                    console.log('\n!!!\nBut now file "textFromMain.txt" is cleared and totally empty\n')
                                })
                        })
                    }
                })
            }
        )
    }

    fs.mkdir(path.join(process.cwd(), 'main'),
        {recursive: true},
        (err) => {
            if (err) {
                throw err
            }
            fs.writeFile(path.join(process.cwd(), 'main', 'testText.txt'),
                fancyText.toString().trim(), (err) => {
                    if (err) {
                        throw err
                    }
                    fs.mkdir(path.join(process.cwd(), 'another_folder', 'sub_folder', 'next_sub_folder', 'next'),
                        {recursive: true}, (err) => {
                            if (err) {
                                throw err
                            }
                            fs.rename(
                                path.join(process.cwd(), 'main', 'testText.txt'),
                                path.join(process.cwd(), 'another_folder', 'textFromMain.txt'),
                                (err) => {
                                    if (err) {
                                        throw err
                                    }
                                    readDirRecursive()
                                })
                        })
                })
        })
}


module.exports = {app}
