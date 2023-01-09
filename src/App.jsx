import { useState, useEffect } from 'react'
import './App.scss'
import Graph from './components/Graph'
import Table from './components/Table'
import { characterGetAll, locationGetAll, getLocation, episodeGetAll, getCharactersFromIds } from './api/api'

function App() {
  let characters = []
  let episodes = []
  let locations = []
  let earthCharacters = []
  let earthAppearances = {}
  let lastSeenOnEarth = []
  let residentsIds = []
  let earthVal = "Earth (C-137)"
  const graphCaracters = ["Abradolf Lincler", "Arcade Alien", "Morty Smith", "Birdperson", "Mr. Meeseeks"]

  let data = []
  const [characterCard, setCharacterCard] = useState({})
  useEffect(() => {
    async function fechDataPartOne() {
      try {
        data = await Promise.all([episodeGetAll(), locationGetAll(), characterGetAll()])
        episodes = data[0]
        locations = data[1]
        characters = data[2]
        // console.log('locations', locations)
        console.log('episodes', episodes)
        console.log('characters', characters)
        let earthLocation = locations.find(location => location.name === earthVal)
        // console.log('earthLocation', earthLocation.residents)
        residentsIds = earthLocation.residents.map(resident => {
          return resident.substring(resident.lastIndexOf('/') + 1, resident.length).toString()
        })
        characters = await getCharactersFromIds(residentsIds)
        // console.log('residentsIds', residentsIds)
        // const fromEarth = characters.filter(character => character?.origin?.name === earthVal)
        // console.log('fromEarth', fromEarth)
        const earthAppearances = characters.reduce((acc, char) => {
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
        // console.log('initEarthAppearances', initEarthAppearances)
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
          minAppearancesList.push({ [id]: calcedEarthAppearances[id] })
        }
        minAppearancesList.sort((a, b) => Object.values(a)[0].appearances > Object.values(b)[0].appearances ? 1 : -1)
        const minAppearances = Object.values(minAppearancesList[0])[0].appearances
        const allMinAppearances = minAppearancesList.filter(item => Object.values(item)[0].appearances === minAppearances)
        allMinAppearances.sort((a, b) => Object.values(a)[0].name > Object.values(b)[0].name ? 1 : -1)
        // console.log('minAppearancesList', minAppearancesList)
        // console.log('allMinAppearances', allMinAppearances)
        // console.log(allMinAppearances[0])
        let [characterId, characterCard] = Object.entries(allMinAppearances[0])[0]
        getLocation(characterId)
          .then(data => {
            characterCard.dimension = data.dimension
            setCharacterCard(characterCard)
          })
      } catch (err) {
        // console.log(err)
      }
    }
    async function fetchDataPartTwo(){
      // graphCaracters.
    }

    fechDataPartOne()
    fetchDataPartTwo()
  }, [])
  return (
    <div className="App">
      <div><Table card={characterCard} /></div>
      <div><Graph /></div>

    </div>
  )
}

export default App
