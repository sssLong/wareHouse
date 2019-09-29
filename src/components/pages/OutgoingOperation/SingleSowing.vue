<template>
  <div class="container SingleSowing">
    <div class="header-container base-container mb-20">
      <V-Title title="单品复核">
        <!-- <div class="title-bar-icon" @click="dialogVisibleSet=true">
          <i class="iconfont iconcanshupeizhi"></i>&nbsp;参数配置
        </div>-->
      </V-Title>
    </div>
    <div class="table-container">
      <div class="SingleLeft mr-20">
        <div class="seachbox mb-20">
          <el-input
            class="input-number"
            placeholder="请扫描拣货任务单号"
            @keydown.native="scanEnter"
            v-model.trim="inputContent"
            clearable
            ref="input1"
          ></el-input>
          <el-input
            class="input-barcode"
            placeholder="请扫描商品条码"
            @keydown.native="scanSku"
            v-model.trim="queryOption.sku"
            clearable
            ref="input2"
          ></el-input>
        </div>
        <div class="infoshowBox">
          <div v-if="!form" class="tip">
            <img src="../../../assets/img/showtoast.png" alt />
            <span>商品信息展示区</span>
          </div>
          <div class="productInfo" v-else>
            <el-form ref="form" :model="form" label-width="100px">
              <el-form-item label="商品名称: ">
                <div v-text="form.productName"></div>
              </el-form-item>
              <el-form-item label="物流属性: ">
                <div v-text="form.logisticsAttribute"></div>
              </el-form-item>
              <el-form-item label="物流渠道: ">
                <div v-text="form.mailingMethod"></div>
              </el-form-item>
              <el-form-item label="商品属性: ">
                <div v-text="form.productAttribute"></div>
              </el-form-item>
              <el-form-item label="商品重量: ">
                <div v-text="form.productWeight"></div>
              </el-form-item>
              <el-form-item label="数量: ">
                <div v-text="form.num"></div>
              </el-form-item>
              <el-form-item label="长宽高(mm): ">
                <div>{{form.packageLength + (form.packageLength?'/':'') + form.packageWidth + (form.packageWidth?'/':'') + form.packageHeight}} </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="Singlecenter">
        <div class="SingleImg">
          <div v-if="!form" class="tip">
            <img src="../../../assets/img/showtoast.png" alt />
            <span>商品图片展示区</span>
          </div>
          <div class="productInfo" v-else>
            <img :src="form.productPictures" alt />
          </div>
        </div>
      </div>
      <div class="SingleRight">
        <div class="selectBox mb-20">
          <el-select v-model="printDefault" placeholder="选择打印机" clearable filterable>
            <el-option
              v-for="(item,index) in printList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <!-- <el-select v-model="value" placeholder="选择质检台" class="selectchange">
            <el-option value="item.value">123123</el-option>
            <el-option value="item.value">123123</el-option>
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
          <div v-if="dataSource.data.length>0 && dataSource.data[0].reviewStatus == '3'" class="tip complete">
            <img src="../../../assets/img/review_complete.png" alt />
            <span>复核完成</span>
          </div>
        </div>
        <div class="workBtn mt-20">
          <el-button class="btn" @click="reviewSingleComplete">
            <span class="icon iconfont"></span> 复核完成
          </el-button>
          <el-button class="btn" :disabled="dataSource.data.length ===0 || dataSource.data[0].reviewStatus == '3'" @click="abnormalReport">
            <span class="icon iconfont"></span> 异常上报
          </el-button>
        </div>
      </div>
    </div>
    <div class="container pl-20">
      <div class="table-container ml-0">
        <div class="table-operation">
          <div class="title">复核列表</div>
        </div>
      </div>
      <!-- 引入表格公共组件 START -->
      <V-Table :dataSource="dataSource"  @review = "handleReview" @cancel="handleCancel"></V-Table>
    </div>
    <!-- 提示弹窗 -->
    <V-TipDialog
      :showtoast="showtoast"
      :packageNum="queryOption.packageNum"
      :content="content"
      @changeShowtoast="changeShowtoast"
    />
    <!-- 异常弹窗 -->
    <V-AbnormalDialog
      :dialogVisible="dialogVisible"
      :data="this.cancatList"
      :sowingType= 'S'
      @changeVisible="changeVisible"

    />
    <V-AbnormalDialogAuto
      :dialogVisible="dialogVisibleAuto"
      @changeVisibleAuto="changeVisibleAuto"
      :dataCopy="this.abnormalList"
      :sowingType= 'S'
    />
   
    <!-- <V-Dialog
      :title="cancelTitle"
      :dialogVisible="cancelVisible"
      @changeVisible="changeCancelVisible"
    >
      <el-form label-position="right" label-width="80px" :model="cancelFormData">
        <el-form-item label="SKU">
          <el-input style="width: 240px" v-model="cancelFormData.SKU"></el-input>
        </el-form-item>
        <el-form-item label="撤销数量">
          <el-input style="width: 240px" v-model="cancelFormData.cancelNum"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelVisible=false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </V-Dialog>-->
  </div>
