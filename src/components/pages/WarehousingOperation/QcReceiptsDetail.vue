<!-- 质检单信息详情页  页面开发：高友谊 -->
<template>
  <div class="quality-check_detail">
    <V-Title title="详情页"></V-Title>

    <div class="p-20 section-cont yy-detail">
      <div class="section-item">
        <div class="cont-item">
          <div class="label tr">客户名称：</div>
          <div class="value">{{getRow.customerName}}</div>
        </div>
        <div class="cont-item">
          <div class="label tr">质检单号：</div>
          <div class="value">{{getRow.qualityControlOrderNumber}}</div>
        </div>
        <div class="cont-item">
          <div class="label tr">来源单号：</div>
          <div class="value">{{getRow.sourceOrderNumber}}</div>
        </div>
        <div class="cont-item">
          <div class="label tr">来源类型：</div>
          <div class="value">{{sourceType}}</div>
        </div>
      </div>
      <div class="section-item">
        <div class="cont-item">
          <div class="label tr">单据状态：</div>
          <div class="value">{{orderStatus}}</div>
        </div>
        <div class="cont-item">
          <div class="label tr">计划数：</div>
          <div class="value">{{getRow.plannedQuantity}}</div>
        </div>
        <div class="cont-item">
          <div class="label tr">质检数：</div>
          <div class="value">{{getRow.qcFinishTotalNumber}}</div>
        </div>
        <div class="cont-item">
          <div class="label tr">采购人：</div>
          <div class="value">{{getRow.buyer}}</div>
        </div>
      </div>
      <div class="section-item">
        <div class="cont-item">
          <div class="label tr">运单号：</div>
          <div class="value">{{getRow.waybillNumber}}</div>
        </div>
      </div>
      <div class="section-item">
        <!--<div class="cont-item">-->
          <!--<div class="label tr">签到人：</div>-->
          <!--<div class="value">{{getRow.signInCreater}}</div>-->
        <!--</div>-->
        <!--<div class="cont-item">-->
          <!--<div class="label tr">签到时间：</div>-->
          <!--<div class="value">{{getRow.signInTime}}</div>-->
        <!--</div>-->
        <!--<div class="cont-item">-->
        <!--<div class="label tr">异常确认人：</div>-->
        <!--<div class="value">小李</div>-->
        <!--</div>-->
        <!--<div class="cont-item">-->
        <!--<div class="label tr">异常时间：</div>-->
        <!--<div class="value">2019.4.13  10:21</div>-->
        <!--</div>-->
      </div>
    </div>

    <el-tabs v-model="activeName" @tab-click="handleClick" class="pl-20 pr-20">
      <el-tab-pane label="质检明细" name="first">
        <QcReceiptsDetailCheck></QcReceiptsDetailCheck>
      </el-tab-pane>
      <el-tab-pane label="异常明细" name="second">
        <QcReceiptsDetailAbnormal></QcReceiptsDetailAbnormal>
      </el-tab-pane>
    </el-tabs>

    <V-BottomBtn></V-BottomBtn>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import QcReceiptsDetailCheck from './QcReceiptsDetailCheck.vue'
  import QcReceiptsDetailAbnormal from './QcReceiptsDetailAbnormal.vue'

  export default {
    name: 'WarehousingOperation_QcReceiptsDetail',
    data () {
      return {
        activeName: 'first',
        sourceType: '',
        orderStatus: '',
        maList: ['quality_control_status', 'receive_arrival_notice_source_type']
      }
    },
    components: {
      QcReceiptsDetailCheck,
      QcReceiptsDetailAbnormal
    },
    computed: {
      ...mapGetters({getRow: 'qcReceiptsList/getRow'})
    },
    activated() {
      // 查询码表
      this.getMoreMaList(this.maList).then(()=> {
        this.sourceType = this.getNameByMaId(this.maList[1], this.getRow.sourceType)
        this.orderStatus = this.getNameByMaId(this.maList[0], this.getRow.orderStatus)
        console.log(this.getRow)
      })
    },
    methods: {
      handleClick (tab) {
        console.log(tab.name)
      }
    }
  }
</script>
