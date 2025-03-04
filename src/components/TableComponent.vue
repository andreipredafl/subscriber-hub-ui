<script setup lang="ts">
import { NTable, NPagination, NFlex } from 'naive-ui'
import { ref, computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
    columns: {
        type: Array,
        required: true,
    },
    data: {
        type: Object,
        default: () => ({
            data: [],
            current_page: 1,
            per_page: 10,
            total: 0,
            last_page: 1,
        }),
    },
    pagination: {
        type: Boolean,
        default: true,
    },
})

const emit = defineEmits(['page-change', 'edit', 'delete'])

const currentPage = ref(props.data.current_page || 1)

const displayedData = computed(() => {
    if (!props.pagination || !props.data) return []
    return props.data.data || []
})

const totalPages = computed(() => props.data.last_page || 1)
const totalItems = computed(() => props.data.total || 0)

function handlePageChange(page) {
    currentPage.value = page
    emit('page-change', page)
}
</script>

<template>
    <div>
        <n-table>
            <thead>
                <tr>
                    <th v-for="column in columns" :key="column.key">
                        {{ column.title }}
                    </th>
                    <th v-if="$slots.actions">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, index) in displayedData" :key="index">
                    <td v-for="column in columns" :key="column.key">
                        <slot
                            :name="`cell-${column.key}`"
                            :row="row"
                            :index="index"
                            :value="row[column.key]"
                        >
                            {{ row[column.key] }}
                        </slot>
                    </td>
                    <td v-if="$slots.actions">
                        <slot name="actions" :row="row" :index="index" />
                    </td>
                </tr>
            </tbody>
        </n-table>

        <div v-if="pagination && totalItems > 0" class="pagination-info">
            Showing {{ displayedData.length }} of {{ totalItems }} items
        </div>

        <n-flex v-if="pagination && totalPages > 1" justify="center">
            <n-pagination
                v-model:page="currentPage"
                :page-count="totalPages"
                @update:page="handlePageChange"
            />
        </n-flex>
    </div>
</template>

<style scoped>
.pagination-info {
    margin-top: 1rem;
}
</style>
