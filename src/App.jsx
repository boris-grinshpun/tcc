import { useState, useEffect } from 'react'
import './App.scss'
import Layout from './features/Layout'
import { charachterGetAll, locationGetAll, episodeGetAll } from './api/api'

function App() {
  const [count, setCount] = useState(0)
  let carachters = []
  let locations = []
  let episodes = []
  let data = []
  useEffect(() => {
    async function fechData() {
      try {
        data = await Promise.all([charachterGetAll(), locationGetAll(), episodeGetAll()])
        carachters = data[0]
        locations = data[1]
        episodes = data[2]
      } catch (err){
        console.log(err)
      }
    }
    fechData()
  }, [])
  return (
    <div className="App">
      <Layout />

    </div>
  )
}

export default App
