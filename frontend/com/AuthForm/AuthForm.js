import React from 'react'

import { Button, Input, Message } from 'element-react'

import { getData } from '../../../services/Api'

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

        this.setState({ isAuthorizing: true })
        try {
            const { data } = await getData('/getMe', { token })
            if (data.error_code === 404) {
                Message.error(data.description)
            }

            this.props.onAuthorize({
                data,
            })
        } catch (e) {
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
                        onChange={this.handleChange}
                    />
                    <Button
                        type="primary"
                        onClick={this.handleClick}
                        loading={isAuthorizing}
                        style={{
                            marginTop: '16px',
                            height: '60px',
                            fontSize: '16px',
                        }}
                    >
                        <strong>Authorize</strong>
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
            'radial-gradient(circle, rgb(5, 24, 35) 0%, rgb(226, 208, 208) 100%)',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
    },
}
