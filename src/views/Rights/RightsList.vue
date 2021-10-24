<template>
  <div id="RightsList">
    <el-card class="box-card">
      <el-table :data="rightsList" border stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot="scope">
            <el-tag type="info" v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="warning" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="danger" v-else-if="scope.row.level === '2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsList } from '@/network/right'

export default {
  name: 'RightsList',
  data() {
    return {
      rightsList: []
    }
  },
  methods: {
    getRightsList() {
      getRightsList('list').then((res) => {
        // console.log(res)
        this.rightsList = res.data
      })
    }
  },
  created() {
    this.getRightsList()
  }
}
</script>

<style>
</style>