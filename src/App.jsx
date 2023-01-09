import { useState, useEffect } from 'react'
import './App.scss'
import Layout from './features/Layout'
import { charachterGetAll, locationGetAll, episodeGetAll } from './api/api'

function App() {
  const [count, setCount] = useState(0)
  const [charachters, setCharachters] = useState([])
  const [episodes, setEpisodes] = useState([])
  const [earthCharachters, setEarthCharachters] = useState([])
  const [earthAppearances, setEarthAppearances] = useState({}) // {[charachter]: numAppearances}
  let locations = []
  let earthVal = "Earth (C-137)"
  let data = []
  useEffect(() => {
    async function fechData() {
      try {
        data = await Promise.all([charachterGetAll(), episodeGetAll()])
        setCharachters(data[0])
        // locations = data[1]
        setEpisodes(data[1])
        // calcEarthAppearances()
        // console.log(earthCharachters)
        // console.log(charachters,
        //   episodes)
      } catch (err) {
        console.log(err)
      }
    }
    fechData()
  }, [])
  useEffect(() => {
    // console.log(charachters)
    const fromEarth = charachters.filter(charachter => charachter?.origin?.name === earthVal)
    console.log(fromEarth)
    const initEarthAppearances = fromEarth.reduce((acc,char) => {
      acc[char.id.toString()] = 0
      return acc
    },{})
    console.log(initEarthAppearances)
    setEarthAppearances(initEarthAppearances)
    setEarthCharachters(fromEarth)
  }, [charachters])

  useEffect(() => {
    console.log(earthCharachters)
    let earthAppearances = episodes.reduce(episode => {
      return
    }, {})
  }, [earthCharachters])

  useEffect(()=>{
    console.log(episodes)
  },[episodes])

  // function calcEarthAppearances(){
  //   earthAppearances = episodes.reduce(episode=>{
  //     return
  //   },earthAppearances)
  // }
  return (
    <div className="App">
      <Layout />

    </div>
  )
}

export default App
