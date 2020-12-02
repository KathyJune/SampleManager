<template>
  <div class="res-table">
    <div class="content-table">
      <el-table :data="slices" size="mini" style="width: 100%" stripe @current-change="handleSampleChange">
        <el-table-column label="id" width="80" prop="id"></el-table-column>
        <el-table-column label="所属分类体系id" width="80" prop="setId"></el-table-column>
      </el-table>
      <div class="images">
        <img style="width: 200px; height: 200px;" :src="selectedSlice.featureUrl"/>
        <img style="width: 200px; height: 200px;" :src="selectedSlice.labelUrl"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'sample-list',
  props: {
    slices: {
      required: true
    }
  },
  data () {
    return {
      selectedSlice: {}
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    handleSampleChange (item) {
      this.selectedSlice = item
      this.$emit('handleSampleChange', item)
    },
    init () {
    }
  }
}
</script>

<style scoped>

</style>
