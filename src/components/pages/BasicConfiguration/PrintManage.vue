<template>
  <div class="printManage autoScrollbar" onselectstart="return false">
    <V-Title></V-Title>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="自定义" name="1"></el-tab-pane>
      <el-tab-pane label="通用标签" name="2"></el-tab-pane>
    </el-tabs>
    <div v-if="activeName==='1'" class="customContainer">
      <div class="printContainer pl-20 pr-20 pt-15">
        <div>
          <el-form label-width='80px'>
            <div class="direct">
              <div class="label">条码样式</div>
              <div class="iconBox iconBox1">
                <img :class="isChoose?'imgBorder mr-10':'mr-10'" @click='isChoose=true;isChoose2=false;isChoose3=false' src="../../../assets/img/50_20mm.png" alt="">
                <img :class="isChoose2?'imgBorder mr-10':'mr-10'" @click='isChoose2=true;isChoose=false;isChoose3=false' src="../../../assets/img/70_50mm.png" alt="">
                <img :class="isChoose3?'imgBorder':''" @click='isChoose3=true;isChoose=false;isChoose2=false' src="../../../assets/img/zidingyi.png" alt="">
              </div>
            </div>
            <el-form-item label="条码">
              <el-input clearable v-model="codeValue" placeholder="请输入条码" @keyup.native="inputCodeCheck('codeValue')" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="内容">
              <el-input clearable v-model="textValue" placeholder="请输入内容" maxlength="25" @keyup.native="textValue = textValue.replace(/\s+/g,'')"></el-input>
            </el-form-item>
            <el-form-item label="打印机">
              <el-select v-model="printer" class='printkind' @visible-change="getPrintList">
                <el-option
                  v-for="item in printList"
                  :label="item.label"
                  :key="item.value"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="btnContainer">
        <el-button type="primary" @click="printDesign">打印设计</el-button>
      </div>
    </div>
    <div v-else>
      <div class="printContainer h-464 pl-20 pr-20 pt-15 ">
        <div class="infoBox goodPositon">
          <el-form label-width='80px'>
            <el-form-item label="标签样式">
              <el-select v-model="tabStyle1" placeholder="请选择">
                <el-option v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标签格式">
              <el-input clearable v-model="tabFormat" disabled></el-input>
            </el-form-item>
            <el-form-item label="内容">
              <el-input clearable v-model="goodCode" placeholder="请输入内容" @keyup.native="inputCodeCheck('goodCode')" @keyup.native.enter='inputCode' maxlength="50"></el-input>
              <span style="padding-left:10px;color:#aaa"><span style="color:red">*</span> 输入后按Enter键添加预览</span>
            </el-form-item>
            <el-form-item label="打印起始" class="numRange">
              <el-input clearable v-model="start" placeholder="起始序号" @keyup.native="numCheck('start')"></el-input><span style="color:#aaa"> —</span>
              <el-input clearable v-model="end" placeholder="结束序号" @keyup.native="numCheck('end')"></el-input>
            </el-form-item>
            <el-form-item label="打印机">
              <el-select v-model="printer" class='printkind' @visible-change="getPrintList">
                <el-option
                  v-for="item in printList"
                  :label="item.label"
                  :key="item.value"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="printBox ml-50">
          <div class="label mt-10">标签预览：</div>
          <div class="codeBoxb ml-60">
            <div class="code" id="codeFB">
              <img id="barcodeIdG" class="barcode2"/>
            </div>
            <div class="dataBox">
              <ul>
                <li v-for="(item,index) in arr" :key="index" @click="barcodeGood(item)">{{index+1}}<span>{{item}}</span></li>
              </ul>
              <div class="total">总计：{{arr.length}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="btnContainerb">
        <el-button @click="clearData">清除数据</el-button>
        <el-button class="ml-0">
          <a style="text-decoration: none;" href="https://testimg.brandslink.com/wms/2019-07-16/257f92419296403.xls">下载导入模板</a>
        </el-button>
        <input-excel @getResult="getMyExcelData"></input-excel>
        <el-button type="primary" @click="printGood">开始打印</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import InputExcel from '@/components/common/InputExcel'
import JsBarcode from 'jsbarcode'
export default {
  components: {
    InputExcel
  },
  name: 'BasicConfiguration_PrintManage',
  data () {
    return {
      arr: [],
      printer: '', // 打印机
      printList: [], // 打印机选择
      activeName: '1',
      codeValue: '', // 条码
      textValue: '', // 内容
      tabFormat: '50*70（高*宽mm）', // 货位标签页面 标签格式
      tabStyle1: '0', // 货位标签页面 标签样式
      options1: [  // 货位标签页面 标签样式下拉框数据
        {
          label: '货位标签',
          value: '0'
        },
        {
          label: '容器标签',
          value: '1'
        }
      ],
      goodCode: '', // 货位标签页面 内容
      start: '',// 起始序号
      end: '',// 结束序号
      numcheck: true, // 起始序号不能大于结束序号校验
      isChoose: false,
      isChoose2: false,
      isChoose3: false,
    }
  },
  activated() {
    this.getPrintList()
    this.printer = this.printDefault
  },
  methods: {
    // 数字校验
    numCheck(val) {
      this.numcheck = true
      this[val] = this[val].replace(/[^0-9]/g,'')
      if(this.start && this.end && Number(this.start) > Number(this.end)){
        this.$message.error('起始序号不能大于结束序号且不得小于1！')
        this.numcheck = false
        return
      }
      if(Number(this.end) > this.arr.length) {
        this.$message.error('结束序号不能大于打印总数！')
        this.numcheck = false
      }
    },
    // 切换tab
    handleClick(tab) {
      Object.assign(this.$data, this.$options.data())
      this.activeName = tab.name
      this.getPrintList()
      this.printer = this.printDefault
    },
    // 导入数据
    getMyExcelData(data) {
      //处理你的数据 
      data.forEach(item => {
        if(item['货位/容器'].toString().match(/[\u4e00-\u9fa5]/g)) {
          return
        }
        this.arr.push(item['货位/容器'])
      })
      // 页面显示最后一个条码
      this.barcodeGood(this.arr[this.arr.length-1])
    },
    // 清除数据
    clearData() {
      Object.assign(this.$data, this.$options.data())
      this.activeName = '2'
      this.getPrintList()
      this.printer = this.printDefault
      document.getElementById('barcodeIdG').innerHTML = ''
    },
    // 条码内容校验
    inputCodeCheck(val) {
      this[val] = this[val].replace(/\s+/g,'')
      this[val] = this[val].replace(/[\u4e00-\u9fa5]/g,'')
    },
    // 输入条码内容
    inputCode() {
      if(this.goodCode) {
        this.arr.push(this.goodCode)
        if(!this.start) {
          this.start = '1'
        }
        this.end = this.arr.length
        // 校验通过,numcheck重置为true
        if(this.end && this.arr.length >= this.end) {
          this.numcheck = true
        }
        this.barcodeGood(this.goodCode)
        this.goodCode = ''
      }
    },
    // 货位标签页面 生成条码
    barcodeGood(val) {
      this.$nextTick(() => {
        JsBarcode("#barcodeIdG", val, {
          background: "#ffffff",
          lineColor: "#000",
          font:'Microsoft YaHei',
          fontSize: 30,
          margin: 30
        })
      })
    },
    // 货位打印条码
    printGood(val) {
      val.currentTarget.blur()
      if(!this.arr.length) {
        this.$message.error('打印总数不能为0')
        return
      }
      if(!this.start || !this.end || !this.numcheck || this.start==='0') {
        this.$message.error('打印起始序号错误')
        return
      }
      for(let i = Number(this.start) - 1; i < Number(this.end); i++) {
        LODOP.SET_PRINT_STYLE("FontSize",14)
        LODOP.ADD_PRINT_BARCODE('35px', '20px', '225px', '100px', "128B", this.arr[i])
        LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0)
        let html = `<div style='width:185px;margin-left:20px;font-size:22px;'>${this.arr[i]}</div>`
        LODOP.ADD_PRINT_HTM('146px', '20px', '225', '40px', html)
        LODOP.SET_PRINT_PAGESIZE(0, 700, 500,"")
        LODOP.SET_PRINTER_INDEX(this.printer)
        LODOP.PRINT()
        // LODOP.PRINT_DESIGN()
      }
    },
    // 打印条码
    printDesign(){
      if(!this.codeValue) {
        this.$message.error('请输入条码!')
        return
      }
      if(!this.textValue) {
        this.$message.error('请输入内容!')
        return
      }
      if(!this.isChoose && !this.isChoose2 && !this.isChoose3) {
        this.$message.error('请选择条码样式!')
        return
      }
      if(this.isChoose) {
        LODOP.SET_PRINT_STYLE("FontSize",14)
        LODOP.ADD_PRINT_BARCODE('8px', '20px', '159px', '45px', "128B", this.codeValue)
        LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0)
        let html = `<div style='width:159px;margin-left:20px;font-size:14px;'>${this.textValue}</div>`
        LODOP.ADD_PRINT_HTM('55px', '20px', '159px', '30px', html)
        LODOP.SET_PRINT_PAGESIZE(0, 500, 200,"")
      }
      if(this.isChoose2) {
        LODOP.SET_PRINT_STYLE("FontSize",14)
        LODOP.ADD_PRINT_BARCODE('35px', '20px', '225px', '100px', "128B", this.codeValue)
        LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0)
        let html = `<div style='width:185px;margin-left:20px;font-size:22px;'>${this.textValue}</div>`
        LODOP.ADD_PRINT_HTM('146px', '20px', '225px', '40px', html)
        LODOP.SET_PRINT_PAGESIZE(0, 700, 500,"")
      }
      if(this.isChoose3) {
        LODOP.SET_PRINT_STYLE("FontSize",14)
        LODOP.ADD_PRINT_BARCODE('35px', '20px', '225px', '100px', "128B", this.codeValue)
        LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0)
        let html = `<div style='width:185px;margin-left:20px;font-size:22px;'>${this.textValue}</div>`
        LODOP.ADD_PRINT_HTM('146px', '20px', '225px', '40px', html)
        // LODOP.SET_PRINT_PAGESIZE(0, 700, 500,"")
      }
      LODOP.SET_PRINTER_INDEX(this.printer)
      console.log(this.printer)
      LODOP.SET_PRINT_MODE("AUTO_CLOSE_PREWINDOW",1)
      LODOP.PRINT_DESIGN()
    }
  }
}
</script>

