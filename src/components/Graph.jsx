import './graph.scss'
export default function Graph({ data }) {
    console.log
    const graphHeight = 250
    const maxValue = Math.max(...data.map(row => row.totalAppearances))
    const yMax = 10 - (maxValue % 10) + maxValue
    const portion = Math.ceil(yMax/data.length)
    const range =  Array.from(Array(data.length).keys()).map(num => portion * num).sort().reverse()
    console.log(data)
    const xLegend = data.map(row => <div className="x-legend-item" key={row.name}>{row.name}</div>)
    const yLegend = range.map(num => <div className="y-legend-item" key={num + '-y-legend'}>{num }</div>)
    const graphColumns = data.map(row => {
        const columnHeight = Math.floor((row.totalAppearances * graphHeight) / maxValue)
        console.log(columnHeight)
        return (
            <div className="column" key={row.name} style={{ height: columnHeight + 'px' }}>

            </div>
        )
    })
    return (
        <div class="wrapper" >
            <div className="title">Populatiry Graph</div>
            <div className="y-graph-wrapper">
                <div className="y-legend-wrapper">
                    {yLegend}
                </div>
                <div className="x-graph-wrapper" style={{ height: graphHeight + 'px' }}>
                    <div className="columns-wrapper">
                        {graphColumns}
                    </div>
                    <div className="x-legend-wrapper">
                        {xLegend}
                    </div>
                </div>
            </div>
        </div >
    )
}