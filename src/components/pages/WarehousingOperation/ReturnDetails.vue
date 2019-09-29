<template>
  <div class="returnDetails">
    <V-Title title="详情页">
    </V-Title>
    <div class="returnDetailsTips">
      <div>
        <p>
          <label class="title">销退收货单：</label>
          <span class="main">{{sellingBack.sellingBackId}}</span>
        </p>
        <p>
          <label class="title">仓库：</label>
          <span class="main">{{sellingBack.warehouse}}</span>
        </p>
        <p>
          <label class="title">来源单号：</label>
          <span class="main">{{sellingBack.sourceId}}</span>
        </p>
        <p>
          <label class="title">退货类型：</label>
          <span class="main">{{getNameByMaId('rejected_type',sellingBack.sellingBackType)}}</span>
        </p>
      </div>
      <div>
        <p>
          <label class="title">单据状态：</label>
          <span class="main">{{getNameByMaId('reject_status',sellingBack.status)}}</span>
        </p>
        <p>
          <label class="title">计划收货数：</label>
          <span class="main">{{sellingBack.statisticsMap.plannedQuantity}}</span>
        </p>
        <p>
          <label class="title">实际收货数：</label>
          <span class="main">{{sellingBack.statisticsMap.deliveryQuantity}}</span>
        </p>
        <p>
          <label class="title">平台：</label>
          <span class="main">{{sellingBack.platform}}</span>
        </p>
      </div>
      <div>
        <p>
          <label class="title">运单号：</label>
          <span class="main">{{sellingBack.waybillId}}</span>
        </p>
        <p>
          <label class="title">包裹号：</label>
          <span class="main">{{sellingBack.parcelId}}</span>
        </p>
        <p>
          <label class="title">物流商：</label>
          <span class="main">{{sellingBack.logistics}}</span>
        </p>
        <p>
          <label class="title">邮寄方式：</label>
          <span class="main">{{sellingBack.logistics}}</span>
        </p>
      </div>
       <div>
        <p>
          <label class="title">接收人：</label>
          <span class="main">{{sellingBack.receiver}}</span>
        </p>
        <p>
          <label class="title">接收时间：</label>
          <span class="main">{{sellingBack.receiveTime}}</span>
        </p>
      </div>
    </div>
    <div class="returnDetailsBlock table-container">
        <div class="table-title">商品明细</div>
        <V-Table 
            :dataSource = "dataSource"
        >
           
        </V-Table>
    </div>
    <V-BottomBtn :noBack='true' :buttonList='buttonList' @goBack='$router.push("/WarehousingOperation/ReturnReceipt")'></V-BottomBtn> 
  </div>
</template>
<script>
import { skuList } from './cols'
export default {
    name: 'WarehousingOperation_ReturnDetails',
    data() {
        return {
            sellingBack: {
                statisticsMap: {
                    
                }
            },
            dataSource: {
                data: [],
                autoHeight: true,
                cols: skuList, // 表格的列数据
            },
            buttonList:[
                {
                    name:'返回',    //按钮名称
                    type:true,    //是否为主按钮-可不传
                    emitType:'goBack'    //方法
                },
            ],
        };
    },
    created (){
        this.getMoreMaList('rejected_type','reject_status');
    },
    activated (){
        if (localStorage.returnDetailFlag == '1'){
            this.getMoreMaList('rejected_type','reject_status');
            localStorage.returnDetailFlag = '2';
        }
    },
    methods: {
        async search (){ 
            let params = {
                wayBillId: this.$route.query.waybillId
            }
            this.$set(this.dataSource, "loading", true);
            let {data,errorCode} = await this.$api.Warehousing.baseOrderGetBackDetail(params);
            this.$set(this.dataSource, "loading", false);
            if (errorCode == '100200'){
                this.sellingBack = data.sellingBack;
                this.dataSource.data = data.sellingBackDetail;
            }
        }
    }
};
</script>
 