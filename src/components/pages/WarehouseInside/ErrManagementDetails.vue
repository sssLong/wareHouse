<!--
 * @Autor: 廖佳星
 * @LastEditors: 廖佳星
 * @LastEditTime: 2019-08-24 09:48:26
 -->
<!-- 异常管理详情页  页面开发：廖佳星 样式文件 -->
<template>
  <div class="WarehouseInside">
    <div class="ErrManagementDetails">
      <!-- 组件主盒子分割线 -->
      <!-- 头部标题 -->
      <div>
        <V-Title title="异常管理详情页" style="width:100%;"></V-Title>
      </div>
      <!-- body -->
      <div class="p-20">
        <div class="fz14 fc3 fw6">异常信息</div>
        <div class="p-20 section-cont yy-detail">
          <div class="section-item">
            <div class="cont-item">
              <div class="label tr">异常单号：</div>
              <div class="value" v-text="datas.exNo"></div>
            </div>
            <!--来源类型 1-质检异常,2-上架异常,3-拣货异常,4-复核异常,5-库内异常 -->
            <div class="cont-item">
              <div class="label tr">来源类型：</div>
              <div class="value">{{datas.sourceType===0?'':getNameByMaId('err_sc_type',datas.sourceType)}}</div>
            </div>
            <div class="cont-item">
              <div class="label tr">来源单号：</div>
              <div class="value" v-text="datas.sourceNo"></div>
            </div>
            <!-- 异常原因 1-少货,2-实物破损,3-sku不符,4-多货,5-其它 -->
            <div class="cont-item">
              <div class="label tr">异常原因：</div>
              <div class="value">{{getNameByMaId('exception_reason',datas.exReason)}}</div>
            </div>
          </div>
          <div class="section-item">
            <div class="cont-item">
              <div class="label tr">客户名称：</div>
              <div class="value" v-text="datas.goodsOwner"></div>
            </div>
            <div class="cont-item">
              <div class="label tr">仓库名称：</div>
              <div class="value" v-text="datas.warehouseName"></div>
            </div>
            <div class="cont-item">
              <div class="label tr">货主名称：</div>
              <div class="value" v-text="datas.goodsSupplier"></div>
            </div>
            <div class="cont-item">
              <div class="label tr">异常货位：</div>
              <div class="value" v-text="datas.positionCode"></div>
            </div>
          </div>
          <div class="section-item">
            <div class="cont-item">
              <div class="label tr">SKU：</div>
              <div class="value" v-text="datas.goodsSku"></div>
            </div>
            <div class="cont-item">
              <div class="label tr">产品名称：</div>
              <div class="value" v-text="datas.skuName"></div>
            </div>
            <div class="cont-item">
              <div class="label tr">异常数量：</div>
              <div class="value" v-text="datas.exNumber"></div>
            </div>
            <div class="cont-item">
              <div class="label tr">运单号：</div>
              <div class="value" v-text="datas.waybillNo"></div>
            </div>
          </div>
          <div class="section-item">
             <!-- <div class="cont-item">
              <div class="label tr">异常照片：</div>
              <div class="value" v-text="datas.exPhoto"></div>
            </div> -->
            <div class="cont-item">
              <div class="label tr">上报人：</div>
              <div class="value" v-text="datas.createBy"></div>
            </div>
            <div class="cont-item">
              <div class="label tr">上报时间：</div>
              <div class="value" v-text="datas.createTime"></div>
            </div>
            <div class="cont-item">
              <div class="label tr">异常箱号：</div>
              <div class="value" v-text="datas.boxNo"></div>
            </div>
          </div>
        </div>
        <div class="fz14 fc3 fw6">异常跟进</div>
        <div class="p-20 section-cont yy-detail">
          <div class="section-item">
            <div class="cont-item">
              <div class="label tr">处理人：</div>
              <div class="value" v-text="datas.handleBy"></div>
            </div>
            <div class="cont-item">
              <div class="label tr">处理时间：</div>
              <div class="value" v-text="datas.handleTime"></div>
            </div>
            <!-- 处理方式 1-退货供应商,2-继续入库质检,3-移至异常区域,4-解冻,5-移位,6-申请报损,7-申请盘点 -->
            <div class="cont-item">
              <div class="label tr">处理方式：</div>
              <div class="value">{{datas.handleType===0?'':getNameByMaId('handle_way',datas.handleType)}}</div>
            </div>
            <div class="cont-item">
              <div class="label tr">处理数量：</div>
              <div class="value" v-text="datas.handleNumber"></div>
            </div>
          </div>
          <div class="section-item">
            <!-- 处理状态 1-待处理,2-处理中,3-处理完成 -->
            <div class="cont-item">
              <div class="label tr">处理状态：</div>
              <div class="value">{{datas.handleStatus===0?'':getNameByMaId('handle_status',datas.handleStatus)}}</div>
            </div>
            <div class="cont-item" style="width:650px;">
              <div class="label tr">处理备注：</div>
              <div class="value" v-text="datas.handleRemark"></div>
            </div>
          </div>
          <div class="section-item">
            <div class="cont-item">
              <div class="label tr">代贴条码：</div>
              <div class="value" v-text="datas.barCodeNum"></div>
            </div>
            <div class="cont-item">
              <div class="label tr">更换包装：</div>
              <div class="value" v-text="datas.packNum"></div>
            </div>
            <div class="cont-item">
              <div class="label tr">污迹清理：</div>
              <div class="value" v-text="datas.cleanNum"></div>
            </div>
            <div class="cont-item">
              <div class="label tr">撕额外标签：</div>
              <div class="value" v-text="datas.logoNum"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- 组件主盒子分割线 -->
    </div>

    <V-BottomBtn routerTO="/WarehouseInside/ErrManagement"></V-BottomBtn>
  </div>
</template>

<script>
export default {
  name:'WarehouseInside_ErrManagementDetails',
  data () {
    return {
      datas: {},
      exId: '' //异常单号
    };
  },

  methods: {
    // 查询
    search() {
      const that = this 
      let params = {
        exId: that.exId,//异常单号
      }
      that.$api.WarehouseInside.AQExInventoryID(params).then((res) => {
        that.datas = res.data
        console.log(res.data);
      }).catch((err) => {console.log(err)});
    }
  },

  created(){
    console.log(5555);
    
  },
  activated(){
    this.exId = this.$route.query.id;//盘点单号
    this.getMoreMaList('handle_status', 'handle_way', 'err_sc_type', 'exception_reason') //查询方法使用码表处方法
  },

  computed: {},
}

</script>
