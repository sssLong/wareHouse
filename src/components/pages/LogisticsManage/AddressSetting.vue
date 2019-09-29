/*
* @Author: 李涛
* @describe: 物流管理/地址设置
* @Date: 2019年7月22日10:16:36
*/
<template>
  <div class="container">
    <div class="header-container">
      <V-Title title="地址设置">
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
        <el-select v-model="dataForm.type" placeholder="地址类型" @change="search">
          <el-option v-for="(item, index) in addressTypeArr" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select v-model="dataForm.createBy" placeholder="创建人" @change="search">
          <el-option v-for="item in creatorList" :key="item.id" :label="item.name" :value="item.name"></el-option>
        </el-select>
        <span class="reset-btn" @click="reset">重置</span>
      </div>
    </div>

    <div class="table-container">
      <div class="table-operation">
        <div class="title">地址列表</div>
        <div class="operation">
          <div @click="addHandle" v-if="btnPermission('地址设置详情')">
            <i class="iconfont iconchuangjianqiaban"></i>
            <span>新添地址</span>
          </div>
        </div>
      </div>
      <V-Table :dataSource="dataSource" @lookHandle="lookHandle" @editHandle="editHandle" @delHandle="delHandle">
        <template slot-scope="scopes" slot="type">
          {{addressTypeArr[scopes.scope.row.type].label}}
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

  </div>
</template>

<script>
  import moment from 'moment';
  import { AddressSetting } from './cols'
  import mixinTableModule from '@/mixin/table-module'
  export default {
    name: "LogisticsManage_AddressSetting",
    mixins: [mixinTableModule],
    data() {
      return {
        mixinTableModuleOptions: {
          getDataListURL: '/logistics/basic/selectMethodAddress',
          getDataListIsPage: true,
          getDataListType: 'post'
        },
        page: 1,
        row: 10,
        delVisible: false,
        inputContent: '',
        selected: 'addressName',
        selectArr: [{
          label: '地址设置名称',
          value: 'addressName'
        }],
        addressTypeArr: [{
          label: '全选',
          value: '0'
        },{
          label: '寄件人信息',
          value: '1'
        },{
          label: '揽收人信息',
          value: '2'
        },{
          label: '退货人信息',
          value: '3'
        }],
        timeArr: [moment().startOf('day').subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'), moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')],
        // 创建人
        creatorList: [],
        // 查询条件
        dataForm: {
          beginDate: '',
          endDate: '',
          type: '',
          createBy: ''
        },
        dataSource: {
          data: [],
          cols: AddressSetting,
          isIndex: true,
          isOperation: true,
          operation: {
            label: '操作',
            data: [{
              label: '查看',
              emitType: 'lookHandle',
              permission: '地址设置详情'
            }, {
              label: '修改',
              emitType: 'editHandle',
              permission: '地址设置详情'
            }/*, {
              label: '删除',
              emitType: 'delHandle',
              permission: '地址设置详情删除'
            }*/]
          }
        },
      }
    },
    created() {
      this.getUserListByWareHouse()
      this.search()
    },
    activated() {
      this.getDataList()
    },
    methods: {
      // 查询列表
      search() {
        this.dataForm.beginDate = this.timeArr ? this.timeArr[0] : null
        this.dataForm.endDate = this.timeArr ? this.timeArr[1]: null
        let obj = {addressName: ''}
        obj[this.selected] = this.inputContent
        Object.assign(this.dataForm, obj)
        this.pageNum = 1
        this.getDataList()
      },
      // 重置
      reset() {
        Object.assign(this.dataForm, this.$options.data().dataForm);
        this.inputContent = ''
        this.timeArr = this.$options.data().timeArr
        this.search()
      },
      // 新增操作
      addHandle() {
        this.$router.push('/LogisticsManage/AddressSettingDetails?fromPageType=add')
      },
      // 查看操作
      lookHandle(index, row){
        this.$router.push({
          path: '/LogisticsManage/AddressSettingDetails',
          query: {
            fromPageType: 'look',
            editCurrentRow: JSON.stringify(row)
          }
        })
      },
      // 编辑操作
      editHandle(index, row) {
        this.$router.push({
          path: '/LogisticsManage/AddressSettingDetails',
          query: {
            fromPageType: 'edit',
            editCurrentRow: JSON.stringify(row)
          }
        })
      },
      // 删除操作
      delHandle(index, row) {
        this.$confirm('是否删除此条地址信息？', '提示', {
          type: 'warning',
          customClass: 'v-confirm'
        }).then( async () => {
          this.$utils.commonUtils.tip('暂无接口','error')
          return
        })
      },
      async getUserListByWareHouse() {
        let res = await this.$api.Warehousing.getUserListByWareHouse()
        if (res.errorCode === '100200'){
          this.creatorList = res.data;
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
