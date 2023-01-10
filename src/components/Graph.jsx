import './graph.scss'
export default function Graph({ data }) {
    const graphHeight = 200

    const maxValue = Math.max(...data.map(row => row.totalAppearances))

    const yMax = 10 - (maxValue % 10) + maxValue
    const numRecords = data.length
    const portion = numRecords ? Math.ceil(yMax / numRecords) : 1

    const range = Array.from(Array(numRecords + 1).keys()).map(num => portion * num).sort((a, b) => b - a)

    const xLegend = data.map((row, index) => {
        return (
            <div className="x-legend-item" key={index + '-x-legend'}>{row.name}</div>
        )
    })

    const yLegend = range.map((num, index) => {
        return (
            <div className="y-legend-item" key={index + '-y-legend'}>
                <div className="y-value">{num}</div>
                <div className="line"></div>
            </div>
        )
    })

    const graphColumns = data ? data.map(row => {
        const columnHeight = Math.floor((row.totalAppearances * graphHeight) / maxValue)
        // console.log(columnHeight)
        return (
            <div className="column" key={row.name} style={{ height: columnHeight + 'px' }}>
            </div>
        )
    }) : []
    return (
        <div className="wrapper" >
            <div className="title">Populatiry Graph</div>
            <div className="graph" >
                <div className="y-graph-wrapper" style={{ height: (graphHeight + 30) + 'px', marginTop: '-30px' }}>
                    <div className="y-legend-wrapper">
                        {yLegend}
                    </div>
                </div>
                <div className="x-graph-wrapper"  >
                    <div className="columns-wrapper" style={{ height: graphHeight + 'px' }}>
                        {graphColumns}
                    </div>
                    <div className="x-legend-wrapper">
                        {xLegend}
                    </div>
                </div>
            </div>
        </div>
    )
}