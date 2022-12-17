const express = require('express')
const path = require('path')
const fs = require('fs/promises')

const app = express()
app.use(express.json())

const jsonPath = path.resolve('./file/task.json')

app.get('/tasks', async (req, res) => {
  const jsonFile = await fs.readFile(jsonPath, 'UTF-8')
  res.send(jsonFile)
})

app.post('/tasks', async (req, res) => {
  const task = req.body
  const taskArray = JSON.parse(await fs.readFile(jsonPath, 'UTF-8'))
  const id = taskArray.length + 1
  taskArray.push({ id, ...task })
  await fs.writeFile(jsonPath, JSON.stringify(taskArray))
  res.end()
})

app.put('/tasks', async (req, res) => {
  const task = req.body
  const taskArray = JSON.parse(await fs.readFile(jsonPath, 'UTF-8'))
  const taskEdited = taskArray.map((e) => {
    if (e.id === task.id) {
      e = task
    }
    return e
  })
  await fs.writeFile(jsonPath, JSON.stringify(taskEdited))
  res.end()
})

app.delete('/tasks', async (req, res) => {
  const task = req.body
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'UTF-8'))
  const tasksFiltered = tasksArray.filter((el) => {
    return el.id !== task.id
  })
  await fs.writeFile(jsonPath, JSON.stringify(tasksFiltered))
  res.end()
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})
