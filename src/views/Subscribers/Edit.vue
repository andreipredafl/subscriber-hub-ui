<script>
export default {
    name: 'SubscriberEdit',
}
</script>

<script setup>
import {
    NButton,
    NFlex,
    NInput,
    NSelect,
    NCard,
    NH1,
    NText,
    NSpin,
    NFormItem,
    NForm,
    NDivider,
    NSwitch,
    NInputNumber,
    NDatePicker,
} from 'naive-ui'

import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useSubscribers from '@/composables/useSubscribers'
import useFields from '@/composables/useFields'

const router = useRouter()
const route = useRoute()
const subscriberId = parseInt(route.params.id)

const { loading, error, getSubscriber, updateSubscriber } = useSubscribers()
const { fields, loading: fieldsLoading, error: fieldsError, getFields } = useFields()

const formRef = ref(null)
const pageLoading = ref(true)

const fieldValues = reactive({})
const dateValues = reactive({})

const subscriber = reactive({
    id: subscriberId,
    name: '',
    email: '',
    phone: '',
    state: 'unconfirmed',
    created_at: '',
})

const rules = {
    name: [{ required: true, message: 'Please enter a name', trigger: 'blur' }],
    email: [
        { required: true, message: 'Please enter an email', trigger: 'blur' },
        { type: 'email', message: 'Please enter a valid email', trigger: 'blur' },
    ],
    state: [{ required: true, message: 'Please select a status', trigger: 'change' }],
}

const stateOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Unconfirmed', value: 'unconfirmed' },
    { label: 'Unsubscribed', value: 'unsubscribed' },
    { label: 'Bounced', value: 'bounced' },
    { label: 'Junk', value: 'junk' },
]

function parseDate(dateStr) {
    if (!dateStr) return null
    const [year, month, day] = dateStr.split('-').map(Number)
    return new Date(year, month - 1, day, 12, 0, 0)
}

onMounted(async () => {
    try {
        await getFields()
        const data = await getSubscriber(subscriberId)
        Object.assign(subscriber, data)

        if (data.fields && Array.isArray(data.fields)) {
            const fieldTypes = {}

            if (Array.isArray(fields.value)) {
                fields.value.forEach((field) => {
                    if (field && field.id) {
                        fieldTypes[field.id.toString()] = field.type
                    }
                })
            }

            data.fields.forEach((field) => {
                if (
                    field &&
                    field.id !== undefined &&
                    field.pivot &&
                    field.pivot.value !== undefined
                ) {
                    const fieldId = field.id.toString()
                    let value = field.pivot.value
                    const fieldType = fieldTypes[fieldId] || field.type

                    if (fieldType === 'date' && value) {
                        if (!isNaN(Number(value)) && value.length > 10) {
                            const date = new Date(Number(value))
                            value = date.toISOString().split('T')[0]
                        } else if (value.includes('T')) {
                            value = value.split('T')[0]
                        }

                        fieldValues[fieldId] = value
                        dateValues[fieldId] = parseDate(value)
                    } else {
                        fieldValues[fieldId] = value
                    }
                }
            })
        }
    } catch (err) {
        console.error('Failed to fetch data:', err)
    } finally {
        pageLoading.value = false
    }
})

async function handleSubmit(e) {
    e.preventDefault()

    try {
        await formRef.value?.validate()

        const formattedFields = {}

        Object.keys(fieldValues).forEach((fieldId) => {
            const value = fieldValues[fieldId]

            if (value !== undefined && value !== '') {
                const fieldInfo = Array.isArray(fields.value)
                    ? fields.value.find((f) => String(f.id) === String(fieldId))
                    : null

                if (fieldInfo) {
                    formattedFields[fieldId] = {
                        title: fieldInfo.title || 'Field ' + fieldId,
                        type: fieldInfo.type || 'string',
                        value: value,
                    }
                } else {
                    formattedFields[fieldId] = {
                        title: 'Field ' + fieldId,
                        type: 'string',
                        value: value,
                    }
                }
            }
        })

        const subscriberData = {
            name: subscriber.name,
            email: subscriber.email,
            phone: subscriber.phone || '',
            state: subscriber.state,
            fields: formattedFields,
        }

        await updateSubscriber(subscriberId, subscriberData)
        router.push('/subscribers')
    } catch (err) {
        console.error('Validation or submission failed:', err)
    }
}

