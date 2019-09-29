<!-- 上架单 -->
<template>
  <div class="container">
    <div class="header-container">
      <V-Title title="上架单">
        <div class="search-content">
          <el-input clearable placeholder="请输入查询内容" v-model.trim="inputContent" class="input-with-select" @keyup.native.enter="search" @clear="search">
            <el-select v-model="selected" slot="prepend" placeholder="请选择" class="iconfont icon-xiala selectShelf selectScan">
              <el-option label="上架单号" value="putawayId"></el-option>
              <el-option label="来源单号" value="sourceOrderNumber"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </div>
      </V-Title>
      <div class="condition">
        <el-select
          v-model="selectTimeType"
          placeholder
          class="iconfont icon-xiala"
          style="min-width: 140px"
          slot="prepend">
          <el-option label="创建时间" value="0"></el-option>
          <el-option label="完成时间" value="1"></el-option>
        </el-select>
        <!-- 日期选择 -->
        <el-date-picker class="dataTime" v-model="timeArr" type="datetimerange" :clearable="false" @change="search" style="min-width: 300px"
                        start-placeholder="开始时间" end-placeholder="结束时间" format="yyyy-MM-dd HH:mm" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
        <el-select
          clearable
          v-model="warehouse"
          placeholder="选择仓库"
          @change="search"
          style="min-width: 140px"
          class='mr-10'>
          <el-option v-for="item in warehouseList" :key="item.dataCode" :label="item.dataName" :value="item.dataCode"></el-option>
        </el-select>
        <!-- 客户名称select -->
        <el-select
          v-model="dataForm.customerName"
          clearable
          placeholder="选择客户"
          class="iconfont icon-xiala"
          @change="search"
          style="min-width: 140px"
          slot="prepend">
          <el-option v-for="item in customerList" :key="item.dataCode" :label="item.dataName" :value="item.dataName"></el-option>
        </el-select>
        <!-- 单据状态select -->
        <el-select
          v-model="dataForm.putawayStatus"
          clearable
          placeholder="选择单据状态"
          class="iconfont icon-xiala"
          @change="search"
          style="min-width: 140px"
          slot="prepend">
          <el-option  v-for="item in MaBiaoObj.putaway_statusList" :key="item.dataCode" :value="item.dataCode" :label="item.dataName"></el-option>
        </el-select>
        <!-- 订单来源 -->
        <el-select
          clearable
          v-model="dataForm.sourceType"
          placeholder="选择来源类型"
          class="iconfont icon-xiala"
          @change="search"
          style="min-width: 140px"
          slot="prepend">
          <el-option  v-for="item in MaBiaoObj.receive_arrival_notice_source_typeList" :key="item.dataCode" :value="item.dataCode" :label="item.dataName"></el-option>
        </el-select>
        <span class="reset-btn" @click="reset">重置</span>
      </div>
    </div>
    <div class="table-container">
      <div class="table-operation">
        <div class="title">上架单列表</div>
      </div>
      <V-Table :dataSource="dataSource" @lookHandle="linkDetail" @sort-change="dataListSortChangeHandle">
        <!--仓库名称插槽-->
        <template slot-scope="scopes" slot="warehouseCode">
          {{returnStr(warehouseList, scopes.scope.row.warehouseCode)}}
        </template>
        <!--单据状态插槽-->
        <template slot-scope="scopes" slot="putawayStatus">
          {{getNameByMaId(maList[0], scopes.scope.row.putawayStatus)}}
        </template>
        <!--来源编号插槽-->
        <template slot-scope="scopes" slot="sourceType">
          {{getNameByMaId(maList[1], scopes.scope.row.sourceType)}}
        </template>
        <!--异常标记插槽-->
        <template slot-scope="scopes" slot="isException">
          {{scopes.scope.row.isException === 0 ? '无差异' : '有差异'}}
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
  import { ShelfList } from './cols'
  import mixinTableModule from '@/mixin/table-module'
  export default {
    name: 'WarehousingOperation_ShelfList',
    mixins: [mixinTableModule],
    data() {
      return {
        mixinTableModuleOptions: {
          activatedIsNeed: false,
          getDataListURL: 'inbound/putaway/getList',
          getDataListIsPage: true
        },
        // 上架单号/来源单号
        selected: 'putawayId',
        // 单号
        inputContent: '',
        selectTimeType: '0',
        queryTimeType: [['createTimeStart','createTimeEnd'], ['finishedTimeStart', 'finishedTimeEnd']],
        // 起止时间
        timeArr: [moment().startOf('day').format('YYYY-MM-DD HH:mm'),moment().endOf('day').format('YYYY-MM-DD HH:mm')],
        // 仓库
        warehouse: '',
        // 查询条件
        dataForm: {
          putawayStatus: '',
          sourceType: '',
          customerName: ''
        },
        dataSource: {
          data: [],
          cols: ShelfList,
          isIndex: true,
          isOperation: true,
          operation: {
            label: '操作',
            data: [{
              label: '查看',
              emitType: 'lookHandle',
              permission: '查看'
            }]
          }
        },
        maList: ['putaway_status', 'receive_arrival_notice_source_type']
      };
    },
    created (){
      // 获取客户
      this.getCustomerKv()
      // 获取仓库
      this.getWareHouse().then(() => {
        // 查询码表
        this.getMoreMaList(this.maList)
      })
    },
    methods: {
      // 查询列表
      search () {
        let obj = {putawayId: '', sourceOrderNumber: '', createTimeStart:'', createTimeEnd: '', finishedTimeStart: '',finishedTimeEnd: ''}
        obj[this.queryTimeType[this.selectTimeType][0]] = Array.isArray(this.timeArr) ? moment(this.timeArr[0]).format('YYYY-MM-DD HH:mm') : ''
        obj[this.queryTimeType[this.selectTimeType][1]] = Array.isArray(this.timeArr) ? moment(this.timeArr[1]).format('YYYY-MM-DD HH:mm') : ''
        obj[this.selected] = this.inputContent
        Object.assign(this.dataForm, obj)
        this.dataForm.warehouseCode = this.warehouse ? [this.warehouse] : []
        this.pageNum = 1
        this.getDataList()
      },
      // 重置
      reset() {
        Object.assign(this.dataForm, this.$options.data().dataForm);
        this.inputContent = ''
        this.timeArr = this.$options.data().timeArr
        this.selectTimeType = this.$options.data().selectTimeType
        this.search()
      },
      linkDetail(index, row) {
        this.$store.dispatch('shelfList/setRow', row)
        this.$router.push({path: '/WarehousingOperation/ShelfDetails'})
      },
      // 格式化内容
      returnStr(arr, rowId, valueId = 'dataCode', name = 'dataName') {
        if (!Array.isArray(arr)) return
        let data = arr.find(value => rowId == value[valueId])
        return data ? data[name] : null
      },
    }
  };
</script>
