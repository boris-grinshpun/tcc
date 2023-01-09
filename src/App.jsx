import { useState, useEffect } from 'react'
import './App.scss'
import Graph from './components/Graph'
import Table from './components/Table'
import { characterGetAll, getLocation, episodeGetAll, getCharactersfromList } from './api/api'

function App() {
  let characters = []
  let episodes = []
  let earthCharacters = []
  let earthAppearances = {}
  let earthVal = "Earth (C-137)"
  const graphCaracters = ["Abradolf Lincler", "Arcade Alien", "Morty Smith", "Birdperson", "Mr. Meeseeks"]

  let data = []
  const [characterCard, setCharacterCard] = useState({})
  useEffect(() => {
    async function fechData() {
      try {
        data = await Promise.all([characterGetAll(), episodeGetAll()])
        characters = data[0]
        episodes = data[1]

        const fromEarth = characters.filter(character => character?.origin?.name === earthVal)

        const earthAppearances = fromEarth.reduce((acc, char) => {
          const {
            name,
            status,
            species,
            gender,
            image,
            location: { name: characterLocation }
          } = char
          acc[char.id.toString()] = {
            appearances: 0,
            name,
            characterLocation,
            dimention: null,
            status,
            species,
            gender,
            image
          }
          return acc
        }, {})

        const calcedEarthAppearances = episodes.reduce((acc, episode) => {
          episode.characters.forEach(character => {
            const characterId = character.substring(character.lastIndexOf('/') + 1, character.length).toString()
            if (earthAppearances.hasOwnProperty(characterId)) {
              earthAppearances[characterId].appearances++
            }
          })
          return acc
        }, earthAppearances)

        let minAppearancesList = []
        for (let id in calcedEarthAppearances) {
          minAppearancesList.push({ [id]: calcedEarthAppearances[id] })
        }
        minAppearancesList.sort((a, b) => Object.values(a)[0].appearances > Object.values(b)[0].appearances ? 1 : -1)
        const minAppearances = Object.values(minAppearancesList[0])[0].appearances
        const allMinAppearances = minAppearancesList.filter(item => Object.values(item)[0].appearances === minAppearances)
        allMinAppearances.sort((a, b) => Object.values(a)[0].name > Object.values(b)[0].name ? 1 : -1)

        getLocation(Object.keys(allMinAppearances[0])[0])
          .then(data => {
            const card = Object.values(allMinAppearances[0])[0]
            card.dimension = data.dimension
            setCharacterCard(Object.values(allMinAppearances[0])[0])
          })
      } catch (err) {
        // console.log(err)
      }
    }
    fechData()
  }, [])
  return (
    <div className="App">
      <div><Table card={characterCard} /></div>
      <div><Graph /></div>

    </div>
  )
}

export default App
