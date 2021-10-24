<template>
  <div id="goods-param">
    <el-card>
      <!-- warning -->
      <el-alert title="注意: 只允许为第三级分类设置相关参数!" type="warning" show-icon></el-alert>
      <!-- selectCate -->
      <el-row style="margin: 15px 0">
        <span>选择商品分类:</span>
        <el-cascader :options="parentCateList" :props="cateProps" v-model="selectKey" @change="selectChange">
        </el-cascader>
      </el-row>
      <!-- Tabs -->
      <el-tabs v-model="activeName" @tab-click="changeTab">
        <!-- many -->
        <el-tab-pane label="动态参数" name="many">
          <el-button @click="showAddForm" type="primary" :disabled="isDisabled" size="mini" style="margin-bottom: 15px">
            添加参数</el-button>
          <el-table :data="manyAttrList" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag :key="index" v-for="(tag, index) in scope.row.attr_vals" closable
                  @close="handleClosed(scope.row, index)">
                  {{tag}}</el-tag>
                <el-input class=" input-new-tag" size="small" v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue" @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)" ref="saveTagInput">
                </el-input>
                <el-button class="button-new-tag" size="small" v-else @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" size="mini" @click="showEditAttr(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="delAttr(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- only -->
        <el-tab-pane label="静态属性" name="only">
          <el-button @click="showAddForm" type="primary" :disabled="isDisabled" size="mini" style="margin-bottom: 15px">
            添加参数</el-button>
          <el-table :data="onlyAttrList" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag :key="index" v-for="(tag, index) in scope.row.attr_vals" closable
                  @close="handleClosed(scope.row, index)">{{tag}}</el-tag>
                <el-input class="input-new-tag" size="small" v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue" @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)" ref="saveTagInput"></el-input>
                <el-button class="button-new-tag" size="small" v-else @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" size="mini" @click="showEditAttr(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="delAttr(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- editAttr -->
    <el-dialog :title="'修改' + isMany" :visible.sync="editAttrVisible" width="40%" @close="editDialogClosed">
      <el-form :model="editAttrList" :rules="attrRules" label-position="right" label-width="100px" ref="editAttrForm">
        <el-form-item :label="isMany + ':'" prop="attr_name">
          <el-input v-model="editAttrList.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAttrVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAttr">确 定</el-button>
      </span>
    </el-dialog>
    <!-- addAttr -->
    <el-dialog :title="'添加' + isMany" :visible.sync="addAttrVisible" width="40%" @close="addDialogClosed">
      <el-form :model="addAttrList" :rules="attrRules" label-position="right" label-width="100px" ref="addAttrForm">
        <el-form-item :label="isMany + ':'" prop="attr_name">
          <el-input v-model="addAttrList.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAttrVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttr">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCateList,
  getAttr,
  delAttr,
  getAttrInfo,
  editAttrInfo,
  addAttr,
  addAttrVal
} from '@/network/goods'

export default {
  name: 'GoodsParam',
  data() {
    return {
      parentCateList: [],
      selectKey: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      activeName: 'many',
      onlyAttrList: [],
      manyAttrList: [],
      editAttrList: {},
      addAttrList: {
        attr_name: '',
        attr_sel: '',
        attr_vals: ''
      },
      attrRules: {
        attr_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
      editAttrVisible: false,
      addAttrVisible: false
    }
  },
  methods: {
    changeTab() {
      if (this.selectKey[2]) return this.getAttr()
    },
    selectChange() {
      this.getAttr()
    },
    showInput(row) {
      row.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
      } else {
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false
        this.saveAttrVal(row)
      }
    },
    handleClosed(row, index) {
      row.attr_vals.splice(index, 1)
      this.saveAttrVal(row)
    },
    delAttr(row) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delAttr(row.cat_id, row.attr_id).then((res) => {
            this.getAttr()
          })
          this.$message({ type: 'success', message: '删除成功!' })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    showEditAttr(row) {
      this.editAttrVisible = true
      getAttrInfo(row.cat_id, row.attr_id).then((res) => {
        this.editAttrList = res.data
      })
    },
    editAttr() {
      const editObj = {
        attr_name: this.editAttrList.attr_name,
        attr_sel: this.editAttrList.attr_sel,
        attr_vals: this.editAttrList.attr_vals
      }
      this.$refs.editAttrForm.validate((vali) => {
        if (!vali) return
        editAttrInfo(
          this.editAttrList.cat_id,
          this.editAttrList.attr_id,
          editObj
        ).then((res) => {
          if (res.meta.status === 200) {
            this.$message.success('修改成功')
            this.getAttr()
            this.editAttrVisible = false
          } else {
            this.$message.error('修改失败')
          }
        })
      })
    },
    editDialogClosed() {
      this.$refs.editAttrForm.resetFields()
    },
    showAddForm() {
      this.addAttrVisible = true
      this.addAttrList.attr_sel = this.activeName
    },
    addAttr() {
      this.$refs.addAttrForm.validate((vali) => {
        if (!vali) return
        addAttr(this.selectKey[2], this.addAttrList).then((res) => {
          if (res.meta.status === 201) {
            this.$message.success('添加成功')
            this.getAttr()
            this.addAttrVisible = false
          } else {
            this.$message.error('修改失败')
          }
        })
      })
    },
    addDialogClosed() {
      this.$refs.addAttrForm.resetFields()
    },
    // 请求数据
    getAttr() {
      getAttr(this.selectKey[2], this.activeName).then((res) => {
        res.data.forEach((item) => {
          if (item.attr_vals) {
            item.attr_vals = item.attr_vals.split(' ')
          } else {
            item.attr_vals = []
          }
          item.inputValue = ''
          item.inputVisible = false
        })
        if (this.activeName === 'many') {
          this.manyAttrList = res.data
        } else {
          this.onlyAttrList = res.data
        }
      })
    },
    saveAttrVal(row) {
      addAttrVal(row.cat_id, row.attr_id, {
        attr_name: row.attr_name,
        attr_sel: this.activeName,
        attr_vals: row.attr_vals.join(' ')
      }).then((res) => {
        if (res.meta.status === 200) {
          this.$message.success('修改参数成功')
        } else {
          this.$message.error('修改参数失败')
        }
      })
    }
  },
  computed: {
    isDisabled() {
      return this.selectKey[2] ? false : true
    },
    isMany() {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    }
  },
  created() {
    getCateList({ type: '3' }).then((res) => {
      this.parentCateList = res.data
    })
  }
}
</script>

<style>
#goods-param .el-row > span {
  font-size: 16px;
  margin-right: 8px;
}

#goods-param .el-tag {
  margin: 0 8px;
}

.button-new-tag {
  margin: 0 8px;
}

.input-new-tag {
  margin: 0 8px;
  width: 80px;
}

#goods-param .el-table__expanded-cell {
  padding: 20px 50px;
}
</style>