</template>

<script>
import axios from "axios";
import { singlesowing } from "./cols";
import VTipDialog from "./common/TipDialog";
import VAbnormalDialog from "./common/AbnormalDialog";
import VAbnormalDialogAuto from "./common/AbnormalDialogAuto";
import { getLodop } from "plugin/LodopFuncs.js";

export default {
  name: "OutgoingOperation_SingleSowing",
  data() {
    return {
      showtoast: false, // 提示弹窗
      dialogVisible: false, //异常上报弹窗
      dialogVisibleAuto: false, // 异常上报多次弹窗
      isChecking: false, // 是否正在复核中
      dialogVisibleSet: true, // 质检台弹窗
      cancelTitle: "撤销", // 撤销弹窗标题
      selectValue: "", // 打印机
      // cancelVisible: true, // 撤销弹窗
      value: "",
      inputContent: "", //拣货单号或容器编号
      PageNum: 1, //页码
      PageSize: 10, //行数
      total: null, //总页数
      cancelFormData: {
        SKU: "",
        cancelNum: ""
      }, //  撤销弹窗表格数据
      dataSource: {
        data: [], // 表格数据
        cols: singlesowing, // 表格的列数据
        isOperation: true, // 操作列
        isIndex: true,
        autoHeight: true,
        operation: {
          // 表格有操作列时设置
          label: "操作", // 列名
          width: "110", // 根据实际情况给宽度
          data: [
            {
              label: "打印", // 操作名称
              emitType: "review", // 触发父组件
              permission: "单品复核打印" // 后期这个操作的权限，用来控制权限
            }
            // 第一版先不做！！！！！！！！！！！！！！！！！
            // {
            //   label: "撤销", // 操作名称
            //   emitType: "cancel", // 触发父组件
            //   permission: "api/getlist" // 后期这个操作的权限，用来控制权限
            // }
          ]
        }
      },
      form: {
        productName: "",
        packageLength: "",
        packageWidth: "",
        packageHeight: "",
        num: ""
      },
      productInfo: {},
      queryOption: {
        sourceOrderNum: "",
        crateNum: "",
        sku: ""
      },
      abnormalList: [], // 异常的数组
      content: "", // 提示框的内容
      S:'S',
      printUrlList: [], // 打印URL面单数据
      cancatList: [], // 合并相同包裹号和SKU的数据为同一条数据 
    };
  },
  created() {
    this.getMoreMaList(
      "review_task_status",
      "differential_markers",
      "unmark",
      "exception_reason"
    );

    this.getPrintList();
  },
  activated() {
    this.$refs.input1.focus();
    this.getWareHouse(); // 仓库数据 放此处是防止页面再次进来没有调用 判断是否拣货单号 没有warehouseList数据
  },
  methods: {
    // 获取商品信息
    async getProductInfo() {
      if(!this.queryOption.sku) return
      let params = { sku: this.queryOption.sku };
      const {
        errorCode,
        data
      } = await this.$api.OutgoingOperation.getProductInfo(params);
      if (errorCode === "100200") {
        this.form = data[0];
        console.log(this._findNum(this.queryOption.sku),'this._findNum(this.queryOption.sku)');
        let num = this._findNum(this.queryOption.sku)
        let mailingMethod = this._findMailingMethod(this.queryOption.sku)
        if(num){
           this.$set(this.form,'num',num)
        }
        if(mailingMethod) {
          this.$set(this.form,'mailingMethod',mailingMethod)
        }
       
        
      }
    },
    search() {},
    afterScan() {
      // 为true 说明是拣货单 否则是容器号
      let flag = this.$utils.module.isPickingNum(
        this.inputContent,
        this.warehouseList
      );
      if (flag) {
        this.queryOption.sourceOrderNum = this.inputContent;
        this.queryOption.crateNum = "";
      } else {
        this.queryOption.crateNum = this.inputContent;
        this.queryOption.sourceOrderNum = "";
      }
      this.getSingleOrderList();
      this.queryOption.packageNum = this._findPackageNum(this.queryOption.sku);
    },
    // 单品复核操作列表扫描拣货单 / 容器号 获取单品复核列表
    async getSingleOrderList() {
      if(!this.inputContent) return
      let params = {
        sourceOrderNum: this.queryOption.sourceOrderNum,
        crateNum: this.queryOption.crateNum
      }
      const {
        errorCode,
        data
      } = await this.$api.OutgoingOperation.getSingleOrderList(
        params
      );
      if (errorCode === "100200") {
         
        let result = this.$utils.module.mergeArr(data); // 把数组对象中的重复项合并成一个数组 不重复的一个数组
        this.cancatList = this._cancatData(result); // 合并相同包裹号和SKU的数据为同一条数据 
          
        this.dataSource.data = data;
        this.$refs.input2.focus();
        console.log(this.dataSource.data, "99999999999");
        this.isChecking = this._isChecking(this.dataSource.data); // 是否正在复核中
      }
    },
    // 扫描SKU
    scanSku(e) {
      if (e.which == 13) {
        e.target.select();
        this.doneScan(); //你的组件里需要有这个方法，相当于扫码成功后的回调
      }
    },
    // 扫描SKU 后处理
    doneScan() {
      this.queryOption.packageNum = this._findPackageNum(this.queryOption.sku); // 找出包裹号
      this.queryOption.abnormalLocation = this._findAbnormalLocation(this.queryOption.sku); // 找出货位号
      this.getProductInfo();
      this.reviewSubmit();
      this._isOrderCancel(this.dataSource.data, this.queryOption.sku); // 是否是订单取消 弹窗提示
      this._isDifferenceMark(this.cancatList, this.queryOption.sku); // 是否是拣货差异单 弹窗提示
    },
    // 单品复核数据提交 & 多品复核数据提交 [包裹号 + sku] [退供 + 调拨 单品也可以使用]
    async reviewSubmit() {
      let self = this;
      if(!this.queryOption.packageNum)return
      let params = {
         "packageNum": this.queryOption.packageNum,
         "sku": this.queryOption.sku,
         "abnormalLocation": this.queryOption.abnormalLocation
      }
      const {
        errorCode,
        data
      } = await this.$api.OutgoingOperation.reviewSubmit("S", params);
      if (errorCode === "100200") {
          await self.getSingleOrderList(); 
          if(self.dataSource.data.length>0){
            let isItemComplete = self._isItemComplete(self.queryOption.sku); // 复核列表刷新成功后调用
            if(isItemComplete) { // 单项复核完成 打印面单
              let url = self._findPrintUrl(this.queryOption.sku) // 找出SKU对应面单URL
              if(url) {
                await self.getPrintData(url) // 获取面单打印数据
              }
              if(self.printUrlList.length){
               self.printInfo() // 打印面单
              }
            }
          }
      }
    },
    //单品复核完成
    async reviewSingleComplete() {
      if(!this.queryOption.sourceOrderNum) return
      this._isDiff();
      if(this.abnormalList.length>0) { // 有异常
          // 交给异常弹窗那边触发 弹窗完次数后调用
      }else{ // 无异常
        this.reviewComplete()
      }
    },
    // 单品复核完成 正式调用
    async reviewComplete() {
       const {
        errorCode,
        data
      } = await this.$api.OutgoingOperation.reviewSingleComplete(
        this.queryOption.sourceOrderNum
      );
      if (errorCode === "100200") {
        this.$utils.commonUtils.tip("复核完成", "success");
        Object.assign(this.$data,this.$options.data())
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
    // 查找sku对应的订购数 回显在商品详情中
    _findNum(sku) {
      for (let index = 0; index < this.dataSource.data.length; index++) {
        const item = this.dataSource.data[index];
        if (sku == item.sku) {
          return item.pickingNum; // 返回sku对应的订购数
        }
      }
    },
     // 查找sku对应的物流渠道 回显在商品详情中
    _findMailingMethod (sku) {
      for (let index = 0; index < this.dataSource.data.length; index++) {
        const item = this.dataSource.data[index];
        if (sku == item.sku) {
          return item.mailingMethod; // 返回所属物流渠道
        }
      }
    },
    // 查找是否有 订单取消的单(orderStatus == '9')
    _isOrderCancel(arr, sku) {
      for (let index = 0; index < arr.length; index++) {
        const item = arr[index];
        if (item.sku == sku && item.orderStatus == "9") {
          this.showtoast = true;
          this.content = `包裹号：${item.packageNum} 已经被拦截！请将商品SKU: ${item.sku} 数量 ${item.pickingNum} 放入异常箱`;
          break;
        }
      }
    },
    // 查找是否有 拣货差异的单
    _isDifferenceMark(arr, sku) {
      for (let index = 0; index < arr.length; index++) {
        const item = arr[index];
        if (item.sku == sku && item.pickingDifferenceMark == "2") {
          this.showtoast = true;
          this.content = `包裹号：${item.packageNum} 已经拣货差异！请将商品SKU: ${item.sku} 数量 ${item.pickingNum} 放入异常箱`;
        }
      }
    },
    // 强制复核完成 先查找是否有未检异常那些
    _isDiff() {
      this.abnormalList = [];
      this.cancatList.forEach(item => {
        if (item.reviewNum !== item.pickingNum && item.packageException == 'N') {
          this.dialogVisibleAuto = true;
          this.abnormalList.push(item);
        }
      });
    },
      // 查找SKU所在项正常全部复核完成的面单URL 用来打印面单前置条件
    _findPrintUrl(sku) {
       for (let index = 0; index < this.dataSource.data.length; index++) {
        const item = this.dataSource.data[index];
        if (item.sku == sku && item.pickingNum === item.reviewNum) {
          return item.printUrl
        }
      }
    },
     // 是否SKU所在项正常全部复核完成 用来打印面单前置条件
    _isItemComplete(sku) {
       for (let index = 0; index < this.dataSource.data.length; index++) {
        const item = this.dataSource.data[index];
        if (item.sku == sku && item.pickingNum === item.reviewNum) {
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
            differenceMark = val.differenceMark == '2'? '2': '1';
            cancelMark = val.cancelMark == '2'? '2': '1';
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
    },
     // 查看
    async handleReview(index,row) {
      let self = this;
      await self.getPrintData(row.printUrl) // 获取面单打印数据
      if(self.printUrlList.length){
        self.printInfo() // 打印面单
      }
    },
    //  点击撤销
    handleCancel(index, row) {
      // this.cancelVisible = true;
    },
    // 子组件的自定义事件 子组件的取消按钮
    changeCancelVisible(val) {
      // this.cancelVisible = val;
    }
    // 弹窗点击取消
  },
  components: {
    VTipDialog,
    VAbnormalDialog,
    VAbnormalDialogAuto
  }
};
</script>
<style scoped>
.seachInput {
  width: 180px;
}
</style>

