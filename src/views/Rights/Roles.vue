<template>
  <div id="roles">
    <el-card class="box-card">
      <!-- addBtn -->
      <el-row>
        <el-col :span="3">
          <el-button type="primary" @click="addRolesVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- rolesList -->
      <el-table :data="rolesList" border stripe style="width: 100%">
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row v-for="(item, index) in scope.row.children" :key="item.id" :class="{border : index !== 0}"
              class="roleExpand">
              <!-- first -->
              <el-col :span="5">
                <el-tag closable @close="delRoleRight(scope.row, item.id)">{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- second & third -->
              <el-col :span="19">
                <el-row v-for="(secondItem, index) in item.children" :key="secondItem.id"
                  :class="{border : index !== 0}">
                  <!-- second -->
                  <el-col :span="5">
                    <el-tag closable type="success" @close="delRoleRight(scope.row, secondItem.id)">
                      {{ secondItem.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- third -->
                  <el-col :span="19">
                    <el-tag closable v-for="thirdItem in secondItem.children" :key="thirdItem.id" type="info"
                      @close="delRoleRight(scope.row, thirdItem.id)">
                      {{ thirdItem.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showRole(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delRole(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="getRightTree(scope.row)">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- addRole -->
      <el-dialog title="添加角色" :visible.sync="addRolesVisible" width="40%" @closed="clearAddList">
        <el-form :model="addRolesList" :rules="roleRules" label-position="right" label-width="100px" ref="roleList">
          <el-form-item label="roleName:" prop="roleName">
            <el-input v-model="addRolesList.roleName"></el-input>
          </el-form-item>
          <el-form-item label="roleDesc:" prop="roleDesc">
            <el-input v-model="addRolesList.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRolesVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
        </span>
      </el-dialog>
      <!-- alterRole -->
      <el-dialog title="修改角色" :visible.sync="alterRolesVisible" width="30%" @closed="clearAddList">
        <el-form :model="addRolesList" :rules="roleRules" label-position="right" label-width="100px" ref="roleList">
          <el-form-item label="roleName:" prop="roleName">
            <el-input v-model="addRolesList.roleName"></el-input>
          </el-form-item>
          <el-form-item label="roleDesc:" prop="roleDesc">
            <el-input v-model="addRolesList.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="alterRolesVisible = false">取 消</el-button>
          <el-button type="primary" @click="alterRoles">确 定</el-button>
        </span>
      </el-dialog>
      <!-- setRight -->
      <el-dialog title="分配权限" :visible.sync="setRightVisible" width="40%" @closed="clearRightCheck">
        <el-tree :data="rightList" show-checkbox :props="rightProp" node-key="id" default-expand-all
          :default-checked-keys="rightCheck" ref="checkTree">
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightVisible = false">取 消</el-button>
          <el-button type="primary" @click="allowRight">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getRightsList,
  getRolesList,
  addRoles,
  getRole,
  alterRoles,
  delRoles,
  delRoleRight,
  allowRight
} from '@/network/right'

export default {
  name: 'Roles',
  data() {
    return {
      roleId: '',
      rolesList: [],
      rightList: [],
      addRolesList: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      roleRules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '角色详情不能为空', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
        ]
      },
      rightProp: {
        label: 'authName',
        children: 'children'
      },
      rightCheck: [],
      allowList: [],
      addRolesVisible: false,
      alterRolesVisible: false,
      setRightVisible: false
    }
  },
  methods: {
    clearAddList() {
      this.$refs.roleList.resetFields()
    },
    addRoles() {
      addRoles(this.addRolesList).then((res) => {
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败')
        } else {
          this.getRolesList()
          this.addRolesVisible = false
          return this.$message.success('添加用户成功')
        }
      })
    },
    showRole(id) {
      this.alterRolesVisible = true
      this.addRolesList.id = id
      getRole(id).then((res) => {
        this.addRolesList.roleName = res.data.roleName
        this.addRolesList.roleDesc = res.data.roleDesc
      })
    },
    alterRoles() {
      alterRoles(
        this.addRolesList.id,
        this.addRolesList.roleName,
        this.addRolesList.roleDesc
      ).then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error('修改角色失败')
        } else {
          this.getRolesList()
          this.alterRolesVisible = false
          return this.$message.success('修改用户成功')
        }
      })
    },
    delRole(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delRoles(id).then((res) => {
            this.getRolesList()
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
    delRoleRight(role, rightId) {
      this.$confirm('此操作将删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delRoleRight(role.id, rightId).then((res) => {
            role.children = res.data
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
    getRightTree(role) {
      this.roleId = role.id
      this.setRightVisible = true
      getRightsList('tree').then((res) => {
        this.rightList = res.data
      })
      this.getRightCheck(role, this.rightCheck)
    },
    getRightCheck(role, arr) {
      if (!role.children) {
        arr.push(role.id)
      } else {
        role.children.forEach((element) => {
          this.getRightCheck(element, arr)
        })
      }
    },
    clearRightCheck() {
      this.rightCheck = []
    },
    allowRight() {
      this.setRightVisible = false
      const checkData = [
        ...this.$refs.checkTree.getCheckedKeys(),
        ...this.$refs.checkTree.getHalfCheckedKeys()
      ]
      this.allowList = { rids: checkData.join() }
      allowRight(this.roleId, this.allowList).then((res) => {
        if (res.meta.status === 200) {
          this.$message({ type: 'success', message: '授权成功!' })
          this.getRolesList()
        }
      })
    },
    // 请求橘色数据
    getRolesList() {
      getRolesList('list').then((res) => {
        this.rolesList = res.data
      })
    }
  },
  created() {
    this.getRolesList()
  }
}
</script>

<style>
#roles .el-table {
  margin-top: 15px;
}

#roles .el-col .el-tag {
  margin: 7px;
}

#roles .el-row {
  display: flex;
  align-items: center;
}

.border {
  border-top: 1px solid #eee;
}

.roleExpand {
  padding: 0 50px;
}
</style>