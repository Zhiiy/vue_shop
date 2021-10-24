<template>
  <div id="goods-cate">
    <el-card class="box-card">
      <!-- addBtn -->
      <el-row :gutter="20">
        <el-col :span="3">
          <el-button type="primary" @click="showAddCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- treeTable -->
      <zk-table :data="cateList" :columns="columns" show-index index-text=" #" border :selection-type="false"
        :expand-type="false">
        <template v-slot:isTrue="scope">
          <i class="el-icon-success" style="color: #66b1ff" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-error" style="color: #f56c6c" v-else></i>
        </template>
        <template v-slot:order="scope">
          <el-tag type="info" v-if="scope.row.cat_level === 0" size="medium">一级</el-tag>
          <el-tag type="warning" v-else-if="scope.row.cat_level === 1" size="medium">二级</el-tag>
          <el-tag type="danger" v-else-if="scope.row.cat_level === 2" size="medium">三级</el-tag>
        </template>
        <template v-slot:option="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCate(scope.row.cat_id)">
            编辑
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="delCate(scope.row.cat_id)">删除</el-button>
        </template>
      </zk-table>
      <!-- pagination -->
      <el-pagination :page-sizes="[5, 10, 15, 20]" :page-size="100" layout="total, sizes, prev, pager, next, jumper"
        :total="total" @size-change="sizeChange" @current-change="currentChange">
      </el-pagination>
      <!-- addCate -->
      <el-dialog title="添加分类" :visible.sync="addCateVisible" width="40%" @closed="clearAddList">
        <el-form :model="addCateList" :rules="cateRules" label-position="right" label-width="100px" ref="cateListForm">
          <el-form-item label="分类名称:" prop="cat_name">
            <el-input v-model="addCateList.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类:">
            <el-cascader :options="parentCateList" :props="cateProps" clearable v-model="selectKey"
              @change="selectChange"></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
      <!-- edit -->
      <el-dialog title="修改分类" :visible.sync="alterCateVisible" width="40%">
        <el-form :model="editCateList" :rules="cateRules" label-position="right" label-width="100px" ref="cateListForm">
          <el-form-item label="分类名称:" prop="cat_name">
            <el-input v-model="editCateList.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="alterCateVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCate">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getCateList,
  addCate,
  getCateInfo,
  editCateInfo,
  delCate
} from '@/network/goods'

export default {
  name: 'GoodsCate',
  data() {
    return {
      cateList: [],
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isTrue'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'option'
        }
      ],
      addCateList: {
        cat_pid: '',
        cat_name: '',
        cat_level: ''
      },
      editCateList: {},
      parentCateList: [],
      cateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      cateObj: {
        type: '3',
        pagenum: '1',
        pagesize: '5'
      },
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: 'true'
      },
      selectKey: [],
      total: 0,
      addCateVisible: false,
      alterCateVisible: false
    }
  },
  methods: {
    clearAddList() {
      this.$refs.cateListForm.resetFields()
    },
    getCateList() {
      getCateList(this.cateObj).then((res) => {
        this.cateList = res.data.result
        this.total = res.data.total
      })
    },
    sizeChange(val) {
      this.cateObj.pagesize = val
      this.getCateList()
    },
    currentChange(val) {
      this.cateObj.pagenum = val
      this.getCateList()
    },
    showAddCate() {
      this.addCateVisible = true
      getCateList({ type: '2' }).then((res) => {
        this.parentCateList = res.data
      })
    },
    selectChange() {
      if (this.selectKey.length > 0) {
        this.addCateList.cat_pid = this.selectKey[this.selectKey.length - 1]
        this.addCateList.cat_level = this.selectKey.length
      } else {
        this.addCateList.cat_pid = 0
        this.addCateList.cat_level = 0
      }
    },
    addCate() {
      this.$refs.cateListForm.validate((val) => {
        if (!val) return
        addCate(this.addCateList).then((res) => {
          if (res.meta.status === 201) {
            this.$message.success('添加分类成功')
            this.getCateList()
            this.addCateVisible = false
          } else {
            this.$message.error('添加分类失败')
          }
        })
      })
    },
    showEditCate(cat_id) {
      this.alterCateVisible = true
      getCateInfo(cat_id).then((res) => {
        this.editCateList = res.data
      })
    },
    editCate() {
      editCateInfo(this.editCateList.cat_id, this.editCateList.cat_name).then(
        (res) => {
          if (res.meta.status === 200) {
            this.$message.success('修改分类成功')
            this.getCateList()
            this.alterCateVisible = false
          } else {
            this.$message.error('修改分类失败')
          }
        }
      )
    },
    delCate(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delCate(id).then((res) => {
            this.getCateList()
          })
          this.$message({ type: 'success', message: '删除成功!' })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style>
#goods-cate .zk-table {
  margin: 15px 0;
}
</style>