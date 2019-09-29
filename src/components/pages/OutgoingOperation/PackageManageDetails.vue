/*
* @Author: 李涛
* @describe: 出库作业/集包管理/详情
* @Date: 2019年6月4日11:19:12
*/
<template>
  <div class="container">
    <div class="header-container">
      <V-Title title="集包单详情页"></V-Title>
      <div class="condition" style="flex-flow: wrap;">
        <el-form class="details-form" label-position="right">
          <div class="section-item">
            <el-form-item label="仓库:">
              {{ detailData.warehouseName || (warehouseList.find(item => item.dataCode === detailData.warehouseCode) || {}).dataName || '' }}
            </el-form-item>
            <el-form-item label="集包单号:">
              {{ detailData.packageOrderNum }}
            </el-form-item>
            <el-form-item label="订单类型:">
              {{ $utils.commonUtils.filters(MaBiaoObj.orderTypeList, detailData.orderType).dataName }}
            </el-form-item>
            <el-form-item label="揽收商:">
              {{ detailData.receiver }}
            </el-form-item>
          </div>
          <div class="section-item">
            <el-form-item label="集包人:">
              {{ detailData.packageUserName }}
            </el-form-item>
            <el-form-item label="提货方式:">
              {{ canvasser }}
            </el-form-item>
            <el-form-item label="集包开始时间:">
              {{ detailData.packageStartTime }}
            </el-form-item>
            <el-form-item label="集包结束时间:">
              {{ detailData.packageEndTime }}
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>

    <div class="table-container">
      <div class="table-operation">
        <div class="title">集包单列表</div>
      </div>
      <V-Table :dataSource="dataSource"></V-Table>
      <!-- <div class="block">
        <el-pagination
          class="pt-20"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div> -->
    </div>

    <V-BottomBtn routerTO="/OutgoingOperation/PackageManage"></V-BottomBtn>
  </div>
</template>

<script>
  import { PackageManageDetail } from '@/columns'
  // import { query } from '@/config'

  export default {
    // name: "OutgoingOperation_PackageManageDetails",
    data() {
      return {
        // total: null, // 列表总数，默认设置null和0有区别
        // pageNum: 1,
        // pageSize: query.limit,
        // pageSizes: [
        //   query.limit,
        //   query.limit * 2,
        //   query.limit * 5,
        //   query.limit * 10,
        //   query.limit * 20
        // ],
        canvasser: '', // 提货方式
        dataSource: {
          data: [], // 表格数据
          cols: PackageManageDetail, // 表格的列数据
        },
        warehouseList: [],
        detailData: {},
        packageOrderNum: this.$route && this.$route.query.packageOrderNum
      }
    },
    beforeRouteLeave () { // 路由离开清空当初数据
      Object.assign(this.$data, this.$options.data())
      arguments[2] && arguments[2]()
    },
    async created() {
      this.getWareHouse() // 仓库列表
      this.batchMaTableList('order_type', 'package_type', 'canvasser_type') // 订单类型的码表，揽货方式
      this.packageOrderDetail()
    },
    methods: {
      async packageOrderDetail () { // 获取集包单详情
        let { packageOrderNum } = this
        const { data = {} } = await this.$api.OutgoingOperation.packageOrderDetail({ packageOrderNum })
        const { packageOrderDetailsList = [] } = data
        this.detailData = data
        this.canvasser = await this.findCanvasser(data.warehouseCode, data.receiver + ' >> ' + data.mailingMethod)
        this.dataSource.data = packageOrderDetailsList.map(item => {
          item.mailingMethod = data.mailingMethod
          return item
        })
      },
      async findCanvasser (warehouseCode, comb) { // 完成集包找揽货方式
        const { data = [] } = await this.$api.LogisticsManage.packageLogistics()
        let selector = data.find(item => { // 找到是哪个物流渠道
          let mailingReceiverComb = item.collectorName + ' >> ' + item.methodCnName
          return mailingReceiverComb === comb
        })
        if (!selector) return ''
        let collector = selector.warehouseCollectType.find(item => {
          return item.code == warehouseCode
        })
        if (!collector) return ''
        let canvasser = this.MaBiaoObj.canvasserTypeList.find(item => {
          return item.dataCode == collector.type
        })
        return canvasser ? canvasser.dataName : ''
      },
      // 分页器
      // handleSizeChange(val) { //行數
      //   this.pageSize=val
      //   this.search()
      // },
      // handleCurrentChange(val) {//頁碼
      //   this.pageNum=val
      //   this.search()
      // },
      search () {
        this.packageOrderDetail()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .details-form {
    flex-flow: wrap;
    margin-left: -90px;
    width: 100%;
    /deep/.el-form-item {
      width: 20%;
    }
    /deep/ .el-form {
      overflow: hidden;
    }
    /deep/ .el-form-item__label {
      margin-left: 90px;
    }
    /deep/ .el-form-item__content {
      float: left;
    }
    .section-item {
      display: flex;
    }
    .el-form-item {
      width: 25%;
    }
  }
</style>
