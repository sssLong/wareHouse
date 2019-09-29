/*
* @Author: 李涛
* @describe: 仓库数据/台账/出库台账
* @Date: 2019年6月25日11:10:3
*/
<template>
  <div class="container">
    <div class="header-container">
      <V-Title title="出库台账">
        <div class="search-content">
          <el-input clearable placeholder="请输入查询内容" v-model.trim="inputContent" class="input-with-select" @keyup.native.enter="search">
            <el-select v-model="selected" slot="prepend" placeholder="请选择" class="iconfont icon-xiala selectShelf selectScan">
              <el-option label="出库单号" value="orderNum"></el-option>
              <el-option label="包裹号" value="packageNum"></el-option>
              <el-option label="发货单号" value="sourceOrderNumber"></el-option>
              <el-option label="SKU" value="sku"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </div>
      </V-Title>
      <div class="condition">
        <el-date-picker class="dataTime" v-model="timeArr" type="datetimerange" :clearable="false" style="min-width: 300px"
                        popper-class="clear-btn"
                        start-placeholder="开始时间" end-placeholder="结束时间" format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00','23:59:59']">
        </el-date-picker>
        <el-select  v-model="dataForm.warehouseCode" placeholder="选择仓库" style="min-width: 150px">
          <el-option v-for="item in warehouseList" :key="item.dataCode" :label="item.dataName" :value="item.dataCode"></el-option>
        </el-select>
        <el-select v-model="dataForm.customer" placeholder="选择客户名称" clearable style="min-width: 150px">
          <el-option v-for="item in customerList" :key="item.dataCode" :label="item.dataName" :value="item.dataCode"></el-option>
        </el-select>
        <el-select v-model="dataForm.orderType" placeholder="选择订单类型" clearable style="min-width: 150px">
          <el-option v-for="item in MaBiaoObj.order_typeList" :key="item.dataCode" :label="item.dataName" :value="item.dataCode"></el-option>
        </el-select>
        <el-select v-model="dataForm.packageType" placeholder="选择包裹类型" clearable style="min-width: 150px">
          <el-option v-for="item in MaBiaoObj.package_typeList" :key="item.dataCode" :label="item.dataName" :value="item.dataCode"></el-option>
        </el-select>
        <el-button type="primary" @click="search">查询</el-button>
        <span class="reset" @click="reset">重置</span>
      </div>

      <div class="table-container">
        <div class="table-operation">
          <div class="title">统计列表</div>
          <div class="operation">
            <div style="color: inherit;" class="mr-10">
              <i class="iconfont iconshujutongji"></i>
              <span>出库商品总数: {{accountCount}}</span>
            </div>
            <div style="color: #2A8BFF; cursor: pointer;" v-if="btnPermission('导出Excel')" @click="tableExport">
              <i class="iconfont icondaochuexcel"></i>
              <span>导出Excel</span>
            </div>
          </div>
        </div>
        <V-Table :dataSource="dataSource">
          <template slot-scope="scopes" slot="startTime">
            {{Array.isArray(timeArr) ? getFormatDate(timeArr[0]) : ''}}
          </template>
          <template slot-scope="scopes" slot="endTime">
            {{Array.isArray(timeArr) ? getFormatDate(timeArr[1]) : ''}}
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
  </div>
</template>

<script>
  import moment from 'moment';
  import { OutgoingStandingBook } from './cols'
  import mixinTableModule from '@/mixin/table-module'
  export default {
    name: "WarehouseData_OutgoingStandingBook",
    mixins: [mixinTableModule],
    data() {
      return {
        mixinTableModuleOptions: {
          activatedIsNeed: false,
          getDataListURL: 'center/account/list',
          getDataListIsPage: true,
          getDataListParamsType: 'params'
        },
        page: 1,
        row: 10,
        inputContent: '',
        selected: 'orderNum',
        customerList: [],
        timeArr: [moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')],
        dataForm: {
          warehouseCode: '',
          customer: '',
          orderType: '',
          packageType: ''
        },
        dataSource: {
          data: [],
          cols: OutgoingStandingBook,
          isIndex: true
        },
        accountCount: '',
        maList: ['order_type', 'package_type']
      }
    },
    created() {
      // 获取仓库
      this.getWareHouse().then(() => {
        this.dataForm.warehouseCode = this.warehouseList[0] ? this.warehouseList[0].dataCode : ''
        // 获取码表
        this.getMoreMaList(this.maList)
      })
      // 获取客户名称信息
      this.getCustomerKv()
    },
    methods: {
      search() {
        this.dataForm.startTime = Array.isArray(this.timeArr) ? this.getFormatDate(this.timeArr[0]) : ''
        this.dataForm.endTime  = Array.isArray(this.timeArr) ? this.getFormatDate(this.timeArr[1]) : ''
        let obj = {orderNum: '', packageNum: '', sourceOrderNumber: '', sku: ''}
        obj[this.selected] = this.inputContent
        Object.assign(this.dataForm, obj)
        this.pageNum = 1
        this.getDataList()
      },
      getDataListCallback(res) {
        this.accountCount = res.data ? res.data.count : ''
      },
      // 重置
      reset() {
        Object.assign(this.dataForm, this.$options.data().dataForm);
        this.inputContent = ''
        this.timeArr = this.$options.data().timeArr
        this.dataForm.warehouseCode = this.warehouseList[0] ? this.warehouseList[0].dataCode : ''
      },
      tableExport(){
        let url = '/center/account/export'
        this.$utils.commonUtils.export('get',url,{...this.dataForm},'出库台账表格','.xls')
      }
    }
  }
</script>
