import { useState, useEffect } from 'react'
import './App.scss'
import Graph from './components/Graph'
import Table from './components/Table'
import { characterGetAll, locationGetAll, getLocation, episodeGetAll, getCharactersFromIds } from './api/api'

function App() {
  let allCharacters = []
  let allEpisodes = []
  let allLocations = []
  let earthCharacters = []
  let charAppearanceInEpisodes = {}
  let residentsIds = []
  let graphCharacters = []
  let earthVal = "Earth (C-137)"
  const graphCaracters = ["Abradolf Lincler", "Arcade Alien", "Morty Smith", "Birdperson", "Mr. Meeseeks"]

  let data = []
  const [characterCard, setCharacterCard] = useState({})
  const [graphData, setGraphData] = useState([])
  useEffect(() => {
    async function start() {
      try {
        data = await Promise.all([episodeGetAll(), locationGetAll(), characterGetAll()])
        allEpisodes = data[0]
        allLocations = data[1]
        allCharacters = data[2]
        prepTableData()
        prepGraphdata()
      } catch {

      }
    }
    async function prepTableData() {
      try {
        // console.log('allLocations', allLocations)
        // console.log('allEpisodes', allEpisodes)
        // console.log('characters', allCharacters)
        let earthLocation = allLocations.find(location => location.name === earthVal)
        // console.log('earthLocation', earthLocation.residents)
        residentsIds = earthLocation.residents.map(resident => {
          return resident.substring(resident.lastIndexOf('/') + 1, resident.length).toString()
        })
        // TODO remove await
        earthCharacters = await getCharactersFromIds(residentsIds)
        // console.log('residentsIds', residentsIds)
        // const fromEarth = allCharacters.filter(character => character?.origin?.name === earthVal)
        // console.log('fromEarth', fromEarth)
        charAppearanceInEpisodes = earthCharacters.reduce((acc, character) => {
          const {
            name,
            status,
            species,
            gender,
            image,
            location: { name: characterLocation }
          } = character
          acc[character.id.toString()] = {
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
        // console.log("charAppearanceInEpisodes", charAppearanceInEpisodes)
        charAppearanceInEpisodes = calcCharAppearanceInEpisodes(charAppearanceInEpisodes)

    

        // console.log(charAppearanceInEpisodes)
        let minAppearancesList = []
        for (let id in charAppearanceInEpisodes) {
          minAppearancesList.push({ [id]: charAppearanceInEpisodes[id] })
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
    async function prepGraphdata() {
      graphCharacters = allCharacters.reduce((acc, character) => {
        let characterName = character.name
        if (graphCaracters.includes(characterName)) {
          if (!acc[characterName]) {
            acc[characterName] = { ids: [] }
          }
          acc[characterName].ids.push(character.id)
        }
        return acc
      }, {})
      let characterAppearance = Object.values(graphCharacters).reduce((acc, character) => {
        let appearanceById = character.ids.reduce((acc, id) => {
          acc[id.toString()] = { appearances: 0 }
          return acc
        }, {})
        return { ...acc, ...appearanceById }
      }, [])
      characterAppearance = calcCharAppearanceInEpisodes(characterAppearance)
      // console.log(characterAppearance)
      // console.log(graphCharacters)
      const prepGraphData = []
      for (const [name, {ids}] of Object.entries(graphCharacters)){
        const totalAppearances = ids.reduce((acc, id)=>{
          
          acc += characterAppearance[id.toString()].appearances
          return acc
        },0)
        prepGraphData.push({name, totalAppearances})
      }
      setGraphData(prepGraphData)
      // console.log(graphData )
    }
    function calcCharAppearanceInEpisodes(charAppearanceInEpisodes) {
      return charAppearanceInEpisodes = allEpisodes.reduce((acc, episode) => {
        episode.characters.forEach(character => {
          const characterId = character.substring(character.lastIndexOf('/') + 1, character.length).toString()
          if (charAppearanceInEpisodes.hasOwnProperty(characterId)) {
            charAppearanceInEpisodes[characterId].appearances++
          }
        })
        return acc
      }, charAppearanceInEpisodes)
    }
    start()
  }, [])
  return (
    <div className="App">
      <div><Table card={characterCard} /></div>
      <br />
      <div><Graph data={graphData} /></div>
    </div>
  )
}

export default App
