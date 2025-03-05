<script setup>
import { NLayout, NConfigProvider, darkTheme } from 'naive-ui'
import SidebarMenu from './components/SidebarMenu.vue'
</script>

<template>
    <n-config-provider :theme="darkTheme">
        <n-layout has-sider style="height: 100vh">
            <SidebarMenu />
            <n-layout class="content-area">
                <router-view />
            </n-layout>
        </n-layout>
    </n-config-provider>
</template>

<style>
body {
    margin: 0;
    font-family: Avenir, Helvetica, Arial, sans-serif;
}

.content-area {
    background-color: #222529;
    padding: 20px 30px;
}
</style>
z
