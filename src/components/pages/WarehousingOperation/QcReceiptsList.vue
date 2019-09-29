<!-- 质检单信息  页面开发：高友谊 -->
<template>
  <div class="container">
    <div class="header-container">
      <v--title title="质检单">
        <div class="search-content">
          <el-input clearable placeholder="请输入查询内容" v-model.trim="inputContent" class="input-with-select" @keyup.native.enter="search" @clear="search">
            <el-select v-model="selected" slot="prepend" placeholder="请选择" class="iconfont icon-xiala selectShelf selectScan">
              <el-option label="质检单号" value="qualityControlOrderNumber"></el-option>
              <el-option label="来源单号" value="sourceOrderNumber"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </div>
      </v--title>

      <div class="condition">
        <el-input class="select-input createdTime" value="创建时间" readonly style="min-width: 100px"/>
        <el-date-picker class="dataTime" v-model="timeArr" type="datetimerange" :clearable="false" @change="search" style="min-width: 300px"
                        start-placeholder="开始时间" end-placeholder="结束时间" format="yyyy-MM-dd HH:mm" :default-time="['00:00:00','23:59:59']">
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
        <el-select
          clearable
          v-model="dataForm.customerName"
          placeholder="选择客户"
          @change="search"
          style="min-width: 140px"
          class='mr-10'>
          <el-option v-for="item in customerList" :key="item.dataCode" :label="item.dataName" :value="item.dataName"></el-option>
        </el-select>
        <el-select
          clearable
          v-model="dataForm.orderStatus"
          placeholder="选择单据状态"
          @change="search"
          style="min-width: 140px"
          class='mr-10'>
          <el-option  v-for="item in MaBiaoObj.quality_control_statusList" :key="item.dataCode" :value="item.dataCode" :label="item.dataName"></el-option>
        </el-select>
        <el-select
          clearable
          v-model="dataForm.sourceType"
          placeholder="选择来源类型"
          @change="search"
          style="min-width: 140px"
          class='mr-10'>
          <el-option  v-for="item in MaBiaoObj.receive_arrival_notice_source_typeList" :key="item.dataCode" :value="item.dataCode" :label="item.dataName"></el-option>
        </el-select>
        <span class="reset-btn" @click="reset">重置</span>
      </div>
    </div>

    <div class="table-container">
      <div class="table-operation">
        <div class="title">质检单列表</div>
      </div>
      <V-Table :dataSource="dataSource" @lookHandle="linkDetail" @sort-change="dataListSortChangeHandle">
        <!--仓库名称插槽-->
        <template slot-scope="scopes" slot="warehouse">
          {{returnStr(warehouseList, scopes.scope.row.warehouse)}}
        </template>
        <!--来源类型插槽-->
        <template slot-scope="scopes" slot="sourceType">
          {{getNameByMaId(maList[1], scopes.scope.row.sourceType)}}
        </template>
        <!--质检方式插槽-->
        <template slot-scope="scopes" slot="qcType">
          {{getNameByMaId(maList[2], scopes.scope.row.qcType)}}
        </template>
        <!--单据状态插槽-->
        <template slot-scope="scopes" slot="orderStatus">
          {{getNameByMaId(maList[0], scopes.scope.row.orderStatus)}}
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
  import { QcReceiptsList } from './cols'
  import moment from 'moment';
  import mixinTableModule from '@/mixin/table-module'
  export default {
    name: 'WarehousingOperation_QcReceiptsList',
    mixins: [mixinTableModule],
    data () {
      return {
        mixinTableModuleOptions: {
          activatedIsNeed: false,
          getDataListURL: 'inbound/qc/getList',
          getDataListIsPage: true
        },
        // 起止时间
        timeArr: [moment().startOf('day').format('YYYY-MM-DD HH:mm'),moment().endOf('day').format('YYYY-MM-DD HH:mm')],
        // 仓库
        warehouse: '',
        // 查询条件
        dataForm: {
          createTimeStart: '',
          createTimeEnd: '',
          flag: 0,
          orderStatus: '',
          sourceType: '',
          customerName: '',
        },
        dataSource: {
          data: [],
          cols: QcReceiptsList,
          isIndex: true,
          isOperation: true,
          operation: {
            label: '操作',
            data: [{
              label: '查看',
              emitType: 'lookHandle',
              permission: '质检单详情'
            }]
          }
        },
        // 单号来源
        selected: 'qualityControlOrderNumber',
        // 单号
        inputContent: '',
        maList: ['quality_control_status', 'receive_arrival_notice_source_type', 'receive_arrival_notice_quality_type'],
        height: 0
      }
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
    mounted() {
        this.$nextTick(() => {
            this.$utils.element.setTableHeight().then(res=>{
                this.height = res;
            })
        });
    },
    methods: {
      // 查询列表
      search () {
        this.dataForm.createTimeStart = Array.isArray(this.timeArr) ? moment(this.timeArr[0]).format('YYYY-MM-DD HH:mm') : ''
        this.dataForm.createTimeEnd = Array.isArray(this.timeArr) ? moment(this.timeArr[1]).format('YYYY-MM-DD HH:mm') : ''
        let obj = {qualityControlOrderNumber: '', sourceOrderNumber: ''}
        obj[this.selected] = this.inputContent
        Object.assign(this.dataForm, obj)
        this.dataForm.warehouse = this.warehouse ? [this.warehouse] : []
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
      // 跳转详情
      linkDetail(index, row) {
        this.$store.dispatch('qcReceiptsList/setRow', row)
        this.$router.push('/WarehousingOperation/QcReceiptsDetail')
      },
      // 格式化内容
      returnStr(arr, rowId, valueId = 'dataCode', name = 'dataName') {
        if (!Array.isArray(arr)) return
        let data = arr.find(value => rowId == value[valueId])
        return data ? data[name] : null
      },
    }
  }
</script>

<style lang="scss" scoped>
  .center-qc {
    display: flex;
    align-items: center;
  }
  .createdTime {
    width: 100px;
    margin-right: 10px;
    /deep/ input {
      cursor: default;
    }
  }
</style>
