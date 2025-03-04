<script setup lang="ts">
import { NModal, NCard, NButton, NSpace } from 'naive-ui'
import { computed, defineEmits, defineProps } from 'vue'

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: 'Modal',
    },
})

const emit = defineEmits(['update:show', 'submit', 'cancel'])

const modalVisible = computed({
    get: () => props.show,
    set: (value) => emit('update:show', value),
})

function handleClose() {
    emit('update:show', false)
    emit('cancel')
}

function handleSubmit() {
    emit('submit')
}
</script>

<template>
    <n-modal v-model:show="modalVisible" :mask-closable="false" preset="card" class="modal">
        <n-card :title="props.title" :bordered="false" size="small" role="dialog" aria-modal="true">
            <div class="modal-body">
                <slot></slot>
            </div>

            <template #footer>
                <n-space justify="end">
                    <n-button @click="handleClose">Cancel</n-button>
                    <n-button type="primary" @click="handleSubmit">Submit</n-button>
                </n-space>
            </template>
        </n-card>
    </n-modal>
</template>

<style>
.modal {
    width: 500px;
}

.modal-body {
    min-height: 200px;
}
</style>
