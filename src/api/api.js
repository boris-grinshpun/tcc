const CHARACHTER_API_URL = 'https://rickandmortyapi.com/api/character'
const LOCATION_API_URL = 'https://rickandmortyapi.com/api/location'
const EPISODE_API_URL = 'https://rickandmortyapi.com/api/episode'
const apiResultsPerPage = 20

export function charachterGetAll() {
    return fetchAll(CHARACHTER_API_URL)
}
export function locationGetAll(params = []) {
    return fetchAll(LOCATION_API_URL)
}
export function episodeGetAll(params = []) {
    return fetchAll(EPISODE_API_URL)
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
                        .then(data => [firstPage.results, ...data[0], data[1]])
                })
        })

}
// function fetchAll(url) {
//     return fetch(url)
//         .then(data => data.json())
//         .then(data => {
//             const firstPage = data
//             const pages = data.info.pages
//             const allPages = []
//             for (let page = 2; page <= pages; page++) {
//                 allPages.push(`${url}/?page=${page}`)
//             }
//             const promisses = allPages.map(page => {
//                 return fetch(page)
//             })
//             return Promise.all(promisses)
//                 .then(responses =>
//                     Promise.all(responses.map(res => res.json()))
//                         .then(data => [firstPage, ...data])
//                 )
//         })

// }