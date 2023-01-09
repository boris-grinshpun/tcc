const CHARACTER_API_URL = 'https://rickandmortyapi.com/api/character'
const LOCATION_API_URL = 'https://rickandmortyapi.com/api/location'
const EPISODE_API_URL = 'https://rickandmortyapi.com/api/episode'
const apiResultsPerPage = 20

export function characterGetAll() {
    return fetchAll(CHARACTER_API_URL)
}
export function locationGetAll() {
    return fetchAll(LOCATION_API_URL)
}
export function getLocation(id) {
    return fetch(`${LOCATION_API_URL}/${id}`).then(data=> data.json())
}
export function episodeGetAll() {
    return fetchAll(EPISODE_API_URL)
}

export function getCharactersFromList(list = null){
    return fetch(`${CHARACTER_API_URL}/${list.join(",")}`).then(data=>data.json())
}

function fetchAll(url) {
    return fetch(url)
        .then(data => data.json())
        .then(data => {
            const firstPage = data
            const totalPages = data.info.pages
            const ids = (totalPages - 1) * apiResultsPerPage
            const idList = []
            const from = apiResultsPerPage + 1
            for (let id = from; id <= ids; id++) {
                idList.push(id)
            }
            const fetchByIds = fetch(`${url}/${idList.join(",")}`)
            const lastPage = fetch(`${url}/?page=${totalPages}`)
            return Promise.all([fetchByIds, lastPage])
                .then(responses => {
                    return Promise.all(responses.map(res => res.json()))
                        .then(data => [...firstPage.results, ...data[0], ...data[1].results])
                })
        })

}

