<template>
  <div id="home">
    <el-container class="home-container">
      <!-- header -->
      <el-header>
        <div class="home-user">
          <img src="@/assets/img/logo.jpg" alt="">
          <span>后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">logout</el-button>
      </el-header>
      <!-- content -->
      <el-container>
        <!-- aside -->
        <el-aside :width="iscollapse ? '63px' : '200px'">
          <el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b" :collapse="iscollapse"
            unique-opened :collapse-transition="false" :router="true" :default-active='activePath'>
            <div class="toggle-button" @click="toggleClick">|||</div>
            <!-- first menu -->
            <el-submenu v-for="item in menuList" :index="item.id + ''" :key="item.id">
              <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span> {{item.authName}} </span>
              </template>
              <!-- second menu -->
              <el-menu-item v-for="menuitem in item.children" :index="'/' + menuitem.path" :key="menuitem.id"
                @click="saveActivePath('/' + menuitem.path); changeMenu(item.authName, menuitem.authName)">
                <i class="el-icon-menu"></i>
                <span> {{menuitem.authName}} </span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- main -->
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }" @click.native="clearMenuName">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-show="firstMenuName">{{firstMenuName}}</el-breadcrumb-item>
            <el-breadcrumb-item v-show="secondMenuName" v-if="$route.path !== '/goods/add'">{{secondMenuName}}
            </el-breadcrumb-item>
            <el-breadcrumb-item v-show="secondMenuName" v-else>添加商品</el-breadcrumb-item>
          </el-breadcrumb>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getHomeMenu } from '@/network/home'

export default {
  name: 'Home',
  data() {
    return {
      menuList: [],
      iconsObj: {
        147: 'el-icon-magic-stick',
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      iscollapse: false,
      activePath: '',
      firstMenuName: '',
      secondMenuName: ''
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.replace('/login')
    },
    toggleClick() {
      this.iscollapse = !this.iscollapse
    },
    saveActivePath(path) {
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    },
    changeMenu(item, menuitem) {
      window.sessionStorage.setItem('firstMenuName', item)
      window.sessionStorage.setItem('secondMenuName', menuitem)
      this.firstMenuName = item
      this.secondMenuName = menuitem
    },
    clearMenuName() {
      this.saveActivePath('')
      this.changeMenu('', '')
    },
    // 请求用户数据
    getHomeMenu() {
      getHomeMenu().then((res) => {
        this.menuList = res.data
      })
    }
  },
  created() {
    this.getHomeMenu()
    this.activePath = window.sessionStorage.getItem('activePath')
    this.firstMenuName = window.sessionStorage.getItem('firstMenuName')
    this.secondMenuName = window.sessionStorage.getItem('secondMenuName')
  }
}
</script>

<style>
.home-container {
  height: 100vh;
}

.el-header {
  display: flex;
  justify-content: space-between;
  padding-left: 8px;
  background-color: #373d3f;
  align-items: center;
  color: #fff;
  font-size: 18px;
}

.home-user img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
  border-radius: 50%;
}

.el-menu {
  height: 100%;
  border-right: 0px;
}

.el-menu--collapse {
  width: 63px;
}

.toggle-button {
  line-height: 20px;
  text-align: center;
  color: #fff;
  cursor: pointer;
}

.el-main {
  background-color: #eaedf1;
}

.el-main .el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
</style>