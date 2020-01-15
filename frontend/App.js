import React from 'react'

import AuthForm from './com/AuthForm'

import { getCurrentUser } from '../services/Api'

export default class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            data: null,
            isAuthorized: null,
        }
    }

    componentDidMount() {
        this.loadUser()
    }

    loadUser = async () => {
        const { data } = await getCurrentUser()

        this.setState({ isAuthorized: data.ok === true, data })
    }

    handleAuthorize = ({ data, token }) => {
        if (data.error_code === 404) {
            return
        }
        this.setState({ data, isAuthorized: true }, () => {
            localStorage.setItem('token', token)
        })
    }

    render() {
        const { isAuthorized, data } = this.state
        return (
            <div>
                {isAuthorized === true && (
                    <h1 style={{ color: '#fff', marginBottom: '200px' }}>
                        {data.result.first_name}
                    </h1>
                )}
                {isAuthorized === false && (
                    <AuthForm onAuthorize={this.handleAuthorize} />
                )}
            </div>
        )
    }
}
