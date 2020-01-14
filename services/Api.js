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
    axios
        .get(url, {
            responseType: 'json',
            params,
        })
        .then(response => {
            // console.log(response, 'response')
            return response
        })
        .catch(error => {
            // console.log(error)
            return new Error()
        })
}

export const post = () => {}
