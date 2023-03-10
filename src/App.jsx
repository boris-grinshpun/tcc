import { useState, useEffect } from 'react'
import './App.scss'
import Graph from './components/graph/Graph'
import Table from './components/table/Table'
import { characterGetAll, locationGetAll, getLocation, episodeGetAll, getCharactersFromIds } from './api/api'
import {calcCharAppearanceInEpisodes, sortByKey, earthVal, graphCharacters} from './helpers/helper'

function App() {
  let allCharacters,
      allEpisodes,
      allLocations,
      earthCharacters,
      charAppearanceInEpisodes,
      residentsIds,
      data

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
        prepGraphData()
      } catch (err) {
      }
    }
    async function prepTableData() {
      try {
        let earthLocation = allLocations.find(location => location.name === earthVal)
        residentsIds = earthLocation.residents.map(resident => {
          return resident.substring(resident.lastIndexOf('/') + 1, resident.length).toString()
        })
        earthCharacters = await getCharactersFromIds(residentsIds)
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
            dimension: null,
            status,
            species,
            gender,
            image
          }
          return acc
        }, {})
        charAppearanceInEpisodes = calcCharAppearanceInEpisodes(charAppearanceInEpisodes, allEpisodes)
        let minAppearancesList = []
        for (let id in charAppearanceInEpisodes) {
          minAppearancesList.push({ [id]: charAppearanceInEpisodes[id] })
        }
        minAppearancesList.sort(sortByKey('appearances'))
        const minAppearances = Object.values(minAppearancesList[0])[0].appearances
        const allMinAppearances = minAppearancesList.filter(item => Object.values(item)[0].appearances === minAppearances)
        allMinAppearances.sort(sortByKey('name'))
        let [characterId, characterCardInit] = Object.entries(allMinAppearances[0])[0]
        getLocation(characterId)
          .then(data => {
            characterCardInit.dimension = data.dimension
            setCharacterCard(characterCardInit)
          })
      } catch (err) {
      }
    }
    async function prepGraphData() {
      let graphCharactersData = allCharacters.reduce((acc, character) => {
        let characterName = character.name
        if (graphCharacters.includes(characterName)) {
          if (!acc[characterName]) {
            acc[characterName] = { ids: [] }
          }
          acc[characterName].ids.push(character.id)
        }
        return acc
      }, {})
      let characterAppearance = Object.values(graphCharactersData).reduce((acc, character) => {
        let appearanceById = character.ids.reduce((acc, id) => {
          acc[id.toString()] = { appearances: 0 }
          return acc
        }, {})
        return { ...acc, ...appearanceById }
      }, [])
      characterAppearance = calcCharAppearanceInEpisodes(characterAppearance, allEpisodes)
      const prepGraphData = []
      for (const [name, {ids}] of Object.entries(graphCharactersData)){
        const totalAppearances = ids.reduce((acc, id)=>{
          
          acc += characterAppearance[id.toString()].appearances
          return acc
        },0)
        prepGraphData.push({name, totalAppearances})
      }
      setGraphData(prepGraphData)
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
