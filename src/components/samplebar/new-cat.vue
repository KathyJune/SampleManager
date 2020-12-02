<template>
  <div class="create-dialog">
      <el-dialog
        title="创建样本集"
        :visible.sync="ShowCreateDialog"
        width="45%"
        :before-close="handleClose">
        <div class="input-form">
          <div class="input-form-item">
            <label>样本集名称: </label>
            <el-input
              size="small"
              placeholder="请输入新样本集名称"
              v-model="newSetName">
            </el-input>
          </div>
          <div class="input-form-item">
            <label>备注: </label>
            <el-input
              size="small"
              placeholder="请输入新样本集备注"
              v-model="newSetComment">
            </el-input>
          </div>
        </div>
        <div class="transfer">
          <div class="filter-body">
            <div class="filter-header">
              我的分类体系
            </div>
            <div class="diy-cat category">
              <el-tree
                :data="data"
                node-key="id"
                default-expand-all
                :expand-on-click-node="false">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <input :value="node.label" @input="inputCC($event, node, data)" placeholder="请输入分类名称"/>
                  <div class="selectors">
                    <el-button
                      type="text"
                      size="mini"
                      v-if="!linking"
                      @click="() => append(node, data)">
                      <svg t="1600684205835" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4129" width="12" height="12"><path d="M590.769231 571.076923h324.923077c15.753846 0 29.538462-13.784615 29.538461-29.538461v-59.076924c0-15.753846-13.784615-29.538462-29.538461-29.538461H590.769231c-11.815385 0-19.692308-7.876923-19.692308-19.692308V108.307692c0-15.753846-13.784615-29.538462-29.538461-29.538461h-59.076924c-15.753846 0-29.538462 13.784615-29.538461 29.538461V433.230769c0 11.815385-7.876923 19.692308-19.692308 19.692308H108.307692c-15.753846 0-29.538462 13.784615-29.538461 29.538461v59.076924c0 15.753846 13.784615 29.538462 29.538461 29.538461H433.230769c11.815385 0 19.692308 7.876923 19.692308 19.692308v324.923077c0 15.753846 13.784615 29.538462 29.538461 29.538461h59.076924c15.753846 0 29.538462-13.784615 29.538461-29.538461V590.769231c0-11.815385 7.876923-19.692308 19.692308-19.692308z" p-id="4130"></path></svg>
                    </el-button>
                    <el-button
                      type="text"
                      size="mini"
                      v-if="(!node.disabled)&(!linking)"
                      @click="() => remove(node, data)">
                      <svg t="1600684224989" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4941" width="12" height="12"><path d="M795.648 874.496c0 33.792-27.648 61.44-61.44 61.44h-440.32c-33.792 0-61.44-27.648-61.44-61.44V226.304h562.176v648.192z m-439.296-757.76c0-3.072 1.024-6.144 3.072-8.192 2.048-2.048 5.12-3.072 8.192-3.072h292.864c7.168 0 12.288 5.12 12.288 12.288v36.864h-317.44v-37.888z m622.592 35.84H747.52v-36.864C747.52 68.608 708.608 30.72 661.504 30.72H368.64c-47.104 0-86.016 37.888-86.016 86.016V153.6H50.176c-13.312 0-25.6 7.168-31.744 18.432-6.144 11.264-6.144 25.6 0 36.864s18.432 18.432 31.744 18.432h109.568v648.192c0 73.728 60.416 134.144 134.144 134.144h440.32c73.728 0 134.144-60.416 134.144-134.144V226.304h109.568c20.48 0 36.864-16.384 36.864-36.864 1.024-20.48-15.36-36.864-35.84-36.864zM515.072 825.344c20.48 0 36.864-16.384 36.864-36.864V397.312c0-13.312-7.168-25.6-18.432-31.744-11.264-6.144-25.6-6.144-36.864 0s-18.432 18.432-18.432 31.744V788.48c0 20.48 16.384 36.864 36.864 36.864m-171.008 0c10.24 0 19.456-4.096 25.6-10.24 7.168-7.168 10.24-16.384 10.24-25.6V397.312c0-13.312-7.168-25.6-18.432-31.744-11.264-6.144-25.6-6.144-36.864 0s-18.432 18.432-18.432 31.744V788.48c1.024 20.48 17.408 36.864 37.888 36.864m342.016 0c20.48 0 36.864-16.384 36.864-36.864V397.312c0-13.312-7.168-25.6-18.432-31.744-11.264-6.144-25.6-6.144-36.864 0s-18.432 18.432-18.432 31.744V788.48c0 20.48 16.384 36.864 36.864 36.864" fill="#333333" p-id="4942"></path></svg>
                    </el-button>
                    <el-cascader
                      :ref="data.code"
                      size="mini"
                      :options="tree"
                      :props="props"
                      v-if="linkable(node, data)"
                      @change=handleLinkChange(data)
                      clearable>
                    </el-cascader>
                    <el-color-picker
                      v-if="linkable(node, data)"
                      size="mini"
                      v-model="data.color">
                    </el-color-picker>
                    <!-- <el-button
                      type="text"
                      size="mini"
                      v-if="(!node.disabled)&(linking)"
                      @click="() => relate(node, data)">
                      <svg t="1601024564543" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3151" width="12" height="12"><path d="M682.666667 256h-128v81.066667h128a174.933333 174.933333 0 0 1 174.933333 174.933333 174.933333 174.933333 0 0 1-174.933333 174.933333h-128V768h128a256 256 0 0 0 256-256c0-141.653333-114.773333-256-256-256M166.4 512A174.933333 174.933333 0 0 1 341.333333 337.066667h128V256H341.333333a256 256 0 0 0-256 256 256 256 0 0 0 256 256h128v-81.066667H341.333333c-96.426667 0-174.933333-78.506667-174.933333-174.933333M341.333333 554.666667h341.333334v-85.333334H341.333333v85.333334z" fill="#333333" p-id="3152"></path></svg>
                    </el-button> -->
                  </div>
                </span>
              </el-tree>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="linking=false; ShowCreateDialog=false">取 消</el-button>
          <el-button v-if="linking" @click="linking=false">上一步</el-button>
          <el-button type="primary" @click="startLinking" v-if="!linking">创建对应关系</el-button>
          <el-button type="primary" @click="createSet" v-if="linking">创建样本集</el-button>
        </span>
      </el-dialog>
    </div>
