import './graph.scss'
import { randomColor } from '../../helpers/helper'
export default function Graph({ data }) {
    const graphHeight = 200

    const maxValue = Math.max(...data.map(row => row.totalAppearances))
    const numRecords = data.length
    const portion = numRecords ? Math.ceil(maxValue / numRecords) : 1

    const range = Array.from(Array(numRecords + 1).keys()).map(num => portion * num).sort((a, b) => b - a)

    const yLegend = range.map((num, index) => {
        return (
            <div className="y-legend-item" key={index + '-y-legend'}>
                <div className="y-value">{num}</div>
                <div className="line"></div>
            </div>
        )
    })

    const graphColumns = data ? data.map((row, index) => {
        const columnHeight = Math.floor((row.totalAppearances * graphHeight) / maxValue)
        return (
            <div className='x-legend-wrapper' key={index + row.name}>
                <div className="column"  style={{ height: columnHeight + 'px', backgroundColor: '#' + randomColor() }}>
                </div>
                <div className="x-legend-item">{row.name}</div>
            </div>
        )
    }) : []
    return (
        <div className="wrapper" >
            <div className="title">Populatiry Graph</div>
            <div className="graph" >
                <div className="x-graph-wrapper"  >
                    <div className="columns-wrapper" style={{ height: graphHeight + 'px' }}>
                        {graphColumns}
                    </div>
                </div>
                <div className="y-graph-wrapper" style={{ height: (graphHeight + 30) + 'px' }}>
                    <div className="y-legend-wrapper">
                        {yLegend}
                    </div>
                </div>
            </div>
        </div>
    )
}