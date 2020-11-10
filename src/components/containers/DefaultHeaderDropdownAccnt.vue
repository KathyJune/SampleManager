<template>
  <AppHeaderDropdown right no-caret>
    <template slot="header">
      <img
        src="../../assets/img/avatars/admin.png"
        class="img-avatar"
        alt="admin@bootstrapmaster.com" />
    </template>
    <template slot="dropdown">
      <b-dropdown-header tag="div" class="text-center"><strong>Account</strong></b-dropdown-header>
      <b-dropdown-item><i class="fa fa-bell-o" /> Updates
        <b-badge variant="info">{{ itemsCount }}</b-badge>
      </b-dropdown-item>
      <b-dropdown-item><i class="fa fa-envelope-o" /> Messages
        <b-badge variant="success">{{ itemsCount }}</b-badge>
      </b-dropdown-item>
      <!--<b-dropdown-item><i class="fa fa-tasks" /> Tasks-->
        <!--<b-badge variant="danger">{{ itemsCount }}</b-badge>-->
      <!--</b-dropdown-item>-->
      <!--<b-dropdown-item><i class="fa fa-comments" /> Comments-->
        <!--<b-badge variant="warning">{{ itemsCount }}</b-badge>-->
      <!--</b-dropdown-item>-->
      <b-dropdown-divider />
      <b-dropdown-item><i class="fa fa-shield" /> Lock Account</b-dropdown-item>
      <b-dropdown-item @click="LogOut"><i class="fa fa-lock" /> Logout</b-dropdown-item>
    </template>
  </AppHeaderDropdown>
</template>

<script>
import { setToken } from '@/libs/util'
import { HeaderDropdown as AppHeaderDropdown } from '@coreui/vue'
export default {
  name: 'DefaultHeaderDropdownAccnt',
  components: {
    AppHeaderDropdown
  },
  data: () => {
    return { itemsCount: 42 }
  },
  methods: {
    LogOut () {
      setToken('')
      localStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>
