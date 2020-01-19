import axios from 'axios'
import EventEmitter from 'events'

const event = new EventEmitter()

axios.interceptors.response.use(
    response => {
        return response
    },
    function(error) {
        const errorResponse = error.response
        if (errorResponse.status === 403) {
            event.emit('api-error', errorResponse.data)
        }

        if (errorResponse.status === 401) {
            event.emit('unauthorized')
        }

        return Promise.reject(errorResponse)
    }
)

export const onUnauthorized = cb => {
    event.on('unauthorized', cb)
}

export const onAPIError = cb => {
    event.on('api-error', data => cb(data))
}

export const getData = async (url, params) => {
    const token = localStorage.getItem('token')
    return await axios.get(url, {
        responseType: 'json',
        params: {
            ...params,
            token,
        },
    })
}

export const getCurrentUser = async () => {
    const token = localStorage.getItem('token')
    return await axios.get('/getMe', {
        responseType: 'json',
        params: {
            token,
        },
    })
}

export const authorize = async ({ token }) => {
    return await axios.get('/getMe', {
        responseType: 'json',
        params: {
            token,
        },
    })
}

export const post = () => {}
