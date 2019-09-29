/*
* @Author: 李涛
* @describe: 物流管理/平台信息
* @Date: 2019年7月22日10:16:36
*/
<template>
  <div class="container">
    <div class="header-container">
      <V-Title title="平台信息">
        <div class="search-content">
          <el-input clearable placeholder="请输入查询内容" v-model.trim="inputContent" @keyup.native.enter="search" @clear="search">
            <el-select v-model="selected" slot="prepend" placeholder="请选择" class="iconfont" style="width: 130px">
              <el-option v-for="item in selectArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </div>
      </V-Title>
      <div class="condition">
        <el-input class="createdTime el-select" value="创建日期" readonly/>
        <el-date-picker class="mr-10 mb-10" v-model="timeArr" type="daterange" @change="search" style="width: auto"
                        start-placeholder="开始时间" end-placeholder="结束时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00','23:59:59']">
        </el-date-picker>
        <el-select v-model="dataForm.isValid" placeholder="平台状态" @change="search">
          <el-option label="全部" value=""></el-option>
          <el-option label="启用" :value="1"></el-option>
          <el-option label="禁用" :value="2"></el-option>
        </el-select>
        <span class="reset-btn" @click="reset">重置</span>
      </div>
    </div>

    <div class="table-container">
      <div class="table-operation">
        <div class="title">平台信息列表</div>
        <div class="operation">
          <div @click="addHandle" v-if="btnPermission('新添平台信息')">
            <i class="iconfont iconchuangjianqiaban"></i>
            <span>新添平台信息</span>
          </div>
        </div>
      </div>
      <V-Table :dataSource="dataSource" @editHandle="editHandle">
        <template slot-scope="scopes" slot="status">
          <el-switch v-if="btnPermission('修改')" v-model="scopes.scope.row.status" @change="toggleStatus(scopes.scope.row)"></el-switch>
        </template>
      </V-Table>

      <!--数据分页-->
      <el-pagination
        class="p-20"
        :current-page="pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle">
      </el-pagination>
    </div>

    <!--新增/修改平台信息弹窗-->
    <el-dialog :title="`${dialogType === 1 ? '新增' : '修改'}平台信息`" :visible.sync="addOrUpdateVisible" width="480px">
      <div class="content">
        <el-form :model="addOrEditForm" :rules="rules" ref="addOrEditForm" label-width="120px">
          <el-form-item label="平台编码" prop="platformCode">
            <el-input v-model="addOrEditForm.platformCode" :disabled="dialogType === 2" ></el-input>
          </el-form-item>
          <el-form-item label="平台名称" prop="platformCn">
            <el-input v-model="addOrEditForm.platformCn"></el-input>
          </el-form-item>
          <el-form-item label="平台英文名称" prop="platformEn">
            <el-input v-model="addOrEditForm.platformEn"></el-input>
          </el-form-item>
          <el-form-item label="平台状态" prop="isValid">
            <el-select v-model="addOrEditForm.isValid">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addOrUpdateVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditSubmit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import moment from 'moment';
  import { PlatformInfo } from './cols'
  import mixinTableModule from '@/mixin/table-module'
  export default {
    name: "LogisticsManage_PlatformInfo",
    mixins: [mixinTableModule],
    data() {
      let validate = async (rule, value, callback) => {
        // 获取平台信息列表(可用于查询当前所要新增的平台信息是否已存在)
        let res = await this.$api.LogisticsManage.getPlatformList({page: 1, row: 10, [rule.field]: value})
        /*
        * 1. 新增情况下, 如返回结果为不为空[]时, 证明重复(此时this.editCurrentRow.id 为undefined 肯定 !== res.data.pageInfo.list[0].id)
        * 2. 修改情况下, 结果肯定不会为空(因为可以查到自身), 但如果this.editCurrentRow.id !== res.data.pageInfo.list[0].id 说明结果并非是自己, 证明重复
        * */
        if (res.data.pageInfo.list.length > 0 && this.editCurrentRow.id !== res.data.pageInfo.list[0].id) {
          let obj = {
            platformCode: '平台编码',
            platformCn: '平台名称',
            platformEn: '平台英文名称',
          }
          callback(new Error(`平台信息${ obj[rule.field] }重复, 请检查!`))
        } else {
          callback()
        }
      }
      return {
        mixinTableModuleOptions: {
          getDataListURL: '/logistics/basic/selectPlatform',
          getDataListIsPage: true,
          getDataListType: 'post'
        },
        page: 1,
        row: 10,
        inputContent: '',
        selected: 'platformCode',
        selectArr: [{
          label: '平台编码',
          value: 'platformCode'
        }, {
          label: '平台名称',
          value: 'platformCn'
        }, {
          label: '平台英文名称',
          value: 'platformEn'
        }],
        timeArr: [moment().startOf('day').subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'), moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')],
        // 弹窗类型 1: 新增, 2: 修改
        dialogType: 1,
        // 修改时获取的当前行数据
        editCurrentRow: {},
        // 查询条件
        dataForm: {
          beginDate: '',
          endDate: '',
          isValid: ''
        },
        dataSource: {
          data: [],
          cols: PlatformInfo,
          isIndex: true,
          isOperation: true,
          operation: {
            label: '操作',
            data: [{
              label: '修改',
              emitType: 'editHandle',
              permission: '修改'
            }]
          }
        },
        addOrEditForm: {
          platformCode: '',
          platformCn: '',
          platformEn: '',
          isValid: 1
        },
        rules: {
          platformCode: [
            { required: true, message: '平台编码不可为空', trigger: 'blur' },
            { max: 50, message: '字符长度在50个以内', trigger: 'blur' },
            { validator: validate, trigger: 'blur'}
          ],
          platformCn: [
            { required: true, message: '平台名称不可为空', trigger: 'blur' },
            { max: 100, message: '字符长度在100个以内', trigger: 'blur' },
            { validator: validate, trigger: 'blur'}
          ],
          platformEn: [
            { required: true, message: '平台英文名称不可为空', trigger: 'blur' },
            { max: 100, message: '字符长度在100个以内', trigger: 'blur' },
            { validator: validate, trigger: 'blur'}
          ],
          isValid: [{ required: true}]
        }
      }
    },
    created() {
      this.search()

    },
    methods: {
      // 查询列表
      search(){
        this.dataForm.beginDate = this.timeArr ? this.timeArr[0] : null
        this.dataForm.endDate = this.timeArr ? this.timeArr[1]: null
        let obj = {platformCode: '', platformCn: '', platformEn: ''}
        obj[this.selected] = this.inputContent
        Object.assign(this.dataForm, obj)
        this.pageNum = 1
        this.getDataList()
      },
      // 查询后的回调函数
      getDataListCallback() {
        this.dataSource.data.forEach(value => {
          this.$set(value, 'status', value.isValid === 1)
        })
      },
      // 重置
      reset() {
        Object.assign(this.dataForm, this.$options.data().dataForm);
        this.inputContent = ''
        this.timeArr = this.$options.data().timeArr
        this.search()
      },
      toggleStatus(row) {
        row.status = !row.status
        let str1 = row.status ? '启用' : '禁用'
        let str2 = !row.status ? '启用' : '禁用'
        this.$confirm(`当前状态为${str1}, 是否确定${str2}该平台信息状态?`, '提示', {
          type: 'warning',
          customClass: 'v-confirm'
        }).then( async () => {
          this.addOrEditPlatform({
            id: row.id,
            isValid: row.status ? 2 : 1,
            platformCn: row.platformCn,
            platformCode: row.platformCode,
            platformEn: row.platformEn
          }, '修改')
        })
      },
      // 新增操作
      addHandle(index, row) {
        this.addOrUpdateVisible = true
        this.dialogType = 1
        this.editCurrentRow = {}
        this.$nextTick(() => {
          this.$refs['addOrEditForm'].resetFields()
          Object.assign(this.addOrEditForm, this.$options.data().addOrEditForm);
        })
      },
      // 编辑操作
      editHandle(index, row) {
        console.log(row)
        this.addOrUpdateVisible = true
        this.dialogType = 2
        this.editCurrentRow = row
        for(let key in this.addOrEditForm) {
          this.addOrEditForm[key] = row[key]
        }
        this.$nextTick(() => {
          this.$refs['addOrEditForm'].clearValidate();
        })
      },
      // 提交操作
      addOrEditSubmit() {
        this.$refs['addOrEditForm'].validate(async (valid) => {
          if (valid) {
            // 如果是修改操作,则给参数加上当前行数据的id
            let data = this.dialogType === 1 ? {...this.addOrEditForm} : {id: this.editCurrentRow.id, ...this.addOrEditForm}
            this.addOrEditPlatform(data, this.dialogType === 1 ? '新增': '修改')
          }
        });
      },
      // 新增或修改请求
      async addOrEditPlatform(data, str) {
        let res = await this.$api.LogisticsManage.addOrEditPlatform(data)
        if (res.errorCode === '100200'){
          this.addOrUpdateVisible = false
          this.$utils.commonUtils.tip(`${str}信息平台成功`,'success')
          this.getDataList()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .createdTime {
    width: 100px;
    /deep/ input {
      cursor: default;
    }
  }
</style>
