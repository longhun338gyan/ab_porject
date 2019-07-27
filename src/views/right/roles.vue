<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">权限管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain style="margin:10px 0" @click="adddialogFormVisible=true">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="roleList" style="width: 100%" border>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
            v-for="first in scope.row.children"
            :key="first.id"
            style="margin-bottom:10px;border-bottom:1px solid #ccc"
          >
            <el-col :span="4">
              <el-tag
                closable
                type="success"
                @close="delRightByRoleId(scope.row,first.id)"
              >{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="second in first.children" :key="second.id" style="margin-bottom:10px">
                <el-col :span="4">
                  <el-tag
                    closable
                    type="info"
                    @close="delRightByRoleId(scope.row,second.id)"
                  >{{second.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    type="warning"
                    v-for="third in second.children"
                    :key="third.id"
                    style="margin:0px 10px 5px 0px"
                    @close="delRightByRoleId(scope.row,third.id)"
                  >{{third.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" v-show="scope.row.children.length == 0">没有任何的权限，请先分配！！</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
            <el-button type="primary" icon="el-icon-edit" @click="showEidtDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="角色授权" placement="top-end">
            <el-button type="primary" icon="el-icon-s-custom" @click="showGrantDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
            <el-button type="primary" icon="el-icon-delete" @click="delRoleId(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 角色授权 -->
    <el-dialog title="角色授权" :visible.sync="grantdialogFormVisible">
      <el-tree
        ref="mytree"
        :data="rightList"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="checkedArr"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加角色" :visible.sync="adddialogFormVisible">
      <el-form :model="addForm" ref="addForm" :label-width="'100px'" class="demo-addForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adddialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog title="编辑角色" :visible.sync="editdialogFormVisible">
      <el-form :model="eidtForm" :label-width="'100px'" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="eidtForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="eidtForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAllRolelist,
  delRightByRoleId,
  grantRightById,
  addRole,
  editRole,
  delUserById
} from '@/api/role_index.js'
import { getAllRightList } from '@/api/right_index.js'
export default {
  data () {
    return {
      adddialogFormVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      roleId: '',
      grantdialogFormVisible: false,
      checkedArr: [],
      roleList: [],
      rightList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      editdialogFormVisible: false,
      eidtForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          {
            required: true,
            message: '角色名称',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          {
            required: true,
            message: '角色描述',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    delRoleId (id) {
      this.$confirm(`此操作将永久删除id号为${id}的用户,是否继续?`, '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delUserById(id)
            .then(res2 => {
              if (res2.data.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
                this.roleInit()
              }
            }).catch(err2 => {
              console.log(err2)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除'
          })
        })
    },
    // 编辑角色
    async editRoleSubmit () {
      let res = await editRole(this.eidtForm)
      console.log(res)
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: '编辑权限成功'
        })
        this.editdialogFormVisible = false
        this.roleInit()
      } else {
        this.$message({
          type: 'error',
          message: '编辑数据失败'
        })
      }
    },
    showEidtDialog (row) {
      this.editdialogFormVisible = true
      this.eidtForm.id = row.id
      this.eidtForm.roleName = row.roleName
      this.eidtForm.roleDesc = row.roleDesc
      // var res = (this.eidtForm.id = row.id)
      // console.log(res)
    },
    async addRoleSubmit () {
      let res = await addRole(this.addForm)
      console.log(res)
      if (res.data.meta.status === 201) {
        this.$message({
          type: 'success',
          message: res.data.meta.msg
        })
        this.adddialogFormVisible = false
        this.$refs.addForm.resetFields()
        this.roleInit()
      }
    },
    // 权限分配提交
    async grantSubmit () {
      var arr = this.$refs.mytree.getCheckedNodes()
      var temp = []
      arr.forEach(item => {
        temp.push(item.id + ',' + item.pid)
      })

      var tempstr = temp.join(',')
      var temparr = tempstr.split(',')
      var finalarr = [...new Set(temparr)]
      let res = await grantRightById(this.roleId, finalarr.join(','))
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: res.data.meta.msg
        })
        this.grantdialogFormVisible = false
        this.roleInit()
      }
    },
    // 打开授权对话框
    async showGrantDialog (row) {
      this.grantdialogFormVisible = true
      this.roleId = row.id
      let res = await getAllRightList('tree')
      // console.log(res)
      // console.log(row)
      this.rightList = res.data.data
      this.checkedArr.length = 0
      if (row.children && row.children.length > 0) {
        row.children.forEach(first => {
          if (first.children && first.children.length > 0) {
            first.children.forEach(second => {
              if (second.children && second.children.length > 0) {
                second.children.forEach(third => {
                  this.checkedArr.push(third.id)
                  // console.log(this.checkedArr)
                })
              }
            })
          }
        })
      }
    },
    // 删除权限
    async delRightByRoleId (row, rightId) {
      let res = await delRightByRoleId(row.id, rightId)
      console.log(res)
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: res.data.meta.msg
        })
        row.children = res.data.data
      }
    },
    async roleInit () {
      let res = await getAllRolelist()
      this.roleList = res.data.data
      // console.log(res)
    }
  },
  // 初始化
  mounted () {
    this.roleInit()
  }
}
</script>
<style lang="less">
</style>
