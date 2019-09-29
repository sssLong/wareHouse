/*
 * @Author: 高友谊 
 * @Date: 2019-06-05 14:37:18 
 * @Last Modified by: 高友谊
 * @Last Modified time: 2019-06-05 14:58:42
 */
<template>
<div class="picking-detail">
  <V-Title title="详情"></V-Title>

  <div class="p-20 yy-detail">
    <div class="section-item">
      <div class="cont-item">
        <div class="label tr">仓库：</div>
        <div class="value">{{ detailData.warehouseName || (warehouseList.find(item => item.dataCode === detailData.warehouseCode) || {}).dataName || '' }}</div>
      </div>
      <div class="cont-item">
        <div class="label tr">拣货单号：</div>
        <div class="value">{{detailData.pickingNum}}</div>
      </div>
      <div class="cont-item">
        <div class="label tr">包裹数：</div>
        <div class="value">{{detailData.packageNumber}}</div>
      </div>
      <div class="cont-item">
        <div class="label tr">计划商品数：</div>
        <div class="value">{{detailData.planProductNum}}</div>
      </div>
      <div class="cont-item">
        <div class="label tr">实际商品数：</div>
        <div class="value">{{detailData.actualProductNum}}</div>
      </div>
    </div>
    <div class="section-item">
      <div class="cont-item">
        <div class="label tr">SKU种类数：</div>
        <div class="value">{{detailData.skuSum}}</div>
      </div>
      <div class="cont-item">
        <div class="label tr">开始时间：</div>
        <div class="value">{{detailData.startTime}}</div>
      </div>
      <div class="cont-item">
        <div class="label tr">完成时间：</div>
        <div class="value">{{detailData.endTime}}</div>
      </div>
      <div class="cont-item">
        <div class="label tr">差异数：</div>
        <div class="value">{{detailData.differenceNum}}</div>
      </div>
    </div>
  </div>

  <div class="pl-20 pr-20 mb-10 fz12">包裹明细</div>
  <div class="table-container">
    <V-Table
      class="pl-20 pr-20"
      :dataSource="dataSource"></V-Table>
  </div>

  <V-BottomBtn routerTO="/OutgoingOperation/PickingManage"></V-BottomBtn>
</div>
</template>

<script>
import { PickingDetail as cols } from '@/columns'

export default {
  data () {
    return {
      pickingNum: this.$route && this.$route.query.pickingNum,
      pickingStatus: this.$route && this.$route.query.pickingStatus,
      detailData: {},
      warehouseList: [],
      dataSource: {
        cols,
        data: []
      }
    }
  },
  created () {
    this.getWareHouse() // 仓库列表
    this.pickingOrderDetail()
    this.batchMaTableList('differential_markers', 'unmark') // 差异标记和取消标记的码表
  },
  beforeRouteLeave () { // 路由离开清空当初数据
    Object.assign(this.$data, this.$options.data())
    arguments[2] && arguments[2]()
  },
  methods: {
    async pickingOrderDetail () { // 获取详情
      const { data = {} } = await this.$api.OutgoingOperation.pickingOrderDetail({ pickingNum: this.pickingNum })
      let { pickingOrderDetailsList = [] } = data
      pickingOrderDetailsList = pickingOrderDetailsList.map(item => {
        if (this.pickingStatus == '1' || this.pickingStatus == '2') { // 待拣货/拣货中
          item.differenceMark = ''
          item.cancelMark = ''
        }
        return item
      })
      this.dataSource.data = pickingOrderDetailsList
      this.detailData = data
    },
    search () {
      this.pickingOrderDetail()
    }
  }
}
</script>
