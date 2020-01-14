import React from 'react'

import { Button, Input, Form } from 'element-react'

import { getData } from '../../../services/Api'

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

    handleChange = token => {
        this.setState({
            token,
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
        const { data, token } = this.state
        return (
            <div>
                <Input
                    type="text"
                    value={token}
                    placeholder="Your bot token to authorize"
                    onChange={this.handleChange}
                />
                <Button type="primary" onClick={this.handleClick}>
                    Authorize
                </Button>
            </div>
        )
    }
}
