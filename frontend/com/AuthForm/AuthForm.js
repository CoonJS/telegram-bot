import React from 'react'

import { Button, Input, Message } from 'element-react'

import { authorize, getCurrentUser, getData } from '../../../services/Api'

export default class App extends React.Component {
    static propTypes = {}

    constructor(props) {
        super(props)

        this.state = {
            token: null,
            data: null,
            isAuthorizing: false,
        }
    }

    handleChange = token => {
        this.setState({
            token,
        })
    }

    handleKeyDown = e => {
        const hasEnterPressed = e.keyCode === 13

        if (!hasEnterPressed) {
            return
        }

        this.authorize()
    }

    authorize = async () => {
        const { token } = this.state

        this.setState({ isAuthorizing: true })
        try {
            const { data } = await authorize({ token })
            if (data.error_code === 404) {
                console.log(data, 'data')
                Message.error(data.description)
            }

            this.props.onAuthorize({
                data,
                token,
            })
        } catch (e) {
            this.props.onAuthorize({ data: { error_code: 404 } })
        } finally {
            this.setState({ isAuthorizing: false })
        }
    }

    render() {
        const { token, isAuthorizing } = this.state
        return (
            <div style={styles.root}>
                <div style={styles.wrapper}>
                    <Input
                        value={token}
                        autoFocus
                        size="large"
                        type="password"
                        autoComplete="on"
                        placeholder="Your bot token to authorize"
                        disabled={isAuthorizing}
                        onKeyDown={this.handleKeyDown}
                        onChange={this.handleChange}
                    />
                    <Button
                        type="primary"
                        onClick={this.authorize}
                        loading={isAuthorizing}
                        style={{
                            marginTop: '16px',
                            height: '60px',
                            fontSize: '16px',
                        }}
                    >
                        <strong>{isAuthorizing ? '' : 'AUTHORIZE'}</strong>
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
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: '320px',
        padding: '24px 12px',
        background:
            'radial-gradient(circle, rgb(11, 102, 155) 0%, rgb(176, 197, 212) 100%)',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
    },
}
