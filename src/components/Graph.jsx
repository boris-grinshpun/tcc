import './graph.scss'
export default function Graph({ data }) {
    console.log(data)
    const graphHeight = 100
    const maxValue = Math.max(...data.map(row => row.totalAppearances))
    console.log(maxValue)

    console.log(data)
    const xLegend = data.map(row => <div className="x-legend-item" key={row.name}>{row.name}</div>)
    const graphColumns = data.map(row => {
        const columnHeight = Math.floor((row.totalAppearances * graphHeight) / maxValue)
        console.log(columnHeight)
    return (
        <div className="column" key={row.name} style={{ height: columnHeight + 'px'}}>

        </div>
    )
})
return (
    < div >
        <div className="title">Populatiry Graph</div>
        <div className="graph-wrapper" style={{ height: graphHeight + 'px' }}>
            <div className="columns-wrapper">
                {graphColumns}
            </div>
            <div className="x-legend-wrapper">
                {xLegend}
            </div>
        </div>
    </div >
)
}