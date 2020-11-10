<template>
  <div class="time-line">
    <div class="timeline-arrow timeline-arrow-left" @click="pre" v-if="year.length"></div>
    <ul class="time-line-panel">
      <li v-for="(item, index) in year" :key="index" class="timeline-item" :class="{'isActive': activeIndex === index }" @click="handleClick(item,index)">
        <div class="timeline-item-head">
          <div class="timeline-item-line"></div>
          <div class="timeline-item-text">
            <div class="timeline-item-text-inner"></div>
          </div>
        </div>
        <div class="timeline-item-main">
          <div class="timeline-item-title" v-html="item.label"></div>
        </div>
      </li>
    </ul>
    <div class="timeline-arrow timeline-arrow-right" @click="next" v-if="year.length"></div>
  </div>
</template>

<script>
export default {
  name: 'timeline',
  props: ['year', 'defaultIndex'],
  mounted () {
    this.activeIndex = typeof this.defaultIndex !== 'undefined' ? this.year.length - 1 : null
  },
  methods: {
    handleClick (item, index) {
      this.activeIndex = index
      this.$emit('year-change', item)
    },
    pre () {
      if (this.activeIndex === 0) this.activeIndex = this.year.length
      this.activeIndex--
      this.$emit('year-change', this.year[this.activeIndex])
    },
    next () {
      if (this.activeIndex === this.year.length - 1) this.activeIndex = -1
      this.activeIndex++
      this.$emit('year-change', this.year[this.activeIndex])
    }
  },
  data () {
    return {
      activeIndex: null
    }
  }
}
</script>
<style lang="scss">
  @import "timeline";
</style>
