const CHARACHTER_API_URL = 'https://rickandmortyapi.com/api/character'
const LOCATION_API_URL = 'https://rickandmortyapi.com/api/location'
const EPISODE_API_URL = 'https://rickandmortyapi.com/api/location'
export function locationApi(params = []) {

}
export function charachterGetAll() {
    return fetchAll(CHARACHTER_API_URL)
}
export function locationGetAll(params = []) {
    return fetchAll(LOCATION_API_URL)

}
export function episodeGetAll(params = []) {
    return fetchAll(EPISODE_API_URL)
}
    function fetchAll(url){
        return fetch(url)
            .then(data => data.json())
            .then(data => {
                const firstPage = data
                const pages = data.info.pages
                const allPages = []
                for (let page = 2; page <= pages; page++) {
                    allPages.push(`${url}/?page${page}`)
                }
                const promisses = allPages.map(page => {
                    return fetch(page)
                })
                return Promise.all(promisses)
                    .then(responses =>
                        Promise.all(responses.map(res => res.json()))
                        .then(data=>[firstPage, ...data])
                    )
            })
    
    }