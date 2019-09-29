<template>
  <div class="container multipleSowingBox">
    <div class="header-container base-container">
      <V-Title title="多品播种页面"></V-Title>
      <div class="condition el-col-24">
        <div class="info el-col-12">
          <label>
            <span>拣货单号：</span>
            <span v-text="SowingData.pickingNum"></span>
          </label>
          <label>
            <span>包裹总数：</span>
            <span v-text="dataSource.data.length"></span>
          </label>
          <label>
            <span>操作员：</span>
            <span v-text="SowingData.userName"></span>
          </label>
          <div class="infoInputVal mt-20">
            <el-input
              clearable
              @clear="clearInputContent"
              ref="input1"
              @keydown.native="scanEnter"
              v-model.trim="queryOption.sku"
              placeholder="请扫描商品条码"
            ></el-input>
          </div>
          <div class="commodityInfo mt-10">
            <div class="commodityText">
              <p>
                <span>SKU：</span>
                <span v-text="form.productSku"></span>
              </p>
              <p>
                <span>商品名称：</span>
                <span v-text="form.productName"></span>
              </p>
              <p>
                <span>商品属性：</span>
                <span v-text="form.productAttribute"></span>
              </p>
            </div>
            <div class="commodityImg" v-if="form.productPictures">
              <img :src="form.productPictures" />
            </div>
          </div>
          <div class="commodityNumber">
            <span>播种位</span>
            <span v-text="queryOption.index"></span>
          </div>
          <div class="commodityRoom mt-25">
            <p class="title mb-10">播种位列表</p>
            <ul class="commodityUl">
              <li
                v-for="(item,key) in dataSource.data"
                :key="key"
                :class="{'success':item.sowingStatus == 2 && item.nSow === 0,
                'course':item.sowingStatus == 3 && item.nSow > 0 && item.ySow > 0,
                'orange':item.sowingStatus == 1 && item.ySow == 0,
                '':item.sowingStatus == 0 && item.ySow == 0}"
              >
                <p class="number">{{item.index}}</p>
                <div class="ststus">
                  <div class="green" v-if="item.sowingStatus == 2">
                    <span class="icon">
                      <i class="el-icon-check"></i>
                    </span>
                    <span class="number">{{item.ySow + '/' + item.nSow }}</span>
                  </div>
                  <div class="blue" v-if="item.sowingStatus == 3">
                    <span class="icon">
                      <i class="el-icon-check"></i>
                    </span>
                    <span class="number">{{item.ySow + '/' + item.nSow }}</span>
                  </div>
                </div>
              </li>
            </ul>
            <div class="tips mt-10">
              <label>
                <span class="null colorBlock"></span>
                <span>空容器</span>
              </label>
              <label>
                <span class="orange colorBlock"></span>
                <span>当前商品需要存放的容器</span>
              </label>
              <label>
                <span class="bule colorBlock"></span>
                <span>播种中</span>
              </label>
              <label>
                <span class="success colorBlock">
                  <i class="el-icon-check"></i>
                </span>
                <span>播种完成</span>
              </label>
            </div>
          </div>
        </div>
        <div class="operate el-col-12">
          <el-select
            v-model="selectState"
            clearable
            @clear="getSowingPlaceList"
            placeholder="选择播种状态"
            @change="getSowingPlaceList"
          >
            <el-option label="待播种" value="N"></el-option>
            <el-option label="播种完成" value="Y"></el-option>
          </el-select>
          <el-select v-model="printDefault" placeholder="选择打印机" clearable filterable>
            <el-option
              v-for="(item,index) in printList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button
            type="primary"
            size="mini"
            class="submitBtn"
            @click="updateDifferencesSowing"
          >播种完成</el-button>
          <div class="table-container ml-0">
            <div class="table-operation">
              <div class="title">播种列表</div>
              <div class="operation">
                <div @click="print">
                  <i class="iconfont icondayinji"></i>
                  <span>打印</span>
                </div>
              </div>
            </div>

            <!-- 引入表格公共组件 START -->
            <V-Table
              :dataSource="dataSource"
              @selection-change="handleSelectionChange"
              @review="handleReview"
            >
              <!-- slot 自定义列的情况 -->
              <template
                slot-scope="scopes"
                slot="status"
              >{{scopes.scope.row.status === 'Y' ? '完成' : '未完成'}}</template>
              <template
                slot-scope="scopes"
                slot="nSow_ySow"
              >{{scopes.scope.row.ySow + '/' + scopes.scope.row.nSow }}</template>
            </V-Table>
            <!-- 引入表格公共组件 END -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MultipleSowingInfo } from "./cols";
