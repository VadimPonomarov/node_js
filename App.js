const fs = require('fs')
const path = require('path')


const onlineUsers = [
    {user: {name: 'Andriy', age: 25, city: 'Lviv'}},
    {user: {name: 'Viktor', age: 22, city: 'Zaporozhye'}},
    {user: {name: 'Evgeniy', age: 29, city: 'Lviv'}},
]
const inPersonUsers = [{user: {name: 'Alex', age: 42, city: 'Kiev'}}]

const dataTransfer = `
const onlineUsers = ${JSON.stringify(onlineUsers)}
const inPersonUsers = ${JSON.stringify(inPersonUsers)}\n
module.exports = {onlineUsers,inPersonUsers}
`
const exchangeFileData = () => {
    fs.readdir(path.join(process.cwd(), 'main', 'onLine'), {withFileTypes: true}, (e, data) => {
        data = data.filter(item => item.name.includes('.txt'))
        data.forEach(item => fs.rename(
            path.join(process.cwd(), 'main', 'onLine', item.name),
            path.join(process.cwd(), 'main', 'onLine', 'inPerson', item.name), () => {
                console.log('Ok')
            }))
    })
    fs.readdir(path.join(process.cwd(), 'main', 'onLine', 'inPerson'), {withFileTypes: true}, (e, data) => {
        data = data.filter(item => item.name.includes('.txt'))
        data.forEach(item => fs.rename(
            path.join(process.cwd(), 'main', 'onLine', 'inPerson', item.name),
            path.join(process.cwd(), 'main', 'onLine', item.name), () => {
                console.log('Ok')
            }))
    })

}

const app = () => {
    fs.mkdir(path.join(process.cwd(), 'main', 'onLine', 'inPerson'),
        {recursive: true},
        (err) => {
            if (err) {
            }
            fs.writeFile(
                path.join(__dirname, 'main', 'index.js'),
                dataTransfer.trim(),
                {flag: 'w'},
                (err) => {
                    const {inPersonUsers: inPersonU, onlineUsers: onlineU} = require('./main/index')
                    const next = () => {
                        onlineU.forEach(item => {
                            fs.writeFile(path.join(__dirname, 'main', 'onLine', `${item.user.name}.onLine.txt`), `${JSON.stringify(item.user)}`, (err) => {
                                if (err) {
                                }
                            })
                        })
                        inPersonU.forEach(item => {
                            fs.writeFile(path.join(__dirname, 'main', 'onLine', 'inPerson', `${item.user.name}.inPerson.txt`), `${JSON.stringify(item.user)}`, (err) => {
                                if (err) {
                                }
                            })
                        })
                    }
                    next()
                    exchangeFileData()
                })
        })
}


module.exports = {app}
