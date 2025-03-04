<script setup lang="ts">
import { NLayoutSider, NMenu, NIcon } from 'naive-ui'
import { h, ref } from 'vue'
import { HomeOutline, MailOutline, BuildOutline } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeKey = ref('subscribers')
const collapsed = ref(false)

function renderIcon(icon) {
    return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions = [
    {
        label: 'Dashboard',
        key: 'dashboard',
        icon: renderIcon(HomeOutline),
    },
    {
        label: 'Fields',
        key: 'fields',
        icon: renderIcon(BuildOutline),
    },
    {
        label: 'Subscribers',
        key: 'subscribers',
        icon: renderIcon(MailOutline),
    },
]

function handleMenuSelect(key: string) {
    activeKey.value = key
    router.push({ name: key })
}
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
            <div class="logo">Subscibers management</div>
        </div>

        <n-menu
            :collapsed="collapsed"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"
            :value="activeKey"
            @update:value="handleMenuSelect"
            :indent="18"
            style="background: #1f2225"
        />
    </n-layout-sider>
</template>

<style scoped>
.logo-container {
    padding: 16px;
    margin-bottom: 12px;
}

.logo {
    font-size: 18px;
    font-weight: bold;
    color: white;
    text-align: left;
}
</style>
