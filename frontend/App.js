import React from 'react'

import AuthForm from './com/AuthForm'

import { getCurrentUser, getData } from '../services/Api'

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
        this.loadUser()
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
    }

    handleAuthorize = ({ data, token }) => {
        if (data.error_code === 404) {
            return
        }
        this.setState({ data, isAuthorized: true }, () => {
            localStorage.setItem('token', token)
        })

        this.loadProfilePhoto()
    }

    render() {
        const { isAuthorized, data, profileImageUrl } = this.state
        return (
            <div>
                <div style={styles.imageWrap}>
                    {profileImageUrl && (
                        <img src={profileImageUrl} alt="user_image" />
                    )}
                </div>

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

const styles = {
    imageWrap: {
        display: 'flex',
        padding: '12px 0',
        flexDirection: 'column',
        alignItems: 'center',
    },
}
