import { createRouter, createWebHistory } from 'vue-router'
import { HomeOutline, MailOutline, BuildOutline } from '@vicons/ionicons5'

import DashboardView from '@/views/Dashboard/Index.vue'

import FieldsView from '@/views/Fields/Index.vue'

import SubscribersIndex from '@/views/Subscribers/Index.vue'
import SubscribersCreate from '@/views/Subscribers/Create.vue'
import SubscribersEdit from '@/views/Subscribers/Edit.vue'
import SubscribersView from '@/views/Subscribers/View.vue'

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
            meta: {
                inSidebar: true,
                icon: HomeOutline,
                label: 'Dashboard',
            },
        },
        {
            path: '/fields',
            name: 'fields',
            component: FieldsView,
            meta: {
                inSidebar: true,
                icon: BuildOutline,
                label: 'Fields',
            },
        },
        {
            path: '/subscribers',
            name: 'subscribers',
            component: SubscribersIndex,
            meta: {
                inSidebar: true,
                icon: MailOutline,
                label: 'Subscribers',
            },
        },
        {
            path: '/subscribers/create',
            name: 'subscribers-create',
            component: SubscribersCreate,
            meta: {
                parent: 'subscribers',
            },
        },
        {
            path: '/subscribers/:id/edit',
            name: 'subscribers-edit',
            component: SubscribersEdit,
            meta: {
                parent: 'subscribers',
            },
        },
        {
            path: '/subscribers/:id',
            name: 'subscribers-view',
            component: SubscribersView,
            meta: {
                parent: 'subscribers',
            },
        },
    ],
})

export default router
