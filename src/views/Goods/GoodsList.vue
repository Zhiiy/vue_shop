<template>
  <div id="goods-list">
    <el-card class="box-card">
      <!-- search & adduserBtn -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- userTable -->
      <el-table :data="goodsList" border stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="价格（元）" width="110px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="130px"></el-table-column>
        <el-table-column label="创建时间" width="220px">
          <template v-slot="scope">
            {{scope.row.add_time | showDate}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delGoods(scope.row.goods_id)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- pagination -->
      <el-pagination :page-sizes="[5, 10, 15, 20]" :page-size="100" layout="total, sizes, prev, pager, next, jumper"
        :total="total" @size-change="sizeChange" @current-change="currentChange">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getGoodsList, delGoods } from '@/network/goods'
import { formatDate } from '@/common/utils'

export default {
  name: 'GoodsList',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      goodsList: [],
      total: 0,
      addGoodsVisible: false
    }
  },
  methods: {
    sizeChange(val) {
      this.queryInfo.pagesize = val
      this.getGoodsList()
    },
    currentChange(val) {
      this.queryInfo.pagenum = val
      this.getGoodsList()
    },
    delGoods(id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delGoods(id).then((res) => {
            this.getGoodsList()
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
    goAddpage() {
      this.$router.push('goods/add')
    },
    // 请求数据
    getGoodsList() {
      getGoodsList(this.queryInfo).then((res) => {
        this.total = res.data.total
        this.goodsList = res.data.goods
      })
    }
  },
  filters: {
    showDate(val) {
      const date = new Date(val)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  created() {
    this.getGoodsList()
  }
}
</script>

<style>
#goods-list .el-table {
  margin: 15px 0;
  font-size: 14px;
}
</style>