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
            <Form>
                <Form.Item>
                    <Input
                        type="text"
                        placeholder="Your bot token to authorize"
                        onChange={this.handleChange}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={this.handleClick}>
                        Authorize
                    </Button>
                </Form.Item>
            </Form>
        )
    }
}
