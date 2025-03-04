<script setup lang="ts">
import { NButton, NFlex, NInput, NSelect, NCard, NH1, NText, NSpin } from 'naive-ui'
import { ref, reactive, onMounted } from 'vue'
import TableComponent from '../components/TableComponent.vue'
import ModalComponent from '../components/ModalComponent.vue'
import useFields from '../composables/useFields'

const { fields, loading, error, getFields, createField, updateField, deleteField } = useFields()

const tableColumns = [
    { title: 'Title', key: 'title' },
    { title: 'Type', key: 'type' },
]

const types = [
    { label: 'Date', value: 'date' },
    { label: 'Number', value: 'number' },
    { label: 'String', value: 'string' },
    { label: 'Boolean', value: 'boolean' },
    { label: 'Link', value: 'link' },
]

const showCreateModal = ref(false)
const showEditModal = ref(false)

const newField = reactive({
    title: '',
    type: 'string',
})

const editField = reactive({
    id: 0,
    title: '',
    type: 'string',
})

onMounted(() => {
    getFields(1)
})

function handlePageChange(page) {
    getFields(page)
}

function openCreateModal() {
    Object.assign(newField, { title: '', type: 'string' })
    showCreateModal.value = true
}

function handleEdit(row) {
    Object.assign(editField, row)
    showEditModal.value = true
}

function handleDelete(row) {
    if (confirm(`Are you sure you want to delete the field "${row.title}"?`)) {
        deleteField(row.id)
    }
}

function handleCreateSubmit() {
    createField(newField)
        .then(() => {
            showCreateModal.value = false
        })
        .catch((err) => {
            console.error('Create failed:', err)
        })
}

function handleEditSubmit() {
    if (editField.id) {
        updateField(editField.id, {
            title: editField.title,
            type: editField.type,
        })
            .then(() => {
                showEditModal.value = false
            })
            .catch((err) => {
                console.error('Update failed:', err)
            })
    }
}
</script>

<template>
    <n-card>
        <n-flex justify="space-between" align="center">
            <n-h1>Fields</n-h1>
            <n-button type="primary" @click="openCreateModal">Create Field</n-button>
        </n-flex>

        <n-text v-if="error" type="error">{{ error }}</n-text>

        <n-spin v-if="loading" />

        <table-component
            v-else
            :columns="tableColumns"
            :data="fields"
            :pagination="true"
            @page-change="handlePageChange"
            @edit="handleEdit"
            @delete="handleDelete"
        >
            <template #actions="{ row }">
                <n-flex>
                    <n-button type="primary" text size="small" @click="handleEdit(row)">
                        Edit
                    </n-button>
                    <n-button type="error" text size="small" @click="handleDelete(row)">
                        Delete
                    </n-button>
                </n-flex>
            </template>
        </table-component>

        <!-- Create Modal -->
        <modal-component
            v-model:show="showCreateModal"
            title="Create Field"
            @submit="handleCreateSubmit"
        >
            <div style="margin-bottom: 16px">
                <n-text>Title</n-text>
                <n-input v-model:value="newField.title" />
            </div>
            <div>
                <n-text>Type</n-text>
                <n-select v-model:value="newField.type" :options="types" />
            </div>
        </modal-component>

        <!-- Edit Modal -->
        <modal-component v-model:show="showEditModal" title="Edit Field" @submit="handleEditSubmit">
            <div style="margin-bottom: 16px">
                <n-text>Title</n-text>
                <n-input v-model:value="editField.title" />
            </div>
            <div>
                <n-text>Type</n-text>
                <n-select v-model:value="editField.type" :options="types" />
            </div>
        </modal-component>
    </n-card>
</template>
