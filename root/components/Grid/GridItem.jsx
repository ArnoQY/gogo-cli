import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export default class GridItem extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { col, row, align, className: propClass, style, children } = this.props
        return (
            <div
                className={classnames(propClass)}
                style={{
                    gridColumn: col,
                    gridRow: row,
                    alignSelf: align,
                    ...style
                }}>
                {children}
            </div>
        )
    }
}

GridItem.propTypes = {
    col: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    row: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    align: PropTypes.oneOf([
        'auto',
        'stretch',
        'center',
        'flex-start',
        'flex-end',
        'baseline',
        'initial',
        'inherit'
    ]),
    style: PropTypes.object
}

GridItem.defaultProps = {
    col: 'auto',
    row: 'auto',
    align: 'center'
}
