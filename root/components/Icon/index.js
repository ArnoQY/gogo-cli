import React from 'react'
import PropTypes from 'prop-types'

import './style.less'

const GOGO_ICON = window.GOGO_ICON.default

class Icon extends React.Component {
    static propTypes = {
        type: PropTypes.string,
        size: PropTypes.number,
        color: PropTypes.string,
    }

    static defaultProps = {
        size: 14,
        color: 'currentColor',
    }

    static getDerivedStateFromProps(props, state) {
        return { icon: GOGO_ICON && GOGO_ICON[props.type] }
    }

    state = {
        icon: GOGO_ICON && GOGO_ICON[this.props.type],
    }

    render() {
        const { icon } = this.state
        const { type, size, color } = this.props
        if (!icon) {
            console.error(`icon ${type}获取失败，请检查icon是否存在，并引入前置依赖icon.bundle.js`)
        }
        return (
            <span className="gogo-icon-container icon-container">
                <svg
                    id={`gogoIcon-usage-${type}`}
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    className={`gogo-icon gogoIcon-${type}`}
                    viewBox={icon && icon.viewBox}
                    style={{
                        fill: color,
                        width: size + 'px',
                    }}>
                    <use xlinkHref={`#${icon && icon.id}`} />
                </svg>
            </span>
        )
    }
}

export default Icon
