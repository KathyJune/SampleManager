<template>
  <div class="res-table">
    <div class="content-table">
      <el-table :data="slices.list" size="mini" style="width: 100%" stripe @current-change="handleSampleChange">
        <el-table-column label="id" width="100" prop="id"></el-table-column>
        <el-table-column label="所属分类体系id" width="150" prop="setId"></el-table-column>
      </el-table>
      <el-pagination
        v-if="slices.total"
        layout="prev, pager, next"
        @current-change="pageChange"
        :total="slices.total">
      </el-pagination>
      <div class="images" v-if="selectedSlice.featureUrl">
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
    },
    pageChange (page) {
      this.$emit('sampleListPageChange', page)
    }
  }
}
</script>

<style scoped>

</style>
