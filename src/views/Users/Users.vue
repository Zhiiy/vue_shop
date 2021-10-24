<template>
  <div id="users">
    <el-card class="box-card">
      <!-- search & adduserBtn -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsers">
            <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="addListVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- userTable -->
      <el-table :data="userList" border stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="用户"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="权限"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="statuChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditInfo(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="clearUser(scope.row.id)"></el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="setUser(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- pagination -->
      <el-pagination :page-sizes="[5, 10, 15, 20]" :page-size="100" layout="total, sizes, prev, pager, next, jumper"
        :total="total" @size-change="sizeChange" @current-change="currentChange">
      </el-pagination>
      <!-- addUser -->
      <el-dialog title="添加用户" :visible.sync="addListVisible" width="40%" @closed="clearAddList">
        <el-form label-position="right" label-width="100px" :model="addUserList" :rules="addListRules" ref="addList">
          <el-form-item label="username:" prop="username">
            <el-input v-model="addUserList.username"></el-input>
          </el-form-item>
          <el-form-item label="password:" prop="password">
            <el-input type="password" v-model="addUserList.password"></el-input>
          </el-form-item>
          <el-form-item label="email:" prop="email">
            <el-input v-model="addUserList.email"></el-input>
          </el-form-item>
          <el-form-item label="mobile:" prop="mobile">
            <el-input v-model="addUserList.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addListVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- editUser -->
      <el-dialog title="修改用户" :visible.sync="editVisible" width="50%" @closed="clearEdit">
        <el-form label-position="right" label-width="100px" :model="editForm" :rules="editFormRules" ref="editForm">
          <el-form-item label="username:" prop="username">
            <el-input v-model="editForm.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="email:" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="mobile:" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- setUser -->
      <el-dialog title="分配角色" :visible.sync="setUserVisible" width="40%" @closed="clearRight">
        <p style="line-height: 20px"> {{userInfo.username}} </p>
        <p style="line-height: 40px"> {{userInfo.role_name}} </p>
        <span style="margin-right: 8px">分配角色:</span>
        <el-select v-model="selectRoleId" placeholder="请选择">
          <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id"> </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setUserVisible = false">取 消</el-button>
          <el-button type="primary" @click="giveRight">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getRolesList } from '@/network/right'
import {
  getUsers,
  changeUser,
  addUser,
  getUserInfo,
  editUserInfo,
  deleteUser,
  giveUserRole
} from '@/network/users'

export default {
  name: 'Users',
  data() {
    // 验证手机的规则
    var checkMobeli = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号码'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      addUserList: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {},
      addListRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobeli, trigger: 'blur' }
        ]
      },
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobeli, trigger: 'blur' }
        ]
      },
      userList: [],
      rolesList: [],
      userInfo: {},
      selectRoleId: '',
      total: 0,
      addListVisible: false,
      editVisible: false,
      setUserVisible: false
    }
  },
  methods: {
    sizeChange(val) {
      this.queryInfo.pagesize = val
      this.getUsers()
    },
    currentChange(val) {
      this.queryInfo.pagenum = val
      this.getUsers()
    },
    statuChange(userInfo) {
      changeUser(userInfo.id, userInfo.mg_state).then((res) => {
        if (res.meta.status === 200) this.$message.success('更新用户状态成功!')
      })
    },
    clearAddList() {
      this.$refs.addList.resetFields()
    },
    clearEdit() {
      this.$refs.editForm.resetFields()
    },
    addUser() {
      // this.addListVisible = false
      this.$refs.addList.validate((valid) => {
        if (!valid) return
        addUser(this.addUserList).then((res) => {
          if (res.meta.status !== 201) {
            return this.$message.error('添加用户失败')
          } else {
            this.addListVisible = false
            this.getUsers()
            return this.$message.success('添加用户成功')
          }
        })
      })
    },
    showEditInfo(id) {
      this.editVisible = true
      getUserInfo(id).then((res) => {
        this.editForm = res.data
      })
    },
    clearUser(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteUser(id).then((res) => {
            this.getUsers()
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
    editUserInfo() {
      this.$refs.editForm.validate((valid) => {
        if (!valid) return
        editUserInfo(
          this.editForm.id,
          this.editForm.email,
          this.editForm.mobile
        ).then((res) => {
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('更新用户失败')
          } else {
            this.editVisible = false
            this.getUsers()
            return this.$message.success('更新用户成功')
          }
        })
      })
    },
    setUser(userInfo) {
      this.getRolesList()
      this.userInfo = userInfo
      this.setUserVisible = true
    },
    giveRight() {
      giveUserRole(this.userInfo.id, { rid: this.selectRoleId }).then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error('更新角色失败!')
        }
        this.$message.success('更新角色成功!')
        this.getUsers()
        this.setUserVisible = false
      })
    },
    clearRight() {},
    // 请求用户数据
    getUsers() {
      getUsers(this.queryInfo).then((res) => {
        // console.log(res)
        this.userList = res.data.users
        this.total = res.data.total
      })
    },
    // 请求角色数据
    getRolesList() {
      getRolesList().then((res) => {
        this.rolesList = res.data
      })
    }
  },
  created() {
    this.getUsers()
  }
}
</script>

<style>
#users .el-table {
  margin: 15px 0;
  font-size: 12px;
}
</style>