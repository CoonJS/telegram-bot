import axios from 'axios'
import { Message } from 'element-react'

axios.interceptors.response.use(
    response => {
        return response
    },
    function(error) {
        const errorResponse = error.response
        if (errorResponse.status === 403) {
            Message.error(errorResponse.data.message)
        }
        return Promise.reject(errorResponse)
    }
)

export const getData = async (url, params) => {
    return await axios.get(url, {
        responseType: 'json',
        params,
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

export const post = () => {}
