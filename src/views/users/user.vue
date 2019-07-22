<template>
  <div class="users">
    <!-- 面包屑区域 -->
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
      <el-button type="success" plain @click="adddialogFormVisible=true">添加数据</el-button>
    </div>
    <!-- 表格数据展示 -->
    <el-table :data="userList" style="width: 100%" border>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="状态" width="120">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"
          @change="changeState(scope.row.id,scope.row.mg_state)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top-end">
            <el-button type="primary" icon="el-icon-s-custom"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
            <el-button type="primary" icon="el-icon-delete" @click="del(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userobj.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="userobj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="adddialogFormVisible">
       <el-form :model="addform"  ref='addform'  :label-width="'80px'" :rules='rules'>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addform.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addform.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addform.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addform.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adddialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addsubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
        <el-dialog title="编辑用户" :visible.sync="editdialogFormVisible">
       <el-form :model="editform"  ref='editform'  :label-width="'80px'" :rules='rules'>
        <el-form-item label="用户名" >
          <el-input v-model="editform.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editform.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editform.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editsubmit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { getAllUserList, addUser, editUser, delUserById, updateUserState } from '@/api/user_index.js'
export default {
  data () {
    return {

      adddialogFormVisible: false,
      editform: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      editdialogFormVisible: false,
      addform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 记录中条数
      total: 0,
      value: false,
      userobj: {
        query: '',
        pagenum: 1,
        pagesize: 4
      },
      userList: [],
      rules: {
        username: [{
          required: true, message: '请输入用户名', trigger: 'blur'
        }],
        password: [{
          required: true, message: '请输入密码', trigger: 'blur'
        }],
        email: [{
          required: true, message: '邮箱', trigger: 'blur'
        },
        { pattern: /\w+[@]\w+[.]+/, message: '邮箱格式不正确', trigger: 'blur' }],
        mobile: [{
          required: true, message: '电话', trigger: 'blur'
        },
        { pattern: /^1\d{10}$/, message: '输入合法的手机', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 修改用户状态
    async changeState (id, type) {
      let res = await updateUserState(id, type)
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: '修改状态成功'
        })
      }
    },
    // 根据id删除指定用户
    del (id) {
      this.$confirm(`此操作将永久删除id号为${id}的用户,是否继续?`, '删除提示', {
        confirmButtonText: '确定', // 指定按钮文本
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delUserById(id)
          .then(res2 => {
            if (res2.data.meta.status === 200) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.userobj.pagenum = Math.ceil((this.total - 1) / this.userobj.pagesize) ? --this.userobj.pagenum : this.userobj.pagenum

              this.init()
            }
          }).catch(err2 => {
            console.log(err2)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 编辑提交
    async editsubmit () {
      let res = await editUser(this.editform)
      console.log(res)
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: '数据编辑成功'
        })
        this.editdialogFormVisible = false
        this.$refs.editform.resetFields()
        this.init()
      } else {
        this.$message({
          type: 'error',
          message: '编辑数据失败'
        })
      }
    },
    async editsubmit () {
    // await：必须写在async函数内
      let res = await editUser(this.editform)
      console.log(res)
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: '数据编辑成功'
        })
        // 隐藏对话框
        this.editdialogFormVisible = false
        // 重置表单元素的数据
        this.$refs.editform.resetFields()
        // 刷新
        this.init()
      } else {
        this.$message({
          type: 'error',
          message: '数据编辑失败'
        })
      }
    },
    // 显示编辑对话框
    showEditDialog (row) {
      this.editdialogFormVisible = true
      this.editform.id = row.id
      this.editform.username = row.username
      this.editform.email = row.email
      this.editform.mobile = row.mobile
    },
    // 添加用户
    addsubmit () {
      // 对表单元素的数据进行验证
      this.$refs.addform.validate(valid => {
        if (valid) {
          // 调用接口方法
          addUser(this.addform)
            .then(res => {
              console.log(res)
              if (res.data.meta.status === 201) {
                this.$message({
                  type: 'success',
                  message: ' 添加数据成功'
                })
                this.adddialogFormVisible = false
                this.$refs.addform.resetFields()
                this.init()
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          this.$message({
            type: 'error',
            message: '数据输入不合法'
          })
          return false
        }
      })
    },
    // 切换每页显示数量时触发
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.userobj.pagesize = val
      this.init()
    },
    // 切换当前页面时触发
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.userobj.pagenum = val
      this.init()
    },
    // 数据初始化
    init () {
      getAllUserList(this.userobj)
        .then(res => {
          console.log(res)
          if (res.data.meta.status === 200) {
            this.userList = res.data.data.users
            this.total = res.data.data.total
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
