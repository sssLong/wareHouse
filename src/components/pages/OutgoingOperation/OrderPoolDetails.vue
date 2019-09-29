<template>
  <div class="orderPoolDetails returnDetails">
    <V-Title title="订单池详情页">
    </V-Title>
    <div class="returnDetailsTips">
      <div>
        <p>
          <label class="title">包裹号：</label>
          <span class="main" v-text="orderDetails.packageNum"></span>
        </p>
        <p>
          <label class="title">订单号：</label>
          <span class="main" v-text="orderDetails.orderNum"></span>
        </p>
        <p>
          <label class="title">订单类型：</label>
          <span class="main" v-text="getNameByMaId('order_type',orderDetails.orderType)"></span>
        </p>
        <p>
          <label class="title">包裹类型：</label>
          <span class="main" v-text="getNameByMaId('package_type',orderDetails.packageType)"></span>
        </p>
      </div>
      <div>
        <p>
          <label class="title">包裹状态：</label>
          <span class="main" v-text="getNameByMaId('package_status',orderDetails.orderStatus)"></span>
        </p>
        <p>
          <label class="title">优先级：</label>
          <span class="main" v-text="$utils.commonUtils.filters(priorityList,orderDetails.priority)"></span>
        </p>
        <p>
          <label class="title">发货仓库：</label>
          <span class="main" v-text="warehouseName"></span>
        </p>
        <p>
          <label class="title">目的地：</label>
          <span class="main" v-text="orderDetails.destination"></span>
        </p>
      </div>
       <div>
        <p>
          <label class="title">邮寄方式：</label>
          <span class="main" v-text="orderDetails.mailingMethod"></span>
        </p>
        <p>
          <label class="title">运单号：</label>
          <span class="main" v-text="orderDetails.waybillNum"></span>
        </p>
        <p>
          <label class="title">买家：</label>
          <span class="main" v-text="orderDetails.buyer"></span>
        </p>
         <p>
          <label class="title">销售渠道：</label>
          <span class="main" v-text="orderDetails.salesChannels"></span>
        </p>
        
      </div>
      <div>
        <p>
          <label class="title">付款时间：</label>
          <span class="main" v-text="orderDetails.paymentTime"></span>
        </p>
         <p>
          <label class="title">最迟发货时间：</label>
          <span class="main" v-text="orderDetails.latestDeliveryTime"></span>
        </p>
         <p>
          <label class="title">接收时间：</label>
          <span class="main" v-text="orderDetails.createTime"></span>
        </p>
      </div>
    </div>
    <div class="returnDetailsBlock">
          <div class="table-title">明细列表</div>
          <V-Table 
            :dataSource = "dataSource"
          />
       
    </div>
     <V-BottomBtn routerTO="/OutgoingOperation/OrderPool"></V-BottomBtn> 
  </div>
</template>
<script>
import { OrderPoolDetailsCols } from "./cols";
export default {
  name: 'OutgoingOperation_OrderPoolDetails',
  data() {
    return {
      orderDetails: {},
      dataSource: {
          data: [],
          cols: OrderPoolDetailsCols,
          isIndex: true
      },
      priorityList: ["低", "中", "高"] // 优先级数组 回显列表文本
    };
  },
  activated() {
    this.getMoreMaList("order_type", "package_status", "package_type");
  },
  computed: {
    packageNum() {
      return this.$route.query.packageNum
    },
    warehouseName() {
       return this.$route.query.warehouseName
    }
  },
  methods: {
    async search() {
      const {errorCode, data} = await this.$api.OutgoingOperation.getOrderDetailList(this.packageNum)
      if(errorCode === '100200'){
        const {orderDetailsList} = data[0]
        this.orderDetails = data[0]
        this.dataSource.data = orderDetailsList
      }
    },
  },
 
};
</script>
 