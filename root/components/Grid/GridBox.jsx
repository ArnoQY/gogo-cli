import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export default class GridBox extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const {
            colTemp,
            rowTemp,
            colGap,
            rowGap,
            colAuto,
            autoFlow,
            children,
            className: propClass,
            id,
            onClick
        } = this.props
        return (
            <div
                className={classnames('grid-box', propClass)}
                id={id}
                onClick={onClick}
                style={{
                    gridTemplateColumns: colTemp
                        .map(item => (typeof item === 'number' ? item + 'px' : item))
                        .join(' '),
                    gridTemplateRows: rowTemp
                        .map(item => (typeof item === 'number' ? item + 'px' : item))
                        .join(' '),
                    gridColumnGap: colGap + 'px',
                    gridRowGap: rowGap + 'px',
                    gridAutoFlow: autoFlow,
                    gridAutoColumns: colAuto + 'px'
                }}>
                {children}
            </div>
        )
    }
}

GridBox.propTypes = {
    colTemp: PropTypes.array,
    rowTemp: PropTypes.array,
    colGap: PropTypes.number,
    rowGap: PropTypes.number,
    colAuto: PropTypes.number,
    autoFlow: PropTypes.oneOf(['column', 'row', 'none']),
    onClick: PropTypes.func
}

GridBox.defaultProps = {
    colTemp: [],
    rowTemp: [],
    colGap: 10,
    rowGap: 10,
    colAuto: 140,
    autoFlow: 'column',
    onClick: () => { }
}
