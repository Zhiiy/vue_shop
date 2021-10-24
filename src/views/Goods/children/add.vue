<template>
  <div id="add">
    <el-card>
      <!-- warning -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- step -->
      <el-steps :active="activeName - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- form -->
      <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-position="top">
        <el-tabs tab-position="left" v-model="activeName" :before-leave="beforeTabLeave">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number" @input="maxZero"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number" @input="maxZero"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number" @input="maxZero"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader :options="parentCateList" :props="cateProps" v-model="addForm.goods_cat"></el-cascader>
            </el-form-item>
            <el-form-item>
              <el-button @click="nextPage">下一步</el-button>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyTableData" :label="item.attr_name" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border v-for="(checkItem, index) in item.attr_vals" :key="index" :label="checkItem">
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item>
              <el-button @click="nextPage">下一步</el-button>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyTableData" :label="item.attr_name" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="nextPage">下一步</el-button>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload class="upload-demo" :action="uploadURL" :headers="headerObj" :on-success="isUpload"
              :on-remove="removePic" :on-preview="preview" list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <el-form-item>
              <el-button @click="nextPage">下一步</el-button>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="addShop">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- imgPreview -->
    <el-dialog title="图片预览" :visible.sync="imageVisible" width="80%" @close="previewClose">
      <img :src="imageUrl" alt="" class="preview">
    </el-dialog>
  </div>
</template>

<script>
import { getCateList, getAttr, addGoods } from '@/network/goods'

export default {
  name: 'add',
  data() {
    return {
      activeName: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品的名称', trigger: 'blur' },
          { min: 2, max: 30, message: '字符在2 ~ 30范围之间', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品的价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品的重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品的数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      manyTableData: [],
      onlyTableData: [],
      uploadURL: 'https://lianghj.top:8888/api/private/v1/upload',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      imageUrl: '',
      content: '',
      imageVisible: false
    }
  },
  methods: {
    maxZero() {
      if (this.addForm.goods_price < 0) {
        this.addForm.goods_price = 0
      }
      if (this.addForm.goods_weight < 0) {
        this.addForm.goods_weight = 0
      }
      if (this.addForm.goods_number < 0) {
        this.addForm.goods_number = 0
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      let isOk = true
      this.$refs.addForm.validate((vali) => {
        if (!vali) {
          isOk = false
        } else {
          if (activeName === '1') {
            getAttr(this.addForm.goods_cat[2], 'many').then((res) => {
              res.data.forEach((item) => {
                item.attr_vals =
                  item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
              })
              this.manyTableData = res.data
            })
          }
          if (activeName === '2') {
            getAttr(this.addForm.goods_cat[2], 'only').then((res) => {
              this.onlyTableData = res.data
            })
          }
        }
      })
      return isOk
    },
    nextPage() {
      let i = this.activeName
      this.$refs.addForm.validate((vali) => {
        if (!vali) return
        i++
        this.activeName = i.toString()
      })
    },
    isUpload(res) {
      let picInfo = { pic: res.data.tmp_path }
      this.addForm.pics.push(picInfo)
    },
    removePic(file) {
      let picIndex = this.addForm.pics.findIndex((item) => {
        return item.pic === file.response.data.tmp_path
      })
      this.addForm.pics.splice(picIndex, 1)
    },
    preview(file) {
      this.imageVisible = true
      this.imageUrl = file.response.data.url
    },
    previewClose() {
      this.imageUrl = ''
    },
    addShop() {
      const form = JSON.parse(JSON.stringify(this.addForm))
      form.goods_cat = form.goods_cat.join(',')
      this.manyTableData.forEach((item) => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(',')
        }
        form.attrs.push(newInfo)
      })
      this.onlyTableData.forEach((item) => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        }
        form.attrs.push(newInfo)
      })
      addGoods(form).then((res) => {
        if (res.meta.status === 201) {
          this.$message.success('添加商品成功')
          this.$router.push('/goods')
        } else {
          this.$message.error('添加商品失败')
        }
      })
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
#app .el-steps {
  margin: 14px 0;
}

.el-checkbox {
  margin: 0 8px 0 0 !important;
}

.preview {
  width: 100%;
}

.upload-demo {
  margin-bottom: 10px;
}

.quill-editor {
  margin-bottom: 15px;
}

.ql-editor {
  min-height: 500px;
}
</style>