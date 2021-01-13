<template>
  <div class="page page-classification main-content">
    <div class='query-tool'>
      <div class="search">
        <el-input
          placeholder="请输入内容"
          v-model="category" @keyup.enter.native="getRecord">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <el-button type="primary" icon="el-icon-edit" @click="getRecord">查询</el-button>
      <el-button type="primary" icon="el-icon-edit" @click="handleAdd">新增分类体系</el-button>
    </div>
    <div class="table-panel choose-panel">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          fixed="right"
          label="操作"
          min-width="150">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="primary" size="small">编辑</el-button>
<!--            <el-button @click="handleClone(scope.row)" type="primary" size="small">克隆</el-button>-->
<!--            <el-button @click="handleFreeze(scope.row)" type="primary" size="small">冻结</el-button>-->
            <el-button @click="handleDetail(scope.row)" type="primary " size="small">明细</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="ID"
          min-width="40">
        </el-table-column>
        <el-table-column
          prop="taonomyName"
          label="体系名称"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="taonomyType"
          label="类别"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="state_type"
          label="状态"
          min-width="80">
        </el-table-column>
        <el-table-column
          prop="memo"
          label="备注"
          min-width="150">
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" width="400px">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="分类名称" :label-width="formLabelWidth" prop="taonomyName">
          <el-input v-model="form.taonomyName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类类别" :label-width="formLabelWidth" prop="taonomyType">
          <el-radio v-model="form.taonomyType" label="1">地物分类</el-radio>
          <el-radio v-model="form.taonomyType" label="2">变化检测</el-radio>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" placeholder="请输入内容" v-model="form.memo" :rows="4" maxlength="200" show-word-limit>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCategoryList } from '@/api/category'
import {getList} from '@/api/common'
import { getClassifyList, addClassify, PutClassify } from 'src/api/classification'
export default {
  name: 'classification',
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.project = this.$route.params.id || 0
      this.getRecord()
    },
    getRecord () {
      const _this = this
      let query = {
        page: 0,
        size: 20
      }
      getClassifyList(query).then((response) => {
        const { data } = response
        if (data && data.code === _this.$config.statusCode) {
          _this.tableData = data.data.list
        } else {
          _this.$notify.error({ title: '错误', message: data.message })
        }
      }).catch((response) => {
        // console.log(response)
      })
    },
    handleClick (row) {
      this.form = row
      this.formTitle = '修改分类'
      this.opt = 'edit'
      this.dialogFormVisible = true
    },
    handleClone (row) {
      //
    },
    handleFreeze (row) {
      //
    },
    handleAdd () {
      this.form = {
        taonomyName: '',
        taonomyType: 0,
        memo: ''
      }
      this.formTitle = '新增分类'
      this.opt = 'add'
      this.dialogFormVisible = true
    },
    handleDetail (row) {
      this.$router.push({ name: 'Category', params: { id: row.id } })
    },
    handledelete (row) {
      const _this = this
      this.delCategory(row.id).then((response) => {
        const { data } = response
        if (data && data.code === _this.$config.statusCode) {
          _this.getRecord()
        } else {
          _this.$notify.error({ title: '错误', message: data.message })
        }
      }).catch((response) => {
        // console.log(response)
      })
    },
    submitForm () {
      let _this = this
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let promise
          if (_this.opt === 'add') {
            promise = addClassify(_this.form)
          } else {
            promise = PutClassify(_this.form)
          }
          promise.then((response) => {
            const { data } = response
            if (data && data.code === _this.$config.statusCode) {
              _this.getRecord()
            } else {
              _this.$notify.error({ title: '错误', message: data.message })
            }
          }).catch((response) => {
            // console.log(response)
          })
          _this.dialogFormVisible = false
        } else {
          return false
        }
      })
    }
  },
  data () {
    return {
      id: 'XmDxDJmlkpgeSRsnX',
      category: '',
      page: 1,
      opt: undefined,
      project: undefined,
      tableData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dialogFormVisible: false,
      formLabelWidth: '80px',
      form: {
        taonomyName: '',
        taonomyType: 0,
        memo: ''
      },
      rules: {
        taonomyName: [
          { required: true, message: '分类名称不能为空!', trigger: 'blur' }
        ],
        taonomyType: [
          { required: true, message: '分类体系类型不能为空', trigger: 'change' }
        ]
      },
      formTitle: '新增分类',
      list: []
    }
  }
}
</script>
