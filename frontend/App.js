import React from 'react'

import AuthForm from './com/AuthForm'

export default class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isAuthorized: false,
            data: null,
        }
    }

    handleAuthorize = ({ data }) => {
        if (data.error_code === 404) {
            return
        }
        this.setState({ data, isAuthorized: true })
    }

    render() {
        const { isAuthorized, data } = this.state
        return (
            <div>
                {isAuthorized ? (
                    <h1 style={{ color: '#fff', marginBottom: '200px' }}>
                        {data.result.first_name}
                    </h1>
                ) : (
                    <AuthForm onAuthorize={this.handleAuthorize} />
                )}
            </div>
        )
    }
}