function getFieldValue(fieldId) {
    const id = String(fieldId)
    return fieldValues[id] || ''
}

function handleFieldValueChange(fieldId, value, fieldType) {
    const id = String(fieldId)

    if (fieldType === 'date' && value) {
        if (value instanceof Date) {
            const year = value.getFullYear()
            const month = String(value.getMonth() + 1).padStart(2, '0')
            const day = String(value.getDate()).padStart(2, '0')
            fieldValues[id] = `${year}-${month}-${day}`
            dateValues[id] = value
        } else {
            fieldValues[id] = value
        }
    } else {
        fieldValues[id] = value
    }
}
</script>

<template>
    <n-card>
        <n-flex justify="space-between" align="center">
            <n-h1>Edit Subscriber</n-h1>
        </n-flex>

        <n-text v-if="error" type="error">{{ error }}</n-text>
        <n-text v-if="fieldsError" type="error">{{ fieldsError.message }}</n-text>

        <n-spin v-if="pageLoading || loading || fieldsLoading" />

        <n-form
            v-else
            ref="formRef"
            :model="subscriber"
            :rules="rules"
            label-placement="left"
            label-width="100px"
            require-mark-placement="right-hanging"
        >
            <n-form-item label="Name" path="name">
                <n-input v-model:value="subscriber.name" placeholder="Enter name" />
            </n-form-item>

            <n-form-item label="Email" path="email">
                <n-input v-model:value="subscriber.email" placeholder="Enter email" />
            </n-form-item>

            <n-form-item label="Status" path="state">
                <n-select v-model:value="subscriber.state" :options="stateOptions" />
            </n-form-item>

            <n-divider v-if="fields && fields.length > 0">Custom Fields</n-divider>

            <template v-if="fields && fields.length > 0">
                <n-form-item v-for="field in fields" :key="field.id" :label="field.title">
                    <n-switch
                        v-if="field.type === 'boolean'"
                        :value="getFieldValue(field.id) === 'true'"
                        @update:value="
                            (val) => handleFieldValueChange(field.id, val.toString(), 'boolean')
                        "
                    />

                    <n-input-number
                        v-else-if="field.type === 'number'"
                        :value="getFieldValue(field.id) ? Number(getFieldValue(field.id)) : null"
                        @update:value="(val) => handleFieldValueChange(field.id, val, 'number')"
                        placeholder="Enter value"
                    />

                    <n-date-picker
                        v-else-if="field.type === 'date'"
                        :value="dateValues[field.id]"
                        @update:value="(val) => handleFieldValueChange(field.id, val, 'date')"
                        type="date"
                        placeholder="Select date"
                        clearable
                    />

                    <n-input
                        v-else-if="field.type === 'string' || field.type === undefined"
                        :value="getFieldValue(field.id)"
                        @update:value="(val) => handleFieldValueChange(field.id, val, 'string')"
                        placeholder="Enter value"
                    />

                    <n-input
                        v-else-if="field.type === 'link'"
                        :value="getFieldValue(field.id)"
                        @update:value="(val) => handleFieldValueChange(field.id, val, 'link')"
                        placeholder="Enter URL"
                    />
                </n-form-item>
            </template>
            <template v-else>
                <n-text type="info">Nu există câmpuri personalizate disponibile.</n-text>
            </template>

            <n-flex justify="end" :wrap="false" style="gap: 12px; margin-top: 24px">
                <n-button type="primary" @click="handleSubmit" :loading="loading">Update</n-button>
            </n-flex>
        </n-form>
    </n-card>
</template>
