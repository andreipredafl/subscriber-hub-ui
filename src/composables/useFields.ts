import { ref } from 'vue'
import apiClient from '@/utils/axios'
import { Field, PaginatedResponse } from '@/utils/interfaces'

export default function useFields() {
    const fields = ref<PaginatedResponse>({
        data: [],
        current_page: 1,
        per_page: 10,
        total: 0,
        last_page: 1,
    })

    const loading = ref(false)
    const error = ref<string | null>(null)

    const getFields = async (page = 1) => {
        loading.value = true
        error.value = null

        try {
            const response = await apiClient.get<PaginatedResponse>('/fields', {
                params: { page },
            })

            fields.value = response.data
            return response.data
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch fields'
            console.error(error.value)
        } finally {
            loading.value = false
        }
    }

    const createField = async (fieldData: Omit<Field, 'id'>) => {
        loading.value = true
        error.value = null

        try {
            const response = await apiClient.post<Field>('/fields', fieldData)

            const newField = response.data
            fields.value.data.unshift(newField)
            fields.value.total++

            return newField
        } catch (err: any) {
            error.value = err.message || 'Failed to create field'
            console.error(error.value)
            throw err
        } finally {
            loading.value = false
        }
    }

    const updateField = async (id: number, fieldData: Partial<Field>) => {
        loading.value = true
        error.value = null

        try {
            const response = await apiClient.put<Field>(`/fields/${id}`, fieldData)

            const updatedField = response.data
            const index = fields.value.data.findIndex((field) => field.id === id)

            if (index !== -1) {
                fields.value.data[index] = updatedField
            }

            return updatedField
        } catch (err: any) {
            error.value = err.message || 'Failed to update field'
            console.error(error.value)
            throw err
        } finally {
            loading.value = false
        }
    }

    const deleteField = async (id: number) => {
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
        } catch (err: any) {
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
