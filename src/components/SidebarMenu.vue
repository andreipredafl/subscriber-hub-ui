<script setup>
import { NLayoutSider, NMenu, NIcon, NDivider } from 'naive-ui'
import { h, ref, onMounted, watch, computed } from 'vue'
import { SettingsOutline } from '@vicons/ionicons5'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const activePage = ref(null)
const collapsed = ref(false)

function renderIcon(icon) {
    return () => h(NIcon, null, { default: () => h(icon || SettingsOutline) })
}

const menuOptions = computed(() => {
    return router.options.routes
        .filter((route) => route.meta && route.meta.inSidebar === true)
        .map((route) => ({
            label: route.meta.label || capitalizeFirstLetter(route.name),
            key: route.name,
            icon: renderIcon(route.meta.icon),
        }))
})

function capitalizeFirstLetter(string) {
    if (!string) return ''
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function handleMenuSelect(key) {
    activePage.value = key
    router.push({ name: key })
}

function updateActivePage() {
    const currentRoute = route.matched[route.matched.length - 1]

    if (currentRoute && currentRoute.meta && currentRoute.meta.parent) {
        activePage.value = currentRoute.meta.parent
    } else if (route.name) {
        activePage.value = route.name
    }
}

onMounted(updateActivePage)

watch(() => route.name, updateActivePage)
</script>

<template>
    <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="collapsed"
        style="background: #1f2225"
        :show-trigger="false"
    >
        <div class="logo-container">
            <div class="logo">Subscribers management</div>
        </div>

        <n-divider />

        <n-menu
            :collapsed="collapsed"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"
            :value="activePage"
            @update:value="handleMenuSelect"
            :indent="18"
            style="background: #1f2225"
        />
    </n-layout-sider>
</template>

<style scoped>
.logo-container {
    padding: 16px 16px 0 16px;
}

.logo {
    font-size: 20px;
    font-weight: bold;
    color: white;
    text-align: left;
}
</style>
