<template>
  <div class="create-dialog">
      <el-dialog
        title="创建样本集"
        :visible.sync="ShowCreateDialog1"
        class="d-dialog"
        width="800px"
        :before-close="handleClose">
        <div class="input-form">
          <div class="input-form-item">
            <label>样本集名称: </label>
            <el-form :model="newSetName" :rules="rules" ref="formRule">
              <el-form-item  prop="name">
                <el-input
                  size="small"
                  minlength="1"
                  placeholder="输入样本集名称"
                  v-model="newSetName.name">
                </el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="input-form-item">
            <label>备注: </label>
            <el-input
              size="small"
              placeholder="输入样本集备注"
              v-model="newSetComment">
            </el-input>
          </div>
          <div class="input-form-item">
            <label>缩放级别</label>
            <el-select size="small" v-model="newSetLevel" placeholder="请选择">
              <el-option
                v-for="item in zoomLevel"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
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
                      :ref="data.mid"
                      size="mini"
                      :options="tree"
                      :props="props"
                      v-if="linkable(node, data)"
                      @change=handleLinkChange(data)
                      @remove-tag="removeLink(data)"
                      clearable>
                    </el-cascader>
                    <el-color-picker
                      v-if="linkable(node, data)"
                      size="mini"
                      v-model="data.color">
                    </el-color-picker>
                  </div>
                </span>
              </el-tree>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
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
      rules: {
        name: [
          { required: true, trigger: 'blur' },
          { min: 3, message: '长度不少于3个字符', trigger: 'blur' }
        ]
      },
      linkedIds: [],
      props: { multiple: true },
      newSetName: {
        name: ''
      },
      newSetComment: '',
      newSetLevel: 16,
      linking: false,
      zoomLevel: [15, 16, 17, 18, 19, 20],
      data: [],
      dataBackup: [{
        mid: 1,
        label: '我的分类体系',
        code: 'aa',
        place: [0],
        disabled: true,
        link: [],
        parentId: -1,
        children: [{
          mid: 2,
          parentId: 1,
          label: '林地',
          code: 'bb',
          count: '瓦片：346777,  图斑：2898347',
          place: [0, 0],
          link: [],
          children: [{
            mid: 3,
            parentId: 2,
            label: '乔木林地',
            count: '瓦片：121777,  图斑：128347',
            code: 'cc',
            place: [0, 0, 0],
            color: '#409EFF',
            link: []
          }, {
            mid: 5,
            parentId: 2,
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
    this.data = JSON.parse(JSON.stringify(this.dataBackup))
    // this.rrequest()
  },
  computed: {
    ShowCreateDialog1: function () {
      return this.ShowCreateDialog
    }
  },
  methods: {
    closeDialog () {
      this.data = JSON.parse(JSON.stringify(this.dataBackup))
      this.linking = false
      this.newSetComment = ''
      this.newSetName.name = ''
      this.$emit('closeDialog')
    },
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
    removeLink (data) {
      // debugger
      // let removedId = this.linkedIds.pop()
      // for (let i=0; i<this.linkedIds.length; i++) {
      //   if (this.linkedIds[i] === removedId) {
      //     this.linkedIds.splice(i, 1)
      //     return
      //   }
      // }
    },
    handleLinkChange (data) {
      let that = this
      let refName = data.mid
      let linkedNodes = that.$refs[refName].getCheckedNodes()
      let linkedNodes1 = linkedNodes.filter(function (n) {
        return n.children.length === 0
      }).map(function (m) {
        return m.data
      })
      // for (let nn of linkedNodes1) {
      //   that.linkedIds.push(nn.id)
      // }
      data.link = linkedNodes1
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.closeDialog()
          // this.ShowCreateDialog1 = false
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
      // debugger
      let place = data.place
      let pplace = place.concat([node.childNodes.length])
      const newChild = { mid: id++, label: 'testtest', 'place': pplace, 'parentId': data.mid }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
      console.log(this.data)
    },
    inputCC (e, node, value) {
      // debugger
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
    getlinkedIds (node) {
      if (node.children && node.children.length !== 0) {
        for (let cNode of node.children) {
          this.getlinkedIds(cNode)
        }
      } else {
        let linkedNodes = this.$refs[node.mid].getCheckedNodes()
        for (let nn of linkedNodes) {
          this.linkedIds.push(nn.data.id)
        }
      }
      // let linkedNodes = that.$refs[refName].getCheckedNodes()
    },
    isRepeat () {
      let hash = {}
      for (let i in this.linkedIds) {
        if (hash[this.linkedIds[i]]) { return true }
        hash[this.linkedIds[i]] = true
      }
      return false
    },
    createSet () {
      // 检查样本集名称是不是已经写了
      this.$refs['formRule'].validate((valid) => {
        if (valid) {
          // 检查是不是有同一个地物类别被映射到不同的自定义类别中
          this.getlinkedIds(this.data[0])
          if (this.isRepeat()) {
            this.$alert('不同的自定义类别不可以引用同一种类别', '无法创建')
            this.linkedIds = []
            return
          }
          this.rrequest()
          let option = {
            'name': this.newSetName.name,
            'remark': this.newSetComment,
            'filter': {
              'classType': [],
              'geom': {}
            },
            'taxonomy': this.data,
            'userId': 0,
            'zoomLevel': this.newSetLevel
          }
          this.$emit('createSet', option)
        } else {
          return false
        }
      })
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
