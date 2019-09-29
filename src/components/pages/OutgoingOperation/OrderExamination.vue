<template>
  <div class="container AdjustmentWarehouse">
    <div class="header-container base-container">
      <V-Title title="按单复核">
        <!-- <div class="title-bar-icon" @click="dialogVisibleSet=true">
          <i class="iconfont iconcanshupeizhi"></i>&nbsp;参数配置
        </div>-->
      </V-Title>
    </div>
    <div class="table-container m-20">
      <div class="containerLeft">
        <div class="headerInfo">
         <div class="">
            <div>
              <el-input
              clearable
              ref="input1"
              v-model.trim="queryOption.packageNum"
              @keydown.native="scanEnter"
              class="inputw  mr-10"
              placeholder="请扫描包裹号"
            ></el-input>
           </div>
           <div class="pt-20">
          <el-input
            clearable
            ref="input2"
            v-model.trim="queryOption.sku"
            @keydown.native="scanSku"
            class="inputw"
            placeholder="请扫描商品条码"
          ></el-input>
         </div>
          </div>

          <div class="productInfo">
            <div class="mr-30">
              <span>运单号：</span>
              <span v-text="waybillNum"></span>
            </div>
            <div>
              <span>物流渠道：</span>
              <span v-text="mailingMethod"></span>
            </div>
        </div>
        </div>
        <div class="table-operation">
          <div class="title">复核列表</div>
        </div>
        <!-- 引入表格公共组件 START -->
        <V-Table :dataSource="dataSource">
          <template slot-scope="scopes" slot="img">
            <img width="80" :src="scopes.scope.row.img"/>
          </template>
          <template slot-scope="scopes" slot="unchenckedNumber">
            <span v-text="scopes.scope.row.pickingNum-scopes.scope.row.reviewNum"></span>
          </template>
        </V-Table>
        <!-- 引入表格公共组件 END -->
      </div>
      <div class="containerRight">
        <div class="selectBox mb-20">
          <el-select v-model="printDefault" placeholder="选择打印机">
            <el-option
              v-for="(item,index) in printList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <!-- <el-select v-model="selectValue" placeholder="选择质检台" class="selectchange">
            <el-option
              v-for="(item,index) in qualityInspectionLIist"
              :key="index"
              :label="item.dataName"
              :value="item.dataCode"
            ></el-option>
          </el-select>-->
        </div>
        <div class="workstatus">
          <div v-if="dataSource.data.length==0" class="tip waiting">
            <img src="../../../assets/img/review_waiting.png" alt />
            <span>等待进入工作状态</span>
          </div>
          <div v-if="isChecking && dataSource.data.length>0" class="tip checking">
            <img src="../../../assets/img/reviewing.png" alt />
            <span>复核进行中</span>
          </div>
          <div v-if="!isChecking && dataSource.data.length>0 " class="tip complete">
            <img src="../../../assets/img/review_complete.png" alt />
            <span>复核完成</span>
          </div>
        </div>
        <div class="workBtn mt-20">
          <el-button class="btn" @click="reviewMultipleComplete">
            <span class="icon iconfont"></span> 复核完成
          </el-button>
           <el-button class="btn"  @click="goToReprint">补打印</el-button>
          <!-- <el-button class="btn" :disabled="dataSource.data.length ===0 || (!isChecking && dataSource.data.length>0)"  @click="abnormalReport">
            <span class="icon iconfont"></span> 异常上报
          </el-button> -->
          <div class="mt-20">
            <!-- 第一版先不做！！！！！！！！！！！！ -->
            <!-- <el-button class="btn">撤销 F3</el-button> -->
            <!-- <el-button class="btn"  @click="goToReprint">补打印</el-button> -->
          </div>
        </div>
      </div>
    </div>
    <!-- 提示弹窗 -->
    <V-TipDialog :showtoast="showtoast" :content="content" @changeShowtoast="changeShowtoast" />
    <!-- 异常弹窗 -->
    <V-AbnormalDialog
      :dialogVisible="dialogVisible"
     :data="this.cancatList"
      :sowingType= 'M'
      @changeVisible="changeVisible"
    />
    <V-AbnormalDialogMtlpAuto
      :dialogVisible="dialogVisibleAuto"
      @changeVisibleAuto="changeVisibleAuto"
      :dataCopy="this.abnormalList"
      :data="this.cancatList"
      :sowingType= 'M'
    />
  </div>
</template>

