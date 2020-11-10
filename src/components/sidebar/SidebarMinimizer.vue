<template>
  <button class="sidebar-minimizer" type="button" @click="onClick()"></button>
</template>
<script>

export default {
  name: 'sidebar-minimizer',
  methods: {
    onClick () {
      this.sidebarMinimize()
    },
    sidebarMinimize () {
      document.body.classList.toggle('sidebar-minimized')
      // document.querySelector('.sidebar-nav section').classList.toggle('ps')
    }
  }
}
</script>