</template>
<script>
let id = 1000
export default {
  name: 'new-cat',
  props: {
    tree: {
      required: true
    },
    ShowCreateDialog: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      props: { multiple: true },
      newSetName: '',
      newSetComment: '',
      linking: false,
      data1: [{
        id: 1,
        label: '分类体系1',
        code: '01',
        children: [{
          id: 2,
          label: '耕地',
          count: '瓦片：346777,  图斑：2898347',
          code: '0101',
          children: [{
            id: 3,
            label: '水田',
            count: '瓦片：121777,  图斑：128347',
            code: '010101'
          }, {
            id: 4,
            label: '水浇地',
            count: '瓦片：123347,  图斑：98347',
            code: '010102'
          }, {
            id: 5,
            label: '旱地',
            count: '瓦片：98732,  图斑：560128',
            code: '010103'
          }]
        }, {
          id: 6,
          label: '园地',
          count: '瓦片：762354,  9124876',
          code: '0102',
          children: [{
            id: 7,
            label: '果园',
            count: '瓦片：87164,  图斑：98237',
            code: '010201'
          }, {
            id: 8,
            label: '茶园',
            count: '瓦片：12827,  图斑：111247',
            code: '010202'
          }, {
            id: 9,
            label: '橡胶园',
            count: '瓦片：81765,  图斑：90001',
            code: '010203'
          }, {
            id: 9,
            label: '其他园地',
            count: '瓦片：81765,  图斑：90001',
            code: '010204'
          }]
        }]
      }, {
        id: 13,
        label: '分类体系2',
        count: '瓦片：121777,  图斑：128347',
        code: '02',
        children: [{
          id: 11,
          label: '农作物',
          count: '瓦片：121777,  图斑：128347',
          code: '0201'
        }, {
          id: 12,
          label: '林地',
          count: '瓦片：121777,  图斑：128347',
          code: '0202'
        }]
      }],
      data: [{
        mid: 1,
        label: '我的分类体系',
        code: 'aa',
        place: [0],
        disabled: true,
        link: [],
        // parentId: -1,
        children: [{
          mid: 2,
          // parentId: 1,
          label: '林地',
          code: 'bb',
          count: '瓦片：346777,  图斑：2898347',
          place: [0, 0],
          link: [],
          children: [{
            mid: 3,
            // parentId: 2,
            label: '乔木林地',
            count: '瓦片：121777,  图斑：128347',
            code: 'cc',
            place: [0, 0, 0],
            color: '#409EFF',
            link: []
          }, {
            mid: 5,
            // parentId: 2,
            label: '红树林地',
            count: '瓦片：98732,  图斑：560128',
            code: 'dd',
            place: [0, 0, 1],
            color: '#409EFF',
            link: []
          }]
        }]
      }],
      list: []
    }
  },
  mounted () {
    console.log(this.tree)
    // this.rrequest()
  },
  methods: {
    TreeToList (node, parentId) {
      let temp = JSON.parse(JSON.stringify(node))
      temp.parenId = parentId
      if (temp.children) {
        for (let item of temp.children) {
          this.TreeToList(item, temp.mid)
        }
        delete temp.children
      }
      this.list.push(temp)
    },
    rrequest () {
      this.TreeToList(this.data[0], -1)
    },
    handleLinkChange (data) {
      // debugger
      // data.label = 'xixiiii'
      let refName = data.code
      let linkedNodes = this.$refs[refName].getCheckedNodes()
      let linkedNodes1 = linkedNodes.filter(function (n) {
        return n.children.length === 0
      }).map(function (m) {
        return m.data
      })
      data.link = linkedNodes1
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    startLinking () {
      this.linking = true
    },
    linkable (node, data) {
      if (!this.linking || node.disabled) {
        return false
      }
      if (node.childNodes.length !== 0) {
        return false
      }
      return true
    },
    append (node, data) {
      let place = data.place
      place.push(node.childNodes.length)
      const newChild = { id: id++, label: 'testtest', children: [], 'place': place }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
      console.log(this.data)
    },
    inputCC (e, node, value) {
      // console.log(e)
      let n = node.data.place.length
      let temp = this.data[0]
      for (let i = 1; i < n; i++) {
        let a = node.data.place[i]
        temp = temp['children'][a]
      }
      temp['label'] = e.currentTarget.value
      console.log(this.data)
    },
    createSet () {
      this.rrequest()
      debugger
      let option = {
        'name': this.newSetName,
        'remark': this.newSetComment,
        'filter': {
          'classes': [],
          'spatial': {}
        },
        'taxonomy': this.data,
        'userId': 0
      }
      this.$emit('createSet', option)
    },
    remove (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    }
  }
}
</script>
<style lang="scss">
// @import 'samplebar.scss';
</style>
