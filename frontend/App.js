import React from 'react'

import { getData } from '../services/Api'

export default class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            token: null,
            data: null,
        }
    }

    handleClick = () => {
        this.authorize()
    }

    handleChange = e => {
        this.setState({
            token: e.target.value,
        })
    }

    authorize = async () => {
        const { token } = this.state
        const { data } = await getData('/getMe', { token })

        this.setState({
            data,
        })
    }

    render() {
        const { data } = this.state
        return (
            <div>
                <input
                    type="text"
                    placeholder="Your bot token to authorize"
                    onChange={this.handleChange}
                />
                <button onClick={this.handleClick}>Authorize</button>
                <pre>{data ? JSON.stringify(data) : ''}</pre>
            </div>
        )
    }
}
