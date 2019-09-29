<!-- 到货通知详情页  页面开发：廖佳星 样式文件：ArrivalNotice.scss-->
<template>
  <div class="arrivalNotice">
    <!-- 顶部标题 -->
    <V-Title title="详情页"></V-Title>
    <!-- 信息展示 -->
    <div class="bodyBox">
      <div class="p-20 section-cont yy-detail">
        <div class="section-item">
          <div class="cont-item">
            <div class="label tr">到货通知单：</div>
            <div class="value">{{detailData.arrivalNoticeId}}</div>
          </div>
          <div class="cont-item">
            <div class="label tr">仓库名称：</div>
            <div class="value">{{detailData.warehouse}}</div>
          </div>
          <div class="cont-item">
            <div class="label tr">来源单号：</div>
            <div class="value">{{detailData.sourceId}}</div>
          </div>
          <div class="cont-item">
            <div class="label tr">来源类型：</div>
            <div class="value">{{getNameByMaId('receive_arrival_notice_source_type',detailData.sourceType)}}</div>
          </div>
        </div>
        <div class="section-item">
          <div class="cont-item">
            <div class="label tr">单据状态：</div>
            <div class="value">{{getNameByMaId('receive_arrival_notice_status',detailData.status)}}</div>
          </div>
          <div class="cont-item">
            <div class="label tr">计划数：</div>
            <div class="value">{{detailData.plannedQuantity}}</div>
          </div>
          <div class="cont-item">
            <div class="label tr">包裹数：</div>
            <div class="value">{{detailData.parcelQuantity}}</div>
          </div>
          <div class="cont-item">
            <div class="label tr">创建时间：</div>
            <div class="value">{{detailData.createTime}}</div>
          </div>
        </div>
        <div class="section-item">
          <!-- <div class="cont-item">
            <div class="label tr">采购员：</div>
            <div class="value">{{detailData.creater}}</div>
          </div> -->
          <div class="cont-item">
            <div class="label tr">差异数：</div>
            <div class="value">{{detailData.differQuantity}}</div>
          </div>
          <div class="cont-item">
            <div class="label tr">质检方式：</div>
            <div class="value">{{detailData.qualityType | qualityType}}</div>
          </div>
          <div class="cont-item">
            <div class="label tr">创建人：</div>
            <div class="value">{{detailData.creater}}</div>
          </div>
          <div class="cont-item">
            <div class="label tr">客户名称：</div>
            <div class="value">{{detailData.customerName}}</div>
          </div>
        </div>
        <div class="section-item">
          <div class="cont-item">
            <div class="label tr">备注：</div>
            <div class="value">{{detailData.comment}}</div>
          </div>
        </div>
      </div>
      <!-- tab切换 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="SKU明细" name="1"></el-tab-pane>
        <el-tab-pane label="收货明细" name="2"></el-tab-pane>
      </el-tabs>
      <!-- SKU明细表格 -->
      <div class="tableBox pb-20" v-show="activeName=='1'" >
        <el-table :data="tableData" style="width: 100%" class="shelfTable" v-loading='loading'>
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="waybillId" label="运单号"></el-table-column>
          <el-table-column prop="sku" label="SKU"></el-table-column>
          <el-table-column prop="plannedQuantity" label="计划数"></el-table-column>
          <el-table-column prop="deliveryQuantity" label="收货数"></el-table-column>
          <el-table-column prop="differQuantity" label="差异数"></el-table-column>
          <el-table-column prop="goodName" label="产品名称"></el-table-column>
          <el-table-column prop="goodType" label="本地分类"></el-table-column>
        </el-table>
      </div>
      <!-- 收货明细表格 -->
      <div class="tableBox pb-20" v-show="activeName=='2'">
        <el-table :data="tableData" style="width: 100%" class="shelfTable">
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="waybillId" label="运单号"></el-table-column>
          <el-table-column prop="sku" label="SKU"></el-table-column>
          <el-table-column prop="deliveryQuantity" label="收货数"></el-table-column>
          <el-table-column prop="goodName" label="产品名称"></el-table-column>
          <el-table-column prop="goodType" label="本地分类"></el-table-column>
          <el-table-column prop="cardBoardId" label="卡板号"></el-table-column>
          <el-table-column prop="receiver" label="接收员"></el-table-column>
          <el-table-column prop="receiveTime" label="接收时间"></el-table-column>
        </el-table>
      </div>
    </div>
    <V-BottomBtn :noBack='true' :buttonList='buttonList' @goBack='$router.push("/WarehousingOperation/ArrivalNotice")'></V-BottomBtn> 
  </div>
</template>

<script>
export default {
    name: 'WarehousingOperation_ArrivalNDetails',
    data() {
        return {
            sourceId: '',
            activeName: "1",
            detailData: {},
            tableData: [],
            buttonList:[
                {
                    name:'返回',    //按钮名称
                    type:true,    //是否为主按钮-可不传
                    emitType:'goBack'    //方法
                },
            ],
            loading: true
        };
    },
    created (){
        this.getMoreMaList('receive_arrival_notice_status','receive_arrival_notice_source_type');
    },
    activated (){
        if (localStorage.ArrivaldetailFlag == '1'){
            this.getMoreMaList('receive_arrival_notice_status','receive_arrival_notice_source_type');
            localStorage.ArrivaldetailFlag = '2';
        }
    },
    methods: {
        search (){
            let params = {
                sourceId: this.$route.query.sourceId
            }
            this.$api.Warehousing.getArrivalDetail(params).then(res=>{
                this.loading = false;
                if (res.errorCode === '100200'){
                    this.tableData = res.data.receiveGoodDetails;
                    this.detailData = res.data.receiveArrivalNotice
                }
            })
        },
        //tab切换事件
        handleClick(val){

        }
    },
    computed: {}
};
</script>
