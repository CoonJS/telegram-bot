import React from 'react'

import styles from './Loader.less'

export default class Loader extends React.Component {
    static propTypes = {}

    render() {
        return (
            <div className={styles.ldsRing}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        )
    }
}
