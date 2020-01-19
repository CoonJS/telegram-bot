import React from 'react'
import { Button } from 'element-react'
import { getCurrentUser } from '../../../services/Api'

export default class LogoutBtn extends React.Component {
    static propTypes = {}

    constructor(props) {
        super(props)

        this.state = {
            isLoading: false,
        }
    }

    logout = async () => {
        localStorage.removeItem('token')
        this.setState({ isLoading: true })
        await getCurrentUser()
        this.setState({ isLoading: false })
    }

    render() {
        const { isLoading } = this.state
        return (
            <div style={styles.wrapper} onClick={this.logout}>
                <Button
                    size="large"
                    type="primary"
                    icon={isLoading ? 'loading' : 'arrow-right'}
                >
                    {isLoading ? '' : 'LOGOUT'}
                </Button>
            </div>
        )
    }
}

const styles = {
    wrapper: {
        cursor: 'pointer',
        padding: '16px',
        display: 'flex',
        justifyContent: 'center',
        color: '#fff',
        alignItems: 'stretch',
        flexDirection: 'column',
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    icon: {
        paddingLeft: '12px',
    },
}
