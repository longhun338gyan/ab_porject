<template>
  <div class="users">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">用户管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区域 -->
    <div style="margin: 15px auto;">
      <el-input
        placeholder="请输入内容"
        v-model="userobj.query"
        class="input-with-select"
        style="width:300px"
        @keyup.enter.native="init"
      >
        <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
      </el-input>
      <el-button type="success" plain>添加数据</el-button>
    </div>
    <template>
      <el-table :data="userList" style="width: 100%" border>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column label="状态" width="120">
          <template slot-scope="scope">
            <el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
              <el-button type="primary" icon="el-icon-edit"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top-end">
              <el-button type="primary" icon="el-icon-s-custom"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
              <el-button type="primary" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="userobj.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </template>
  </div>
</template>
<script>
import { getAllUserList } from '@/api/user_index.js'
export default {
  data () {
    return {
      // 记录中条数
      total: 0,
      value: false,
      userobj: {
        query: '',
        pagenum: 1,
        pagesize: 1
      },
      userList: []
    }
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.userobj.pagesize = val
      this.init()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.userobj.pagenum = val
      this.init()
    },
    init () {
      getAllUserList(this.userobj)
        .then(res => {
          console.log(res)
          if (res.data.meta.status === 200) {
            this.userList = res.data.data.users
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="less" scoped>
</style>