<style lang='scss' >
.barcode2 {
  width: 256px;
  height: 189px;
}
.printManage {
  min-width: 1288px;
  overflow: auto;
  .el-input {
      width: 180px;
    }
  .customContainer {
    .el-input--small .el-input__inner {
      height: 33px;
      line-height: 33px;
    }
  }
  .goodPositon {
    .numRange {
      .el-input {
        width: 90px;
      }
      .el-input--suffix .el-input__inner {
        padding-right: 0;
      }
    }
  }
  .title-cont {
    padding-bottom: 0!important;
    border-bottom: none!important;
  }
  .el-tabs__nav {
    margin-left: 20px;
  }
  .h-464 {
    height: 464px!important;
  }
  .printContainer {
    height: 272px;
    border-bottom: 2px solid #eee;
    padding-bottom: 40px;
    .infoBox {
      width: 600px;
      float: left;
    }
    .printBox {
      width: 522px;
      height: 100%;
      float: left;
      .label {
        float: left;
        color: #666666;
      }
      .codeBoxb {
        width: 450px;
        height: 100%;
        float: left;
        background-color: #EEEEEE;
        border: 1px solid #DCDFE6;
        border-radius: 4px;
        .code {
          width: 256px;
          height: 189px;
          display: flex;
          align-items: center;
          background-color: #fff;
          margin: 62px auto;
        }
        .dataBox {
          height: 150px;
          background:#fff;
          ul {
            height:117px;
            overflow: auto;
            li {
              height: 28px;
              line-height: 28px;
              padding-left: 10px;
              span {
                padding-left: 36px;
              }
            }
            li:hover,li:active {
              background-color: #F1F8FF;
            }
          }
          .total {
            width: 430px;
            height: 30px;
            line-height: 30px;
            margin: 0 auto;
            color:#666;
            border-top: 1px solid #ccc;
          }
        }
      }
    }
    .direct {
      display: inline-block;
      .label {
        width: 70px;
        float: left;
        margin-left: 10px;
        margin-top: 53px;
        color: #666666;
      }
      .iconBox1 {
        width: 800px!important;
        margin: 10px 0px!important;
        .imgBorder {
          border: 1px solid #2A8BFF!important;
        }
        img {
          border: 1px solid #FFF;
        }
      }
      .iconBox {
        width: 500px;
        height: 97px;
        float: left;
        margin: 15px 0px;
      }
      @media screen and (max-width: 1440px) {
        .label {
          width: 60px;
          margin-left: 20px;
        }
      }
    }
  }
  .btnContainer {
    width: 96px;
    height: 90px;
    margin: 28px auto;
    // margin: 0 auto;
    // .el-checkbox {
    //   margin: 18px 10px;
    // }
  }
  .btnContainerb {
    width: 434px;
    height: 90px;
    margin: 28px auto;
    // margin: 0 auto;
    // .el-checkbox {
    //   margin: 18px 165px;
    // }
    a:hover, a:active, a:link, a:visited {
      color: #666;
    }
  }
}
</style>