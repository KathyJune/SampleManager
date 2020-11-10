<template>
<div class="sys animated fadeIn">
  <AppSidebar fixed>
    <SidebarHeader/>
    <SidebarForm/>
    <SidebarNav :navItems="nav"></SidebarNav>
    <SidebarFooter/>
  </AppSidebar>
  <div class="main-container">
    <router-view></router-view>
  </div>
</div>
</template>

<script>
import { Sidebar as AppSidebar, SidebarFooter, SidebarForm, SidebarHeader, SidebarNav } from '@coreui/vue'
export default {
  name: 'sys',
  components: {
    // AsideToggler,
    AppSidebar,
    SidebarForm,
    SidebarFooter,
    SidebarHeader,
    SidebarNav
  },
  data () {
    return {
      nav: [{
        name: '元数据查询条件',
        url: '/sys/queryManage',
        icon: 'fa fa-search'
      },
      {
        name: '目录树管理',
        url: '/sys/treeSearch',
        icon: 'fa fa-list'
      },
      {
        name: '上传记录',
        url: '/sys/upload',
        icon: 'fa fa-upload'
      },
      {
        name: '发布记录',
        url: '/sys/publishManage',
        icon: 'fa fa-reply-all'
      },
      {
        name: '删除记录',
        url: '/sys/deleteManage',
        icon: 'fa fa-trash'
      },
      {
        name: '消息管理',
        url: '/sys/messageManage',
        icon: 'fa fa-bell'
      }
      ]
    }
  }
}
</script>
<style>
.main .sys .sidebar {
  margin-left: -30px;
  margin-top: -15px;
  width: 175px;
}
.main .sys .sidebar .sidebar-nav,
.main .sys .sidebar .nav {
  width: 175px;
}
.sys .main-container {
  margin-left: 175px;
}
</style>
