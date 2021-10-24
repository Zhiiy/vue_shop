<template>
  <div id="login">
    <div class="login-box">
      <div class="user-icon">
        <img src="@/assets/img/logo.jpg" alt="">
      </div>
      <el-form class="login-form" ref="loginForm" :model="form" :rules="loginRules">
        <el-form-item label='username:' class="login-user" prop="username">
          <el-input v-model="form.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item label='password:' prop="password">
          <el-input v-model="form.password" type="password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <el-form-item class="login-btn">
          <el-button type="primary" @click="login">login</el-button>
          <el-button @click="resetClick">reset</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getLogin } from '@/network/login'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetClick() {
      this.$refs.loginForm.resetFields()
    },
    login() {
      this.$refs.loginForm.validate(async (vali) => {
        if (!vali) return
        getLogin(this.form.username, this.form.password).then((res) => {
          if (res.meta.status === 200) {
            this.$message({
              showClose: true,
              message: '登陆成功',
              type: 'success'
            })
            window.sessionStorage.setItem('token', res.data.token)
            this.$router.push('/home')
          } else {
            this.$message({
              showClose: true,
              message: '登陆失败 账号或密码错误',
              type: 'error'
            })
          }
        })
      })
    }
  }
}
</script>

<style>
#login {
  width: 100%;
  height: 100vh;
  background-image: linear-gradient(to top, #09203f 0%, #537895 100%);
}

.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
}

.user-icon {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px;
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  box-shadow: 0 0 10px #ddd;
  background-color: #fff;
}

.user-icon img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eeeeee;
}

.login-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
}

.login-user {
  margin-bottom: 10px;
}

.login-btn {
  display: flex;
  justify-content: flex-end;
}
</style>