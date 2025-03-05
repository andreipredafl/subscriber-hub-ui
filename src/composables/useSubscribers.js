import { ref } from 'vue'
import apiClient from '@/utils/axios'

export default function useSubscribers() {
    const subscribers = ref({
        data: [],
        current_page: 1,
        per_page: 10,
        total: 0,
        last_page: 1,
    })

    const loading = ref(false)
    const error = ref(null)

    const getSubscribers = async (page = 1) => {
        loading.value = true
        error.value = null

        try {
            const response = await apiClient.get('/subscribers', {
                params: { page },
            })

            subscribers.value = response.data
            return response.data
        } catch (err) {
            error.value = err.message || 'Failed to fetch subscribers'
            console.error(error.value)
        } finally {
            loading.value = false
        }

        console.log('subscribers.value', subscribers.value)
    }

    const getSubscriber = async (id) => {
        loading.value = true
        error.value = null

        try {
            const response = await apiClient.get(`/subscribers/${id}`)
            return response.data
        } catch (err) {
            error.value = err.message || 'Failed to fetch subscriber'
            console.error(error.value)
            throw err
        } finally {
            loading.value = false
        }
    }

    const createSubscriber = async (subscriberData) => {
        loading.value = true
        error.value = null

        try {
            const response = await apiClient.post('/subscribers', subscriberData)
            return response.data
        } catch (err) {
            error.value = err.message || 'Failed to create subscriber'
            console.error(error.value)
            throw err
        } finally {
            loading.value = false
        }
    }

    const updateSubscriber = async (id, subscriberData) => {
        loading.value = true
        error.value = null

        try {
            const response = await apiClient.put(`/subscribers/${id}`, subscriberData)
            return response.data
        } catch (err) {
            error.value = err.message || 'Failed to update subscriber'
            console.error(error.value)
            throw err
        } finally {
            loading.value = false
        }
    }

    const deleteSubscriber = async (id) => {
        loading.value = true
        error.value = null

        try {
            await apiClient.delete(`/subscribers/${id}`)

            var index = subscribers.value.data.findIndex((subscriber) => subscriber.id === id)
            if (index !== -1) {
                subscribers.value.data.splice(index, 1)
                subscribers.value.total--
            }

            return true
        } catch (err) {
            error.value = err.message || 'Failed to delete subscriber'
            console.error(error.value)
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        subscribers,
        loading,
        error,
        getSubscribers,
        getSubscriber,
        createSubscriber,
        updateSubscriber,
        deleteSubscriber,
    }
}
