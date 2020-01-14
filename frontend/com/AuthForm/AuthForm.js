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
        const { token } = this.state
        return (
            <div style={styles.root}>
                <div style={styles.wrapper}>
                    <Input
                        type="password"
                        value={token}
                        autoComplete
                        autoFocus
                        size="large"
                        placeholder="Your bot token to authorize"
                        onChange={this.handleChange}
                    />
                    <Button
                        type="primary"
                        onClick={this.handleClick}
                        style={{ marginTop: '16px', height: '60px' }}
                    >
                        Authorize
                    </Button>
                </div>
            </div>
        )
    }
}

const styles = {
    root: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '300px',
        padding: '0 16px',
        header: {
            padding: '32px 0',
            display: 'flex',
            justifyContent: 'center',
        },
    },
    wrapper: { display: 'flex', flexDirection: 'column', minWidth: '320px' },
}
