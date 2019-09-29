<template>
  <div class="client-info-detail">
    <V-Title title="客户详细信息"></V-Title>
    <div class="information">
      <div class="p-20 section-cont yy-detail">
        <div class="section-item">
          <div class="cont-item">
            <div class="label tr">客户编码：</div>
            <div class="value" v-text="dataDict.customerCode"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">客户中文名：</div>
            <div class="value" v-text="dataDict.chineseName"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">客户英文名：</div>
            <div class="value" v-text="dataDict.englishName"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">客户状态：</div>
            <div class="value">{{dataDict.status==="1"?'启用':'停用'}}</div>
          </div>
        </div>
        <div class="section-item">
          <div class="cont-item">
            <div class="label tr">所在地区：</div>
            <div class="value" v-text="dataDict.provincial+'/'+dataDict.city+'/'+dataDict.district"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">客户ID：</div>
            <div class="value" v-text="dataDict.customerAppId"></div>
          </div>
          <div class="cont-item" style="width:50%">
            <div class="label tr" style="width:130px">客户秘钥：</div>
            <div class="value" v-text="dataDict.customerSecretKey"></div>
          </div>
        </div>
        <div class="section-item">
          <div class="cont-item">
            <div class="label tr">详细地址：</div>
            <div class="value" v-text="dataDict.address"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">销退质检方式：</div>
            <div class="value" v-text="dataDict.cancellationRefundName"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">联系人：</div>
            <div class="value" v-text="dataDict.contacts"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">联系方式：</div>
            <div class="value" v-text="dataDict.contactWay"></div>
          </div>
        </div>
        <div class="section-item">
          <div class="cont-item">
            <div class="label tr">新添人：</div>
            <div class="value" v-text="dataDict.createBy"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">新添时间：</div>
            <div class="value" v-text="dataDict.createTime"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">最后修改人：</div>
            <div class="value" v-text="dataDict.lastUpdateBy"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">修改时间：</div>
            <div class="value" v-text="dataDict.lastUpdateTime"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="shelfTableBlock">
      <div class="title">
        <strong>货主信息</strong>
      </div>
      <div class="tableClass clearfix">
        <V-Table :dataSource="dataSource" class="mt-10 fl table-main"></V-Table>
      </div>
      <V-BottomBtn  @toBack="toBack"></V-BottomBtn>
    </div>
  </div>
</template>
<script>
import { shipperInfoTable } from './cols'
export default {
  name: 'UserManage_ClientInfoDetail',
  data() {
    return {
      dataDict: {},
      noBack: true,   // 为true时不需要返回按钮
      dataSource: {
        data: [], // 表格数据
        cols: shipperInfoTable, // 表格的列数据
        isSelection: false, // 表格有多选时设置
        isOperation: false, // 表格有操作列时设置
      },
      fromData:{
        address: "string",    //详细地址
        cancellationRefundCode: "string", //销退质检方式代码
        cancellationRefundName: "string", //销退质检方式名称
        chineseName: "string",  //中文名称
        city: "string", //市
        contactWay: "string", //联系方式
        contacts: "string",   //联系人
        customerCode: "string",   //客户编码
        district: "string",   //区
        englishName: "string",  //英文名称
        id: 0,  //主键
        provincial: "string", //省
        status: "string", //客户状态 0：正常 1：作废
      },
      id:'',
    };
  },
  methods: {
    getclientInfo(){  //获取客户信息
      let id = this.id
      this.$api.UserManage.getCustomerDetail(id).then(res=>{
        if (res.errorCode == '100200'){
          this.dataDict = res.data
          this.dataSource.data = res.data.shipperInfoList
        }else{
          this.$utils.commonUtils.tip(res.msg,'error')
        }
      })
    },
    // 返回
    toBack() {
      // this.$router.push('/BasicConfiguration/CodeTable')
    },
  },
  created(){
  },
  activated() {
    this.id = this.$route.query.id
    this.getclientInfo()
  }
}
</script>
<style lang='scss' >
.client-info-detail{
  .section-item{
    .cont-item{
      width: 24%;
      .label {width:130px}
    }
  }
  
  .shelfTableBlock{
    .tableClass{padding:0 20px;
      .addbtn{
        background: none;
        border: none;
        color: #2A8BFF;
        font-size: 12px;
        margin-top: 10px;
        cursor: pointer;
      }
      .table-main{width: 100%;}
    }
    .title{
      border-bottom:1px solid #DCDFE6;
      padding-bottom: 10px;
      strong{
        margin-left: 20px;
        color: #3095FB;
        font-size: 14px;
        position: relative;
      }
      strong:after{
        position: absolute;
		    content: '';
		    width: 100%;
		    height: 3px;
		    top: 28px;
		    background: #2A8BFF;
        border-radius: 1.5px;
		    left: 0;
      }
    }

  }
}

</style>