import _ from "lodash";
import { getLodop } from "plugin/LodopFuncs.js";
export default {
  name: "OutgoingOperation_MultipleSowingInfo",
  data() {
    return {
      selectState: "", // 下拉框选中的播种
      selectValue: "", // 下拉框选中的值
      dataSource: {
        data: [], // 表格数据
        cols: MultipleSowingInfo, // 表格的列数据
        isSelection: true, // 表格有多选时设置
        isOperation: true, // 表格有操作列时设置
        operation: {
          // 表格有操作列时设置
          label: "操作", // 列名
          width: "70", // 根据实际情况给宽度
          data: [
            {
              label: "打印", // 操作名称
              emitType: "review", // 触发父组件
              permission: "播种页面打印" // 后期这个操作的权限，用来控制权限
            }
          ]
        }
      },
      multipleSelection: [],
      commoditylistData: [], //播种为列表
      queryOption: {
        sku: "",
        index: "", // 播种位
        packageNum: "",
        pickingNum: ""
      },
      // 商品信息
      form: {
        productSku: "",
        productName: "",
        productAttribute: "",
        productLwh: "",
        productPictures: ""
      },
      // 父页面过来的数据
      SowingData: {
        pickingNum: "",
        packageNumber: "",
        userName: ""
      }
    };
  },
  activated() {
    if (JSON.parse(localStorage.getItem("sowingList"))) {
      this.SowingData = JSON.parse(localStorage.getItem("sowingList"))[0];
    }
    console.log(this.SowingData,'this.SowingData');
    
    if(this.SowingData) {
      this.queryOption.pickingNum =  this.SowingData.pickingNum; // 拣货单号

    }
    this.getPrintList();
    this.$refs.input1.focus();
    this.getSowingPlaceList()
  },
  methods: {
    search() {},
    // 强制清空输入框的值
    clearInputContent() {
      this.queryOption.sku = '';
    },
    // 获取商品信息
    async getProductInfo() {
       if(!this.queryOption.sku) return
      let params = { sku: this.queryOption.sku };
      const {
        errorCode,
        data
      } = await this.$api.OutgoingOperation.getProductInfo(params);
      if (errorCode === "100200") {
        if(data.length>0) {
            this.form = data[0];
        }
        
      }
    },
    afterScan() {
      this.getProductInfo();
      if(this._isIn(this.queryOption.sku)){ // 扫描的sku在播种位列表中才可以请求
        this.updateSowing("Y"); // Y为扫描 N为打印
      }else{
      }
      this.queryOption.index =
        (this._findSowingPlace(this.queryOption.sku) || "") + "";
    },
    // 根据拣货单ID查询播种信息
    async getSowingPlaceList() {
      if(!this.queryOption.pickingNum) return
      let params = { status: this.selectState };
      const {
        errorCode,
        data
      } = await this.$api.OutgoingOperation.getSowingPlaceList(
        this.queryOption.pickingNum,
        params
      );
      if (errorCode === "100200") {
        this.dataSource.data = this._handleAarray(data);
        console.log(this.dataSource.data, "this.dataSource.data");
      }
    },
    // 播种扫描SKU是此订单, 调用此方法修改次数,扫一次提交一次
    async updateSowing(type) {
      const {
        errorCode,
        data
      } = await this.$api.OutgoingOperation.updateSowing(
        type,
        this.queryOption
      );
      if (errorCode === "100200") {
      }
      this.getSowingPlaceList();

    },
    // 播种差异的。全部提交 ; 没差异的不用提交!
    async updateDifferencesSowing() {
      let arr = this.dataSource.data.filter(item => {
        return item.nSow > 0;
      });
      if(arr.length === 0) return false;
      console.log(arr, "arr");

      const {
        errorCode,
        data
      } = await this.$api.OutgoingOperation.updateDifferencesSowing(
        this.queryOption.pickingNum,
        arr
      );
      if (errorCode === "100200") {
        this.$utils.commonUtils.tip("播种完成", "success");
        this.print(this.dataSource.data)
      }
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 单个打印
    handleReview(index, row) {
      this.print(row)
    },
    // 打印
    async print(row) {
      let LODOP = getLodop(); //调用getLodop获取LODOP对象
      let width = this.$utils.commonUtils.mmConversionPx(70);
      let height = this.$utils.commonUtils.mmConversionPx(20);
      
      // 点击播种完成的时候 打印所有
      if(_.isArray(row)) {
         for await(let item of row) {
           this.printEveryItem(item,width,height);
        }
        return
      }
      if(this.multipleSelection.length == 0 && !row.index && !_.isArray(row)) {
        this.$utils.commonUtils.tip('请选择','warning')
        return
      }
     
    
      if(row.index){
        await this.printEveryItem(row,width,height);
      }else{
         for await(let item of this.multipleSelection) {
           this.printEveryItem(item,width,height);
        }
      }
    
    },
    printEveryItem(item,width,height) {
      let self = this;
      return new Promise(function (resolve) {
        setTimeout(() => {
            self.printAction(width,height,item);
        }, 1000);

      });
    },
    printAction(width, height, item) {
       this.queryOption.packageNum = item.packageNum
       this.updateSowing("N"); // Y为扫描 N为打印
      let left = (width - 250) / 2 + "px";
      LODOP.SET_PRINT_PAGESIZE(1, 700, 200, "");
      LODOP.ADD_PRINT_BARCODE(25, left, 250, 32, "128B", item.packageNum);
      LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
      let strStyleCSS = `<style type='text/css' rel='stylesheet'>.sku-name{height:16px;line-height:16px;text-align:center;font-size:12px;}.print-main{width:${width}px;font-size:12px;}.qc-table{float:left;margin-left:10px;}.qc-name{float:right;margin-right:40px;margin-top:-14px}</style>`;
      let html = `<head>${strStyleCSS}</head><body>
                <div class='sku-name'>${item.packageNum}</div>
                <div class='print-main'>
                    <div class='qc-name'>${item.index}</div>
                </div>
            <body>`;
      LODOP.ADD_PRINT_HTM(58, 0, width, height, html);
      LODOP.SET_PRINTER_INDEX(this.printDefault);
      // LODOP.PREVIEW()
      LODOP.PRINT();
    },
    // 处理回显数据
    _handleAarray(arr) {
      arr.forEach((item, index) => {
        item.index = index + 1; // 播种位
        this.$set(item, "sowingStatus", 0); // 播种状态 回显那种颜色
        if (item.nSow === 0) {
          // 找到播种位后 未播数 = 0  显示播种完成 绿色
        this.$set(item, "sowingStatus", 2); 
        } else if (item.nSow > 0 && item.ySow > 0) {
          // 找到播种位后 未播数 > 0 && 已播数 > 0 显示播种中 蓝色
        this.$set(item, "sowingStatus", 3); 
        }
      });
      return arr;
    },
    // 查找sku 所属播种位显示
    _findSowingPlace(sku) {
      for (let index = 0; index < this.dataSource.data.length; index++) {
        const item = this.dataSource.data[index];
        for (let i = 0; i < item.skuData.length; i++) {
          const val = item.skuData[i];
          if (sku == val.sku && item.nSow > 0) {
            this.queryOption.packageNum = item.packageNum;
          }
          if (sku == val.sku && Number(val.number) > 0 && item.nSow > 0) {
            if (item.ySow === 0) {
              // 找到播种位后 已播数为0 显示当前商品需要存放的容器 橙色
             this.$set(item, "sowingStatus", 1); 
            }
            return item.index; // 返回播种位
          }
        }
      }
    },
    // 查看扫描的sku是否在播种列表中，在才请求接口
    _isIn(sku) {
      for (let index = 0; index < this.dataSource.data.length; index++) {
        const item = this.dataSource.data[index];
        for (let i = 0; i < item.skuData.length; i++) {
          const val = item.skuData[i];
          if (sku == val.sku && item.nSow > 0) {
            this.queryOption.packageNum = item.packageNum;
          }
          if (sku == val.sku) {
            return true; // 返回播种位
          }
        }
       }
    }
  }
};
</script>
<style scoped>
.seachInput {
  width: 180px;
}
.container .header-container .condition {
  padding-top: 0;
}
</style>