<script>
import { orderReviewCols } from "./cols";
import VTipDialog from "./common/TipDialog";
import VAbnormalDialog from "./common/AbnormalDialog";
import VAbnormalDialogAuto from "./common/AbnormalDialogAuto";
import VAbnormalDialogMtlpAuto from "./common/AbnormalDialogMtlpAuto";
import { getLodop } from "plugin/LodopFuncs.js";
export default {
  name: "OutgoingOperation_OrderExamination",
  data() {
    return {
      showtoast: false, // 提示弹窗
      dialogVisible: false, //异常上报弹窗
      dialogVisibleSet: true, // 质检台弹窗
      dialogVisibleAuto: false, // 异常上报多次弹窗
      isChecking: false, // 是否正在复核中
      waybillNum: "", // 运单号
      mailingMethod: "", // 物流渠道
      selectValue: "", // 下拉框选中的值
      dataSource: {
        data: [], // 表格数据
        cols: orderReviewCols, // 表格的列数据
        isIndex: true,
        autoHeight: true
      },
      PageNum: 1, //页码
      PageSize: 10, //行数
      total: null, //总页数
      queryOption: {
        packageNum: "",
        sku: "",
        abnormalLocation: ""
      },
      content: "", // 提示框的动态内容
      abnormalList: [], // 异常的数组
      skuImgList: [], // sku图片数组
      M: 'M',
      printUrlList: [], // 打印面单数组
      cancatList: [], // 合并相同包裹号和SKU的数据为同一条数据 

    };
  },
  created() {
    this.getWareHouse(); // 仓库数据
    this.getPrintList();
  },
  activated() {
    this.$refs.input1.focus();
  },
  methods: {
    search() {},
    afterScan() {
      this.getMultipleOrderList();
    },
    // 扫描SKU后
    doneScan() {
      this._isOrderCancel(this.dataSource.data, this.queryOption.sku); // 是否是订单取消 弹窗提示
      this.queryOption.abnormalLocation = this._findAbnormalLocation(this.queryOption.sku); // 找出货位号
      if(this.queryOption.abnormalLocation) { // 找到货位号才复核
        this.reviewSubmit();
      }
    },
    // 扫描SKU
    scanSku(e) {
      if (e.which == 13) {
        e.target.select();
        this.doneScan(); //你的组件里需要有这个方法，相当于扫码成功后的回调
      }
    },
    // 按单复核操作列表扫描包裹号  获取复核列表
    async getMultipleOrderList() {
      if(!this.queryOption.packageNum) return
      const {
        errorCode,
        data
      } = await this.$api.OutgoingOperation.getMultipleOrderList({
        packageNum: this.queryOption.packageNum
      });
      if (errorCode === "100200") {

        let result = this.$utils.module.mergeArr(data); // 把数组对象中的重复项合并成一个数组 不重复的一个数组
        this.cancatList = this._cancatData(result); // 合并相同包裹号和SKU的数据为同一条数据

        this.dataSource.data = data;
        this._isDifferenceMark(this.cancatList); // 是否是拣货差异单 弹窗提示
        if (data.length > 0) {
          this.waybillNum = data[0].waybillNum;
          this.mailingMethod = data[0].mailingMethod;
        }
        let sku =  this._findAllSku(data)
        this.getSkuImg(sku)
        this.$refs.input2.focus();
        this.isChecking = this._isChecking(this.dataSource.data); // 是否正在复核中
        this._isOrderCancel(this.dataSource.data); // 是否订单取消
        let isAbnormalComplete = this._isAbnormalComplete();
        if(!isAbnormalComplete) { // 全部正常复核完成情况 可以打印面单 以包裹维度打印 就一个面单
         this.getPrintData(data[0].printUrl) // 获取打印面单URL
        }
      }
    },
    // 单品复核数据提交 & 多品复核数据提交 [包裹号 + sku] [退供 + 调拨 单品也可以使用]
    async reviewSubmit() {
      const {
        errorCode,
        data
      } = await this.$api.OutgoingOperation.reviewSubmit("M", this.queryOption);
      if (errorCode === "100200") {
        this.getMultipleOrderList();
      }
    },
    // 多品复核完成
    async reviewMultipleComplete() {
      if(!this.queryOption.packageNum) return
      this._isDiff();
      if(this.abnormalList.length>0) { // 有异常
          // 交给异常弹窗那边触发 弹窗完次数后调用
      }else{ // 无异常
        this.reviewComplete()
      }
    },
    // 多品复核正式调用
    async reviewComplete() {
      const {
        errorCode,
        data
      } = await this.$api.OutgoingOperation.reviewMultipleComplete(
        this.queryOption.packageNum
      );
      if (errorCode === "100200") {
        this.$utils.commonUtils.tip("复核完成", "success");
        Object.assign(this.$data,this.$options.data())
      }
    },
     // 查找SKU图片信息
    async getSkuImg(sku) {
      if(!sku)return
      const {
        errorCode,
        data
      } = await this.$api.OutgoingOperation.getSkuImg(
        {skuList:sku}
      );
      if (errorCode === "100200") {
        console.log(data,'data12345678');
        this.skuImgList = data;
        this.skuImgList.forEach(item => {
          this.dataSource.data.forEach( val => {
            if(item.productSku == val.sku) {
               this.$set(val,'img',item.productPictures) 
            }
          })
        })
       console.log(this.dataSource.data,'this.dataSource.data');
        
      }
    },
   // 获取面单信息数组数据
    async getPrintData(url) {
      if(url) {
       this.printUrlList = url.split(';')
       this.printInfo()
      }
    },
    // 打印面单 
    async printInfo() {
      for await (const item of this.printUrlList) {
        this.printEveryItem(item)
      }
    },
    // 打印每项
     printEveryItem(item) {
      let self = this;
      let LODOP = getLodop(); //调用getLodop获取LODOP对象
      return new Promise(function (resolve) {
        setTimeout(() => {
         LODOP.PRINT_INIT("");
         let strStyleCSS = `<style type='text/css' rel='stylesheet'>.img1{display:block;margin:10px;width:360;height:360}</style>`
         let html = `<head>${strStyleCSS}</head><body><div class='print-card'>
                <img src=${item} class='img1' />
            </div><body>`
         LODOP.ADD_PRINT_HTM(0,0,380,380,html);
         LODOP.SET_PRINT_PAGESIZE(1,1000,1000,"");   
         LODOP.PRINT();
        }, 1000);
      });
    },
     // 去往补打印页面
    goToReprint() {
      this.$router.push('/OutgoingOperation/ReplenishPrint')
    },
    // 是否正在复核中
    _isChecking(arr) {
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        if (element.pickingNum != element.reviewNum && element.packageException == 'N') {
          return true;
        }
      }
    },
    // 查找是否有 订单取消的单(orderStatus == '9')
    _isOrderCancel(arr, sku) {
      for (let index = 0; index < arr.length; index++) {
        const item = arr[index];
        if (item.sku == sku && item.orderStatus == "9") {
          this.showtoast = true;
          this.content = `包裹号：${item.packageNum} 已经被拦截！请将商品放入异常箱`;
          break;
        }
      }
    }, 
    // 查找是否有 拣货差异的单 按包裹查
    _isDifferenceMark(arr) {
      for (let index = 0; index < arr.length; index++) {
        const item = arr[index];
        if (item.pickingDifferenceMark == "2") {
          this.showtoast = true;
          this.content = `包裹号：${item.packageNum} 已经拣货差异！请将商品放入异常箱`;
        }
      }
    },
    // 强制复核完成 先查找是否有未检异常那些
    _isDiff() {
      this.abnormalList = [];
      this.cancatList.forEach(item => {
        if (item.reviewNum !== item.pickingNum && item.packageException == 'N') {
          this.dialogVisibleAuto = true;
          this.abnormalList.push(item); // 不取异常的数据了 直接全部给过去异常上报
        }
      });
    },
    // 查找出列表所有sku组成字符串数组
    _findAllSku(arr) {
      let strArr = []
      arr.forEach( item => {
        strArr.push(item.sku)
      })
      return strArr.join(',')
    },
    // 查找sku 所属货位号
    _findAbnormalLocation(sku) {
      for (let index = 0; index < this.dataSource.data.length; index++) {
        const item = this.dataSource.data[index];
        if (sku == item.sku && item.packageException == 'N' && item.taskStatus == 'N' && item.pickingDifferenceMark != "2") {
          return item.abnormalLocation; // 返回所属货位号
        }
      }
    },
    // 是否没有正常全部复核完成 用来打印面单前置条件
    _isAbnormalComplete() {
       for (let index = 0; index < this.dataSource.data.length; index++) {
        const item = this.dataSource.data[index];
        if (item.pickingNum != item.reviewNum) {
          return true
        }
      }
    },
     // 合并相同包裹号和SKU的数据为同一条数据 
    _cancatData(result) {
       let arr = []
        result.forEach(item=>{
        if (item.length>1){
          let pickingNum = 0, reviewNum = 0, differenceNum = 0, differenceMark = '1', cancelMark = '1', packageException = 'N';
          let obj;
          item.forEach(val=>{
            pickingNum += val.pickingNum;
            reviewNum += val.reviewNum;
            differenceNum += val.differenceNum;
            packageException = val.packageException == 'Y'? 'Y': 'N';
            obj = Object.assign({},val)
          })
          arr.push(Object.assign(obj,{pickingNum,reviewNum,differenceNum,differenceMark,cancelMark}))
        } else{
          arr.push(item[0])
        }
       })
       console.log(arr,'arr999');
       return arr;
    },
    // 点击异常上报
    abnormalReport() {
      this.dialogVisible = true;
    },
    // 子组件的自定义事件 子组件的取消按钮
    changeVisible(val) {
      this.dialogVisible = val;
    },
    changeVisibleAuto(val) {
      this.dialogVisibleAuto = val;
    },
    // 子组件的自定义事件 子组件的取消按钮
    changeShowtoast(val) {
      this.showtoast = val;
    }
  },
  components: {
    VTipDialog,
    VAbnormalDialog,
    VAbnormalDialogAuto,
    VAbnormalDialogMtlpAuto
  }
};
</script>
<style lang="scss" scoped>
</style>

