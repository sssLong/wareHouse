/*
 * @Author: 周建强 
 * @Date: 2019-06-02 18:00:07 
 * @Last Modified time: 2019-06-04 11:24:52
 */
<template>
  <div class="container">
    <div class="header-container">
      <V-Title title="发货单详情页"></V-Title>
      <div class="p-20 section-cont yy-detail">
        <div class="section-item">
          <div class="cont-item">
            <div class="label tr">发货单号：</div>
            <div class="value">{{ detailData.deliveryOrderNum }}</div>
          </div>
          <div class="cont-item">
            <div class="label tr">订单类型：</div>
            <div class="value">{{ typeCodeToName(detailData.orderType) }}</div>
          </div>
          <div class="cont-item">
            <div class="label tr">总袋数：</div>
            <div class="value">{{ detailData.bagSum }}</div>
          </div>
          <div class="cont-item">
            <div class="label tr">总包裹数：</div>
            <div class="value">{{ detailData.packageWeightSum }}</div>
          </div>
        </div>
        <div class="section-item">
          <div class="cont-item">
            <div class="label tr">总重量：</div>
            <div class="value">{{ $utils.commonUtils.numDiv(detailData.weightSum, 1000) }}kg</div>
          </div>
          <div class="cont-item">
            <div class="label tr">揽收商：</div>
            <div class="value">{{ detailData.receiver }}</div>
          </div>
          <div class="cont-item">
            <div class="label tr">创建人：</div>
            <div class="value">{{ detailData.createUserName }}</div>
          </div>
          <div class="cont-item">
            <div class="label tr">创建时间：</div>
            <div class="value">{{ detailData.createTime }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="table-container">
      <!-- 引入表格公共组件 START -->
      <V-Table :dataSource="dataSource">
        <!-- slot 自定义列的情况 -->
        <template slot-scope="scopes" slot="zip">
          <el-input
            clearable
            type="text"
            placeholder="输入备注"
            v-model="scopes.scope.row.info"
            maxlength="20"
            show-word-limit
          ></el-input>
        </template>
      </V-Table>
    </div>
    <V-BottomBtn routerTO="/OutgoingOperation/DeliveryManage"></V-BottomBtn>
  </div>
</template>

<script>
import axios from "axios";
import { DeliveryDetailsCols } from "./cols";
export default {
  data() {
    return {
      dataSource: {
        data: [], // 表格数据
        cols: DeliveryDetailsCols // 表格的列数据
      },
      detailData: {}, // 详情数据
      packageLogisticsList: [], // 所有物流方式
      deliveryOrderNum: this.$route && this.$route.query.deliveryOrderNum
    };
  },
  async created() {
    await Promise.all([
      this.batchMaTableList('order_type', 'canvasser_type'), // 订单类型，物流方式
      this.getAllPackageLogistics()
    ])
    this.deliveryDetail()
  },
  beforeRouteLeave () { // 路由离开清空当初数据
    Object.assign(this.$data, this.$options.data())
    arguments[2] && arguments[2]()
  },
  methods: {
    async deliveryDetail () {
      const { data = {} } = await this.$api.OutgoingOperation.deliveryDetail({ deliveryOrderNum: this.deliveryOrderNum })
      const { deliveryOrderDetailsList = [] } = data
      this.detailData = data
      this.dataSource.data = deliveryOrderDetailsList.map(item => {
        item.packageWeightSum = this.$utils.commonUtils.numDiv(item.packageWeightSum, 1000)
        item.canvasser = this.findCanvasser(data.warehouseCode, item.receiver + ' >> ' + item.mailingMethod)
        return item
      })
      for (let item in data) {
        this[item] = data[item]
      }
    },
    typeCodeToName (code) { // 码表code转name
      if (!this.MaBiaoObj['orderTypeList'] || !code) return ''
      return this.MaBiaoObj['orderTypeList'].find(item => item.dataCode === code).dataName
    },
    async getAllPackageLogistics () { // 获取所有物流方式
      const { data = [] } = await this.$api.LogisticsManage.packageLogistics()
      this.packageLogisticsList = data
    },
    findCanvasser (warehouseCode, comb) { // 完成集包找揽货方式
      let selector = this.packageLogisticsList.find(item => { // 找到是哪个物流渠道
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
    search () {
      this.deliveryDetail()
    }
  }
};
</script>
