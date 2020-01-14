import axios from 'axios'

export const getData = async (url, params) => {
    return await axios.get(url, {
        responseType: 'json',
        params,
    })
}

export const post = () => {}
