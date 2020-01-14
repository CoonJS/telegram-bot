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
        console.log(data)
        this.setState({ data, isAuthorized: true })
    }

    render() {
        const { isAuthorized, data } = this.state
        return (
            <div>
                {isAuthorized ? (
                    <div>{JSON.stringify(data)}</div>
                ) : (
                    <AuthForm onAuthorize={this.handleAuthorize} />
                )}
            </div>
        )
    }
}
