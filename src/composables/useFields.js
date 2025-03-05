import { ref } from 'vue'
import apiClient from '@/utils/axios'

export default function useFields() {
    const loading = ref(false)
    const error = ref(null)

    const fields = ref({
        data: [],
        current_page: 1,
        per_page: 10,
        total: 0,
        last_page: 1,
    })

    const getFields = async (page = null) => {
        loading.value = true
        error.value = null

        try {
            const response = await apiClient.get('/fields', {
                ...(page ? { params: { page, per_page: 10 } } : {}),
            })

            fields.value = response.data

            console.log(response.data)
            return response.data
        } catch (err) {
            error.value = err.message || 'Failed to fetch fields'
            console.error(error.value)
        } finally {
            loading.value = false
        }
    }

    const createField = async (fieldData) => {
        loading.value = true
        error.value = null

        try {
            const response = await apiClient.post('/fields', fieldData)

            const newField = response.data
            fields.value.data.unshift(newField)
            fields.value.total++

            return newField
        } catch (err) {
            error.value = err.message || 'Failed to create field'
            console.error(error.value)
            throw err
        } finally {
            loading.value = false
        }
    }

    const updateField = async (id, fieldData) => {
        loading.value = true
        error.value = null

        try {
            const response = await apiClient.put(`/fields/${id}`, fieldData)

            const updatedField = response.data
            const index = fields.value.data.findIndex((field) => field.id === id)

            if (index !== -1) {
                fields.value.data[index] = updatedField
            }

            return updatedField
        } catch (err) {
            error.value = err.message || 'Failed to update field'
            console.error(error.value)
            throw err
        } finally {
            loading.value = false
        }
    }

    const deleteField = async (id) => {
        loading.value = true
        error.value = null

        try {
            await apiClient.delete(`/fields/${id}`)

            const index = fields.value.data.findIndex((field) => field.id === id)

            if (index !== -1) {
                fields.value.data.splice(index, 1)
                fields.value.total--
            }

            return true
        } catch (err) {
            error.value = err.message || 'Failed to delete field'
            console.error(error.value)
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        fields,
        loading,
        error,
        getFields,
        createField,
        updateField,
        deleteField,
    }
}
