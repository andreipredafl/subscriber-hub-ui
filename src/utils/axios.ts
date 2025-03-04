import axios, { AxiosResponse, AxiosError } from 'axios'

const apiClient = axios.create({
    baseURL: process.env.VUE_APP_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})

apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response && error.response.status === 422) {
            console.error('Validation error:', error.response.data)
            return Promise.reject(error.response.data)
        }

        console.error('API Error:', error.response ? error.response.status : 'Network Error')
        return Promise.reject(error)
    }
)

export default apiClient
