<template>
  <div class="app">
    <AppHeader fixed>
      <SidebarToggler class="d-lg-none" display="md" mobile />
      <b-link class="navbar-brand" style="width: 360px; font-size: 16px">
        <img class="navbar-brand-full" :src="maxLogo" width="120" height="25" alt="Logo">
        <img class="navbar-brand-minimized" :src="minLogo" width="50" height="30" alt="Logo">
         样本库管理系统
      </b-link>
      <!--<SidebarToggler class="d-md-down-none" display="lg" />-->
      <b-navbar-nav class="d-md-down-none">
        <b-nav-item class="px-3" to="/home/basicSet">基础样本集</b-nav-item>
        <b-nav-item class="px-3" to="/home/sampleManager" exact>样本管理</b-nav-item>
        <b-nav-item class="px-3" to="/home/sampleSetManager">训练样本集</b-nav-item>
        <!--<b-nav-item class="px-3" to="/sys/queryManage" >系统管理</b-nav-item>-->
        <!--<b-nav-item-dropdown id="nav_ddown" text="系统管理" extra-toggle-classes="nav-link-custom" class="px-3" right>-->
          <!--&lt;!&ndash;<b-dropdown-item to="/data/user">用户管理</b-dropdown-item>&ndash;&gt;-->
          <!--<b-dropdown-item to="/data/queryManage">查询管理</b-dropdown-item>-->
        <!--</b-nav-item-dropdown>-->
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <notifications></notifications>
        <b-nav-item class="d-md-down-none">
          <i class="fa fa-list-ul"></i>
        </b-nav-item>
        <b-nav-item class="d-md-down-none">
          <i class="fa fa-envelope-open-o"></i>
        </b-nav-item>
        <DefaultHeaderDropdownAccnt/>
      </b-navbar-nav>
      <!--<AsideToggler class="d-none d-lg-block" />-->
      <!--<AsideToggler class="d-lg-none" mobile />-->
    </AppHeader>
    <div class="app-body">
      <main class="main">
        <Breadcrumb v-if="showBread()" :list="list"><li slot="pageName" class="breadcrumb-item"></li></Breadcrumb>
        <div class="container-fluid">
          <router-view></router-view>
        </div>
      </main>
      <AppAside fixed >
        <!--aside-->
        <DefaultAside/>
      </AppAside>
    </div>
    <!--footer-->
    <!-- <TheFooter>
      <div>
        <a href="http://geodata.ai">武汉数趣科技</a>
        <span class="ml-1">&copy; 2018 creativeLabs.</span>
      </div>
      <div class="ml-auto">
        <span class="mr-1">Powered by</span>
        <a href="http://geodata.ai">武汉数趣科技</a>
      </div>
    </TheFooter> -->
  </div>
</template>

<script>
import nav from '@/_nav'
import { Header as AppHeader, SidebarToggler, Aside as AppAside, Breadcrumb } from '@coreui/vue'
import DefaultAside from './DefaultAside'
import DefaultHeaderDropdownAccnt from './DefaultHeaderDropdownAccnt'
import Notifications from './notifications'
import minLogo from 'src/assets/img/brand/sygnet.svg'
import maxLogo from 'src/assets/img/brand/logo.svg'

export default {
  name: 'full',
  components: {
    // AsideToggler,
    AppHeader,
    // AppSidebar,
    AppAside,
    // TheFooter,
    Breadcrumb,
    DefaultAside,
    Notifications,
    DefaultHeaderDropdownAccnt,
    // SidebarForm,
    // SidebarFooter,
    SidebarToggler
    // SidebarHeader
    // SidebarNav
    // SidebarMinimizer
  },
  data () {
    return {
      minLogo,
      maxLogo,
      nav: nav.items
    }
  },
  computed: {
    name () {
      return this.$route.name
    },
    list () {
      let a = this.$route.matched.filter((route) => route.name || route.meta.label)
      console.log(a)
      return this.$route.matched.filter((route) => route.name || route.meta.label)
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    showBread () {
      if (this.$route.matched[1] && this.$route.matched[1].meta.label === '基础样本集详情'){
        return true
      }
    },
    init () {
      document.body.classList.toggle('sidebar-show')
    }
  }
}
</script>
<style lang="scss">
.breadcrumb{
  margin-bottom: 0;
}
</style>
