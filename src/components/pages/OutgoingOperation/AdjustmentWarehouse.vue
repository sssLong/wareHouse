<template>
  <div class="container AdjustmentWarehouse">
    <div class="header-container base-container">
      <V-Title title="调拨出库"></V-Title>
    </div>
    <div class="table-container m-20">
      <div class="containerLeft">
        <div class="headerInfo">
         <div class="">
            <div>
              <el-input
              clearable
              ref="input1"
              v-model.trim="queryOption.crateNum"
              @keydown.native="scanEnter"
              class="inputw  mr-10"
              placeholder="请扫描周转箱号"
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
        <V-Table :dataSource="dataSource" @review="handleReview">
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
            <el-option value="item.value">123123</el-option>
            <el-option value="item.value">123123</el-option>
          </el-select> -->
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
          <el-button class="btn" @click="goToReprint">补打印</el-button>

          <!-- <el-button class="btn" :disabled="dataSource.data.length ===0 || dataSource.data[0].reviewStatus == '3'"  @click="abnormalReport">
            <span class="icon iconfont"></span> 异常上报
          </el-button> -->
          <div class="mt-20">
            <!-- 第一版先不做！！！！！！！！！！！！ -->
            <!-- <el-button class="btn">撤销 F3</el-button> -->
            <!-- <el-button class="btn" @click="goToReprint">补打印</el-button> -->
          </div>
        </div>
      </div>
    </div>
      <!-- 提示弹窗 -->
    <V-TipDialog :showtoast="showtoast" :content="content" @changeShowtoast="changeShowtoast" />
    <!-- 异常弹窗 -->
    <V-AbnormalDialog
      :dialogVisible="dialogVisible"
      @changeVisible="changeVisible"
      :data="this.cancatList"
      :sowingType= 'A'
    />
    <V-AbnormalDialogMtlpAuto
      :dialogVisible="dialogVisibleAuto"
      @changeVisibleAuto="changeVisibleAuto"
      :dataCopy="this.abnormalList"
      :data="this.cancatList"
      :sowingType= 'A'
    />
  </div>
</template>

<script>
import { orderReviewCols } from "./cols";
import VTipDialog from "./common/TipDialog";
import VAbnormalDialog from "./common/AbnormalDialog";
import VAbnormalDialogAuto from "./common/AbnormalDialogAuto";
import VAbnormalDialogMtlpAuto from "./common/AbnormalDialogMtlpAuto";

export default {
  name: "OutgoingOperation_OrderExamination",
  data() {
    return {
      showtoast: false, // 提示弹窗
      dialogVisible: false, //异常上报弹窗
      dialogVisibleAuto: false, // 异常上报多次弹窗
      isChecking: false, // 是否正在复核中
      waybillNum: "", // 运单号
      mailingMethod: "", // 物流渠道
      BarCode: "123123", //商品条码
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
        crateNum: "",
        sku: ""
      },
       content: "", // 提示框的动态内容
      abnormalList: [], // 异常的数组
      A: 'A',
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
      this.findAllocateList();
    },
    // 扫描SKU 后
    doneScan() {
      this.queryOption.packageNum = this._findPackageNum(this.queryOption.sku); // 找出包裹号
      this.queryOption.abnormalLocation = this._findAbnormalLocation(this.queryOption.sku); // 找出货位号
      this._isOrderCancel(this.dataSource.data, this.queryOption.sku); // 是否是订单取消 弹窗提示
      this._isDifferenceMark(this.dataSource.data); // 是否是拣货差异单 弹窗提示
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
    // 调拨出库 操作列表扫描周转箱  获取复核列表
    async findAllocateList() {
      if(!this.queryOption.crateNum) return
      let params = {crateNum: this.queryOption.crateNum}
      const {
        errorCode,
        data
      } = await this.$api.OutgoingOperation.findAllocateList(
       params
      );
      if (errorCode === "100200") {

         let result = this.$utils.module.mergeArr(data); // 把数组对象中的重复项合并成一个数组 不重复的一个数组
         this.cancatList = this._cancatData(result); // 合并相同包裹号和SKU的数据为同一条数据

        this.dataSource.data = data;
        this._isDifferenceMark(this.cancatList); // 是否是拣货差异单 弹窗提示
        this.waybillNum = data[0].waybillNum;
        this.mailingMethod = data[0].mailingMethod;
        this.queryOption.packageNum = data[0].packageNum
        this.$refs.input2.focus();
        this.isChecking = this._isChecking(this.dataSource.data); // 是否正在复核中
        this._isOrderCancel(this.dataSource.data);
         let sku =  this._findAllSku(data)
        this.getSkuImg(sku)
      }
    },
    // 单品复核数据提交 & 多品复核数据提交 [包裹号 + sku] [退供 + 调拨 单品也可以使用]
    async reviewSubmit() {
      let params = {packageNum: this.queryOption.packageNum, sku: this.queryOption.sku,"abnormalLocation": this.queryOption.abnormalLocation}
      const {
        errorCode,
        data
      } = await this.$api.OutgoingOperation.reviewSubmit("A", params);
      if (errorCode === "100200") {
        this.findAllocateList();
      }
    },
    // 调拨出库 多品复核完成
    async reviewMultipleComplete() {
      if(!this.queryOption.packageNum) return
      this._isDiff();
      if(this.abnormalList.length>0) { // 有异常
          // 交给异常弹窗那边触发 弹窗完次数后调用
      }else{ // 无异常
        this.reviewComplete()
      }
    },
    // 调拨出库复核完成正式调用
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
    // 去往补打印页面
    goToReprint() {
      this.$router.push('/OutgoingOperation/ReplenishPrint')
    },
      // 查找出列表所有sku组成字符串数组
    _findAllSku(arr) {
      let strArr = []
      arr.forEach( item => {
        strArr.push(item.sku)
      })
      return strArr.join(',')
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
     // 查找sku 所属包裹号
    _findPackageNum(sku) {
      for (let index = 0; index < this.dataSource.data.length; index++) {
        const item = this.dataSource.data[index];
      if (sku == item.sku && item.packageException == 'N' && item.taskStatus == 'N' && item.pickingDifferenceMark != "2") {
          return item.packageNum; // 返回所属包裹号
        }
      }
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
      // 查找是否有 订单取消的单(orderStatus == '9')
    _isOrderCancel(arr, sku) {
      for (let index = 0; index < arr.length; index++) {
        // debugger
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
    // 查看
    handleReview(index, row) {
      console.log(index, row, "查看");
      this.$router.push("/ReturnDetails");
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

