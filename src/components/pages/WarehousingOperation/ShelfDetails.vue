<template>
  <div class="container shelfDetails">
    <div class="header-container">
      <V-Title title="详情页"></V-Title>
      <div class="shelfDetailsTips">
        <div>
          <p>
            <label class="title">客户名称：</label>
            <span class="main">{{getRow.customerName}}</span>
          </p>
          <p>
            <label class="title">上架单号：</label>
            <span class="main">{{getRow.putawayId}}</span>
          </p>
          <p>
            <label class="title">来源单号：</label>
            <span class="main">{{getRow.sourceOrderNumber}}</span>
          </p>
          <p>
            <label class="title">来源类型：</label>
            <span class="main">{{result.sourceType}}</span>
          </p>
        </div>
        <div>
          <p>
            <label class="title">单据状态：</label>
            <span class="main">{{result.orderStatus}}</span>
          </p>
          <p>
            <label class="title">计划上架数：</label>
            <span class="main">{{result.planedPutawaySumNum}}</span>
          </p>
          <p>
            <label class="title">实际上架数：</label>
            <span class="main">{{result.actualPutawaySumNum}}</span>
          </p>
          <p>
            <label class="title">差异数：</label>
            <span class="main">{{result.diffNum}}</span>
          </p>
        </div>
        <div>
          <p>
            <label class="title">容器编号：</label>
            <span class="main">{{getRow.boxId}}</span>
          </p>
        </div>
        <!--<div>-->
          <!--<p>-->
            <!--<label class="title">运单号：</label>-->
            <!--<span class="main">{{getRow.waybillNumber}}</span>-->
          <!--</p>-->
        <!--</div>-->
      </div>
      <div class="">
      </div>
    </div>
    <div class="table-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="上架明细" name="first">
      <shelf-detail-putaway @on-set-info="onSetInfo"></shelf-detail-putaway>
      </el-tab-pane>
      <el-tab-pane label="异常明细" name="second">
      <shelf-detail-abnormal></shelf-detail-abnormal>
      </el-tab-pane>
      </el-tabs>
    </div>
    <V-BottomBtn></V-BottomBtn>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import ShelfDetailPutaway from './ShelfDetailPutaway'
  import ShelfDetailAbnormal from './ShelfDetailAbnormal'
  export default {
    name: 'WarehousingOperation_ShelfDetails',
    components: {
      ShelfDetailPutaway,
      ShelfDetailAbnormal
    },
    data() {
      return {
        activeName: 'first',
        result: {},
      }
    },
    computed: {
      ...mapGetters({getRow: 'shelfList/getRow'})
    },
    methods: {
      handleClick(tab, event) {
      },
      onSetInfo(info) {
        this.result = info
      }
    }
  };
</script>
