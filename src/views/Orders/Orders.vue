<template>
  <div id="orders">
    <el-card class="box-card">
      <!-- search -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrders">
            <el-button slot="append" icon="el-icon-search" @click="getOrders"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- ordersTable -->
      <el-table :data="ordersList" border stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="110px"></el-table-column>
        <el-table-column label="是否支付" width="130px">
          <template v-slot="scope">
            <el-tag v-if="scope.row.order_pay === 1">已付款</el-tag>
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="130px"></el-table-column>
        <el-table-column label="下单时间" width="220px">
          <template v-slot="scope">
            {{scope.row.create_time | showDate}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="115px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" circle @click="editVisible = true"></el-button>
            <el-button type="success" icon="el-icon-location" circle @click="showLogistics()"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- pagination -->
      <el-pagination :page-sizes="[5, 10, 15, 20]" :page-size="100" layout="total, sizes, prev, pager, next, jumper"
        :total="total" @size-change="sizeChange" @current-change="currentChange">
      </el-pagination>
    </el-card>
    <!-- editAdress -->
    <el-dialog title="修改地址" :visible.sync="editVisible" width="50%" @closed="clearEdit">
      <el-form label-position="right" label-width="100px" :model="editForm" :rules="editFormRules" ref="editForm">
        <el-form-item label="省市区/县:" prop="address1">
          <el-cascader :options="citydata" :props="cityProps" clearable v-model="editForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址:" prop="address2">
          <el-input v-model="editForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- Logistics -->
    <el-dialog title="物流进度" :visible.sync="LogisticsVisible" width="50%" @closed="clearLogistics">
      <el-timeline>
        <el-timeline-item v-for="(item, index) in LogisticsInfo" :key="index" :timestamp="item.time">
          {{item.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { getOrders, getLogistics } from '@/network/orders'
import { formatDate } from '@/common/utils'
import citydata from './citydata'

export default {
  name: 'Orders',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      ordersList: [],
      editForm: {
        address1: '',
        address2: ''
      },
      citydata: citydata,
      cityProps: {
        expandTrigger: 'hover',
        value: 'value',
        label: 'label',
        children: 'children'
      },
      editFormRules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      LogisticsInfo: [],
      total: 0,
      editVisible: false,
      LogisticsVisible: false
    }
  },
  methods: {
    sizeChange(val) {
      this.queryInfo.pagesize = val
      this.getOrders()
    },
    currentChange(val) {
      this.queryInfo.pagenum = val
      this.getOrders()
    },
    getOrders() {
      getOrders(this.queryInfo).then((res) => {
        this.ordersList = res.data.goods
        this.total = res.data.total
      })
    },
    clearEdit() {
      this.$refs.editForm.resetFields()
    },
    showLogistics() {
      this.LogisticsVisible = true
      getLogistics(1106975712662).then((res) => {
        this.LogisticsInfo = res.data
      })
    },
    clearLogistics() {
      this.LogisticsInfo = []
    }
  },
  created() {
    this.getOrders()
  },
  filters: {
    showDate(val) {
      const date = new Date(val)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  }
}
</script>

<style>
#orders .el-table {
  margin: 15px 0;
  font-size: 14px;
}
</style>