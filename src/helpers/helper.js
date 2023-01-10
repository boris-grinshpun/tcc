export function calcCharAppearanceInEpisodes(charAppearanceInEpisodes, allEpisodes) {
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

  export function randomColor(){
    return  Math.floor(Math.random()*16777215).toString(16);
  }

  export function sortByKey(key){
    return (a, b) => Object.values(a)[0][key] > Object.values(b)[0][key] ? 1 : -1
  }


  export const earthVal = "Earth (C-137)"
  export const graphCharacters = ["Abradolf Lincler", "Arcade Alien", "Morty Smith", "Birdperson", "Mr. Meeseeks"]