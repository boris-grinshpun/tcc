import { useState, useEffect } from 'react'
import './App.scss'
import Layout from './features/Layout'
import { characterGetAll, locationGetAll, episodeGetAll } from './api/api'

function App() {
  let characters = []
  let episodes = []
  let earthCharacters = []
  let earthAppearances = {}
  let locations = []
  let earthVal = "Earth (C-137)"
  let data = []
  useEffect(() => {
    async function fechData() {
      try {
        data = await Promise.all([characterGetAll(), episodeGetAll()])
        characters = data[0]
        episodes = data[1]
        // console.log('episodes', episodes)
        const fromEarth = characters.filter(character => character?.origin?.name === earthVal)
        // console.log('fromEarth', fromEarth)
        const initEarthAppearances = fromEarth.reduce((acc, char) => {
          acc[char.id.toString()] = {appearances: 0, name: char.name}
          return acc
        }, {})
        // console.log('initEarthAppearances', initEarthAppearances)
        earthAppearances = initEarthAppearances
        earthCharacters = fromEarth
        // console.log('earthCharacters', earthCharacters)
        const calcedEarthAppearances = episodes.reduce((acc, episode) => {
          episode.characters.forEach(character => {
            const characterId = character.substring(character.lastIndexOf('/') + 1, character.length).toString()
            if (earthAppearances.hasOwnProperty(characterId)) {
              earthAppearances[characterId].appearances++
            }
          })
          return acc
        }, earthAppearances)
        // console.log(calcedEarthAppearances)
        let minAppearancesList = []
        for (let id in calcedEarthAppearances) {
          minAppearancesList.push({ [id]: calcedEarthAppearances[id], name: calcedEarthAppearances[id].name })
        }
        minAppearancesList.sort((a, b) => Object.values(a)[0].appearances > Object.values(b)[0].appearances ? 1 : -1)
        const minAppearances = Object.values(minAppearancesList[0])[0].appearances
        const allMinAppearances = minAppearancesList.filter(item=>Object.values(item)[0].appearances === minAppearances)
        allMinAppearances.sort((a, b)=> Object.values(a)[0].name > Object.values(b)[0].name ? 1 : -1)
        // console.log('minAppearancesList', minAppearancesList)
        // console.log('allMinAppearances', allMinAppearances)
      } catch (err) {
        // console.log(err)
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
