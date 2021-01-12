<template>
  <div class="map-container">
    <map-selector></map-selector>
  </div>
</template>

<script>
import MapSelector from 'src/components/mapSelector'
export default {
  name: 'map-test',
  components: {
    MapSelector
  }
}
</script>
<style lang="scss">
  .map-container {
    width: 100vw;
    height: 100vh;
  }
</style>
