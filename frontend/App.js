import React from 'react'

import AuthForm from './com/AuthForm'

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
        return <AuthForm />
    }
}
