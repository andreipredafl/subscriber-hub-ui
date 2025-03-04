import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '@/views/DashboardView.vue'
import SubscribersView from '@/views/SubscribersView.vue'
import FieldsView from '@/views/FieldsView.vue'

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL || '/'),
    routes: [
        {
            path: '/',
            redirect: '/dashboard',
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: DashboardView,
        },
        {
            path: '/subscribers',
            name: 'subscribers',
            component: SubscribersView,
        },
        {
            path: '/fields',
            name: 'fields',
            component: FieldsView,
        },
    ],
})

export default router
