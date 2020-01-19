import React from 'react'
import { Message } from 'element-react'

import Loader from './com/Loader'
import AuthForm from './com/AuthForm'
import LogoutBtn from './com/LogoutBtn'

import {
    getCurrentUser,
    getData,
    onUnauthorized,
    onAPIError,
} from '../services/Api'

export default class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            data: null,
            isAuthorized: null,
            profileImageUrl: null,
        }
    }

    componentDidMount() {
        const { isAuthorized } = this.state

        this.loadUser()

        onUnauthorized(() => {
            console.log('unauth')
            if (isAuthorized) {
                Message.error('Unauthorized')
            }
            this.setState({ isAuthorized: false })
        })

        onAPIError(({ message }) => {
            console.log('API ERR', message)
            this.setState({ isAuthorized: false })
            Message.error(message)
        })
    }

    loadUser = async () => {
        const { data } = await getCurrentUser()
        const success = data.ok === true

        this.setState({ isAuthorized: success, data })

        if (success) {
            this.loadProfilePhoto({ user_id: data.result.id })
        }
    }

    loadProfilePhoto = async ({ user_id }) => {
        const { data } = await getData('/getUserProfilePhoto', { user_id })
        this.setState({ profileImageUrl: data.file })

        this.loadBotInfo({ user_id })
    }

    loadBotInfo = async ({ user_id }) => {
        await getData('/getBotInfo', { user_id })
    }

    handleAuthorize = ({ data, token }) => {
        if (data.status === 403 || data.status === 401) {
            Message.error(data.data.message)
            return
        }

        if (data.error_code === 404) {
            Message.error('Bot not found')
            return
        }

        this.setState({ data, isAuthorized: true }, () => {
            localStorage.setItem('token', token)
        })

        this.loadProfilePhoto({ user_id: data.result.id })
    }

    render() {
        const { isAuthorized, data, profileImageUrl } = this.state
        return (
            <div>
                {isAuthorized === true && (
                    <div style={styles.imageWrap}>
                        {profileImageUrl && (
                            <img src={profileImageUrl} alt="user_image" />
                        )}
                    </div>
                )}

                {isAuthorized === null && <Loader />}
                {isAuthorized === true && (
                    <h1 style={{ color: '#fff', marginBottom: '200px' }}>
                        {data.result.first_name}
                    </h1>
                )}
                {isAuthorized === true && (
                    <div style={styles.logoutButtonWrapper}>
                        <LogoutBtn />
                    </div>
                )}
                {isAuthorized === false && (
                    <AuthForm onAuthorize={this.handleAuthorize} />
                )}
            </div>
        )
    }
}

const styles = {
    imageWrap: {
        display: 'flex',
        padding: '12px 0',
        flexDirection: 'column',
        alignItems: 'center',
    },
    logoutButtonWrapper: {
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '100%',
    },
}
