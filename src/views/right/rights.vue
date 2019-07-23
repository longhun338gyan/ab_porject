<template>
  <div class="rights">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">权限管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-table :data="rightList" border style="width: 100%">
      <el-table-column type="index" width="80"></el-table-column>
      <el-table-column prop="authName" label="名字" width="180"></el-table-column>
      <el-table-column prop="path" label="路劲"></el-table-column>
      <el-table-column prop label="层级">
        <template slot-scope="scope">{{scope.row.level|levelFormat}}</template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getAllRightList } from '@/api/right_index.js'
export default {
  data () {
    return {
      rightList: []
    }
  },
  filters: {
    levelFormat (level) {
      if (level === '0') {
        return '一级'
      } else if (level === '1') {
        return '二级'
      } else if (level === '2') {
        return '三级'
      } else {
        return ''
      }
    }
  },
  mounted () {
    getAllRightList('list')
      .then(res => {
        console.log(res)
        this.rightList = res.data.data
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>
<style lang="less">
</style>
