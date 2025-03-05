<script>
export default {
    name: 'SubscribersIndex',
}
</script>

<script setup>
import { NButton, NFlex, NCard, NH1, NText, NSpin } from 'naive-ui'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import TableComponent from '@/components/Ui/Table.vue'
import useSubscribers from '@/composables/useSubscribers'

const router = useRouter()
const { subscribers, loading, error, getSubscribers, deleteSubscriber } = useSubscribers()

const tableColumns = [
    { title: 'Name', key: 'name' },
    { title: 'Email', key: 'email' },
    { title: 'State', key: 'state' },
]

onMounted(() => {
    getSubscribers(1)
})

function handlePageChange(page) {
    getSubscribers(page)
}

function handleDelete(row) {
    if (confirm(`Are you sure you want to delete the subscriber "${row.name}"?`)) {
        deleteSubscriber(row.id)
    }
}
</script>

<template>
    <n-card>
        <n-flex justify="space-between" align="center">
            <n-h1>Subscribers</n-h1>
            <n-button type="primary" @click="router.push('/subscribers/create')">
                Create Subscriber
            </n-button>
        </n-flex>

        <n-text v-if="error" type="error">{{ error }}</n-text>

        <n-spin v-if="loading" />

        <table-component
            v-else
            :columns="tableColumns"
            :data="subscribers"
            :pagination="true"
            @page-change="handlePageChange"
        >
            <template #actions="{ row }">
                <n-flex>
                    <n-button
                        type="info"
                        text
                        size="small"
                        @click="router.push(`/subscribers/${row.id}`)"
                    >
                        View
                    </n-button>
                    <n-button
                        type="primary"
                        text
                        size="small"
                        @click="router.push(`/subscribers/${row.id}/edit`)"
                    >
                        Edit
                    </n-button>
                    <n-button type="error" text size="small" @click="handleDelete(row)">
                        Delete
                    </n-button>
                </n-flex>
            </template>
        </table-component>
    </n-card>
</template>
