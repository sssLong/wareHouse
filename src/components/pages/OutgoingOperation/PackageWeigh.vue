/*
* @Author: 李涛
* @describe: 出库作业/集包称重
* @Date: 2019年6月5日10:9:55
*/
<template>
  <div class="layer">
    <div class="container first">
      <div class="header-container">
        <V-Title title="集包称重"></V-Title>
        <div class="condition2" style="flex-flow: wrap">
          <div class="row">
            <div class="btn-left">
              <el-button type="primary" plain @click="logisticsVisible = true">添加渠道</el-button>
              <el-select v-model="form.bagType" placeholder="选择集包袋" >
                <el-option
                  v-for="item in MaBiaoObj.bagTypeList"
                  :key="item.dataCode"
                  :label="item.dataName"
                  :value="item.dataCode">
                </el-option>
              </el-select>
            </div>
            <el-button
              type="primary"
              @click="handleCompleteDialog">集包完成</el-button>
          </div>

          <div class="row">
            <div class="tag-div">
              <tag-select
                ref="tagSelect"
                :tagData="mailingMethods"
                @item-click="itemClick"
                @item-delete="itemDelete" />
            </div>
          </div>

          <div class="row">
            <el-input
              clearable
              v-model.trim="form.waybillNum"
              :disabled="!mailingMethods.length"
              placeholder="请扫描运单号"
              style="width: 200px"
              ref="waybillNumRef"
              @keyup.enter.native="$event.target.select(); waybillNumEnter();" />
            <el-checkbox
              v-model="checkForm.lengthCheck"
              @change="lengthCheckChange"
              label="截取长度"
              border
              :disabled="!mailingMethods.length || !form.waybillNum.trim()"
              size="small" />
            <div class="input-label-div" v-show="checkForm.lengthCheck">
              <span class="input-label-span">前</span>
              <el-input-number
                :min="1"
                :max="10"
                size="small"
                type="number"
                controls-position="right"
                @change="lengthChange(1, arguments[0])"
                v-model="checkForm.forLength"></el-input-number>
            </div>
            <div class="input-label-div" v-show="checkForm.lengthCheck">
              <span class="input-label-span">后</span>
              <el-input-number
                :min="1"
                :max="10"
                size="small"
                type="number"
                controls-position="right"
                @change="lengthChange(2, arguments[0])"
                v-model="checkForm.backLength"></el-input-number>
            </div>
            <el-input
              disabled
              v-show="checkForm.lengthCheck"
              style="width: 150px"
              :value="checkForm.cutWaybillNum"></el-input>
          </div>
          <div class="row">
            <el-input
              clearable
              type="number"
              v-model.number.trim="form.packageWeight"
              :disabled="!mailingMethods.length"
              placeholder="包裹称重"
              style="width: 200px"
              ref="packageWeightRef"
              @keyup.enter.native="$event.target.select(); packageWeightEnter();">
                <span slot="suffix" class="el-input__icon">g</span>
            </el-input>
            <el-checkbox
              v-model="checkForm.sizeCheck"
              @change="sizeCheckChange"
              label="尺寸(cm)"
              border
              size="small"
              :disabled="!mailingMethods.length" />
            <el-input v-show="checkForm.sizeCheck" type="number" class="size-input" v-model="checkForm.sizeNum1">
              <template slot="prepend">长</template>
            </el-input>
            <el-input v-show="checkForm.sizeCheck" type="number" class="size-input" v-model="checkForm.sizeNum2">
              <template slot="prepend">宽</template>
            </el-input>
            <el-input v-show="checkForm.sizeCheck" type="number" class="size-input" v-model="checkForm.sizeNum3">
              <template slot="prepend">高</template>
            </el-input>
          </div>
        </div>
      </div>
      <div class="table-container">
        <!-- <div class="table-operation">
          <div class="title">包裹列表</div>
          <el-form class="details-form" label-position="right" label-width="80px">
            <el-form-item label="集包单号:">
              12345
            </el-form-item>
            <el-form-item label="邮寄方式:">
              {{mailingMethod}}
            </el-form-item>
            <el-form-item label="包裹数:">
              111
            </el-form-item>
            <el-form-item label="包裹重量:">
              333
            </el-form-item>
          </el-form>
        </div> -->
        <div class="mb-15 summary-cont">
          <div class="title">包裹列表</div>
          <template v-if="tableListObj[mailingReceiverComb] && tableListObj[mailingReceiverComb].length && tableListObj[mailingReceiverComb][0].packageOrderNum">
            <div class="summary-item">集包单号: {{tableListObj[mailingReceiverComb][0] && tableListObj[mailingReceiverComb][0].packageOrderNum}}</div>
            <div class="summary-item">邮寄方式: {{mailingReceiverComb}}</div>
            <div class="summary-item">包裹数: {{packageSum}}</div>
            <div class="summary-item">包裹重量: {{packageWeight}}</div>
          </template>
        </div>
        <V-Table :dataSource="dataSource"></V-Table>
      </div>
    </div>

    <div class="container">
      <div class="header-container">
        <V-Title title="集包列表">
          <div class="printer">
            <el-select v-model="printer">
              <el-option
                v-for="item in printList"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </div>
        </V-Title>
      </div>
      <div class="table-container">
        <!-- <div class="printer">
          <el-select v-model="printer">
            <el-option
              v-for="item in printList"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </div> -->
        <div class="table-operation mt-10">
          <div class="title">集包列表</div>
          <!-- <el-button type="text" @click="allPrint">全部打印</el-button> -->
        </div>
        <V-Table
          @print="handlePrintTable"
          :dataSource="dataSource2">
        </V-Table>
      </div>
    </div>

    <div style="opacity: 0; pointer-events: none; position: fixed; z-index: -1;">
      <table id="printTable" border="1" cellpadding="10" style="max-width: 360px; border-collapse: collapse;">
        <!-- 打印表格必须设置为thead -->
        <thead>
          <tr>
            <td width="60">集包袋</td>
            <td width="60">{{ bagName }}</td>
            <td width="70">包裹数</td>
            <td width="70">{{ packageSum }}</td>
          </tr>
          <tr>
            <td>袋重(g)</td>
            <td>{{ form.bagType && JSON.parse(form.bagType).weight }}</td>
            <td>总重(g)</td>
            <td>{{ form.bagType ? packageWeight + JSON.parse(form.bagType).weight : packageWeight }}</td>
          </tr>
          <tr>
            <td>集包人</td>
            <td>{{ packUserName }}</td>
            <td>集包时间</td>
            <td>{{ $utils.commonUtils.format(Date.now(), 'YYYY-MM-DD HH:mm:ss') }}</td>
          </tr>
        </thead>
      </table>
    </div>

    <!--添加物流弹窗-->
    <el-dialog title="添加物流渠道" :visible.sync="logisticsVisible" width="480px">
      <div class="content">
        <el-form :model="addDataForm" ref="addDataForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="添加方式">
            <el-radio-group v-model="radioType" @change="radioChange">
              <el-radio :label="1">扫描运单号添加</el-radio>
              <el-radio :label="2">自行添加</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-show="radioType == 1" label="运单号" prop="orderCode">
            <el-input
              clearable
              style="width:240px;"
              autocomplete="off"
              v-model.trim="addDataForm.orderCode"
              placeholder="请扫描运单号"
              @keyup.native.enter="$event.target.select(); orderCodeEnter();"></el-input>
          </el-form-item>
          <el-form-item v-show="radioType !== 1" label="仓库">
            <el-select v-model="warehouse" placeholder="请选择" style="width:240px;" @change="selectChange">
              <el-option
                v-for="item in warehouseList"
                :key="item.dataCode"
                :label="item.dataName"
                :value="item.dataCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="radioType !== 1" label="揽收商">
            <el-select v-model="collector" style="width:240px;" @change="selectChange">
              <el-option
                v-for="item in collectorList"
                :label="item.collectorName"
                :value="item.collectorCode"
                :key="item.collectorCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="radioType !== 1" label="物流渠道">
            <el-select
              multiple
              @change="selectorChange"
              :disabled="!warehouse || !collector"
              v-model="select"
              style="width:240px;">
              <el-option
                v-for="item in selectList"
                :label="item.methodCnName"
                :value="item.id"
                :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="添加结果">
            <div class="result-div">
              <tag-select
                ref="tagSelect2"
                :noclick="true"
                :tagData="mailingMethodsAdded"
                @item-delete="itemDelete" />
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddMailingMethods">取 消</el-button>
        <el-button
          type="primary"
          :disabled="!mailingMethodsAdded.length"
          @click="confirmAddMailingMethods">确 定</el-button>
      </span>
    </el-dialog>

    <!--集包完成弹窗-->
    <el-dialog title="集包完成" :visible.sync="completeVisible" width="480px">
      <div class="content complete">
        <h1 v-if="this.tableListObj[this.mailingReceiverComb] && this.tableListObj[this.mailingReceiverComb].length">
          {{this.tableListObj[this.mailingReceiverComb][0].mailingReceiverComb.split(' >> ')[0]}}
        </h1>
        <div class="tc mt-10" v-if="this.tableListObj[this.mailingReceiverComb]">
          <img id="code-cont" style="height: 100px;" />
        </div>
        <p class="table-title">{{ mailingReceiverComb.split(' >> ')[0] + mailingReceiverComb.split(' >> ')[1] }}<span v-if="mailingReceiverComb">&nbsp;&nbsp;/&nbsp;&nbsp;</span>提货方式：{{canvasser}}</p>
        <table border="1" cellpadding="10">
          <!-- 打印表格必须设置为thead -->
          <thead>
            <tr>
              <td width="60">集包袋</td>
              <td width="60">{{ bagName }}</td>
              <td width="70">包裹数</td>
              <td width="70">{{ packageSum }}</td>
            </tr>
            <tr>
              <td>袋重(g)</td>
              <td>{{ form.bagType && JSON.parse(form.bagType).weight }}</td>
              <td>总重(g)</td>
              <td>{{ form.bagType ? packageWeight + JSON.parse(form.bagType).weight : packageWeight }}</td>
            </tr>
            <tr>
              <td>集包人</td>
              <td>{{ packUserName }}</td>
              <td>集包时间</td>
              <td>{{ $utils.commonUtils.format(Date.now(), 'YYYY-MM-DD HH:mm:ss') }}</td>
            </tr>
          </thead>
        </table>
        <div class="print">
            <span>打印机 </span>
            <el-select v-model="printer">
              <el-option
                v-for="item in printList"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
            <el-button
              type="primary"
              class="fr"
              @click="handlePrintDialog"
              :disabled="!mailingReceiverComb">打印</el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="completeVisible = false">取 消</el-button>
        <el-button type="primary" @click="finishPack" :disabled="!mailingReceiverComb">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { PackageWeigh as cols, PackageWeigh2 as cols2 } from '@/columns'
  import { query } from '@/config'
  import TagSelect from '../../common/TagSelect'
  import JsBarcode from 'jsbarcode'
  import { mapState } from 'vuex'

  export default {
    name: "OutgoingOperation_PackageWeigh",
    components: {TagSelect},
    data() {
      return {
        total: null, // 列表总数，默认设置null和0有区别
        pageNum: 1,
        pageSize: query.limit,
        pageSizes: [
          query.limit,
          query.limit * 2,
          query.limit * 5,
          query.limit * 10,
          query.limit * 20
        ],
        form: {
          waybillNum: '', // 运单号 PACKAGE3238
          packageWeight: '', // 重量
          bagType: '' // 袋子类型
        },
        checkForm: {
          cutWaybillNum: '', // 截取后的运单号
          lengthCheck: false,
          forLength: 1,
          backLength: 1,
          sizeCheck: false,
          sizeNum1: '', // 长
          sizeNum2: '', // 宽
          sizeNum3: '' // 高
        },
        num1: 1,
        dataSource: {
          data: [], // 表格数据
          cols // 表格的列数据
        },
        dataSource2: {
          data: [], // 表格数据
          cols: cols2, // 表格的列数据
          isOperation: true, // 表格有操作列时设置
          operation: { // 表格有操作列时设置
              label: '操作', // 列名
              width: '60', // 根据实际情况给宽度
              data: [
                  {
                      label: '打印', // 操作名称
                      emitType: 'print', // 触发父组件
                      permission: '打印', // 后期这个操作的权限，用来控制权限
                  }
              ]
          }
        },
        canvasser: '', // 揽货方式
        printer: '',
        logisticsVisible: false,
        radioType: 1,
        warehouse: '',
        collectorList: [], // 物流渠道
        select: '', // 物流方式
        selectList: [], // 物流方式列表
        collector: '', // 揽收商
        collectorList: [], // 揽收商列表
        addDataForm:{
          orderCode: ''
        },
        rules: {
          orderCode: [{required: true, message: '请输入运单号', trigger: 'blur'}]
        },
        completeVisible: false,
        mailingReceiverComb: '', // 邮寄方式
        mailingMethods: [], // 邮寄方式列表
        mailingMethodsAdded: [], // 在添加的物流渠道
        packageSum: 0, // 包裹总数
        packageWeight: 0, // 包裹总量
        packUserName: localStorage.accountName, // 当前用户
        tableListObj: {}, // 表格数据
        cacheData: {} // 查过的数据缓存
      }
    },
    computed: {
      bagName () { // 袋子名称
        if (!this.MaBiaoObj.bagTypeList) return ''
        return (this.MaBiaoObj.bagTypeList.find(item => item.dataCode === this.form.bagType) || {}).dataName || ''
      },
      ...mapState([ 'disbandFlag' ])
    },
    beforeRouteLeave (to, fromm, next) {
      this.completeVisible = false
      this.logisticsVisible = false
      next()
    },
    created () {
      this.initMethod()
    },
    async activated () {
      let packageOrderNum = this.$route.query.packageOrderNum
      if (packageOrderNum) { // 集包管理点击继续集包过来的
        const { data = {} } = await this.$api.OutgoingOperation.packageOrderDetail({ packageOrderNum })
        // 改掉地址栏的参数
        history.pushState(null, null, location.origin + location.pathname)
        if (!Object.keys(data).length) return
        let { packageOrderDetailsList = [] } = data
        // this.detailData = data
        // this.dataSource.data = packageOrderDetailsList
        let mailingReceiverComb = data.receiver + ' >> ' + data.mailingMethod
        let method = {
          label: mailingReceiverComb,
          value: mailingReceiverComb
        }
        if (!this.mailingMethods.find(item => item.value === mailingReceiverComb)) {
          this.mailingMethods.push(method)
          this.mailingReceiverComb = mailingReceiverComb
        }
        if (!this.tableListObj[this.mailingReceiverComb]) { // 如果同一运输不存在
          this.packageOrderNum = data.packageOrderNum // 生成运单号
          this.$set(this.tableListObj, this.mailingReceiverComb, [])
        }
        this.$refs.tagSelect.activeIndex = this.mailingMethods.findIndex(item => item.value === mailingReceiverComb)
        if (!packageOrderDetailsList.length) return
        packageOrderDetailsList = packageOrderDetailsList.map(item => ({
          mailingReceiverComb,
          mailingMethodCode: data.mailingMethodCode,
          receiverCode: data.receiverCode,
          warehouseCode: data.warehouseCode,
          ...item
        }))
        this.$set(this.tableListObj, this.mailingReceiverComb, packageOrderDetailsList)
        this.dataSource.data = this.tableListObj[this.mailingReceiverComb]
        this.computeTotal()
        this.computeAllList()
      }
    },
    watch: {
      completeVisible (val) { // 弹窗显示和关闭
        if (val && this.tableListObj[this.mailingReceiverComb] && this.tableListObj[this.mailingReceiverComb].length) {
          this.$nextTick(() => {
            JsBarcode("#code-cont", this.tableListObj[this.mailingReceiverComb][0].packageOrderNum, { // 生成条码
              background: "#ffffff",
              lineColor: "#000",
              fontSize: 30,
              width: 3,
            })
          })
        }
      },
      disbandFlag (val) { // 集包管理解散后清空部分数据
        Object.assign(this.$data, this.$options.data())
        this.initMethod()
      }
    },
    methods: {
      async initMethod () { // 初始化方法
        // this.getSelectMethod() // 物流方式接口没好，先注释
        await this.batchMaTableList('bag_type', 'canvasser_type') // 袋子类型的码表，揽货方式
        this.form.bagType = this.MaBiaoObj.bagTypeList[0].dataCode
        this.getWareHouse() // 仓库列表
        this.getPrintList() // 获取打印机列表
        this.printer = this.printDefault
        this.getSelectCollector()
      },
      async getData ({ waybillNum }) {
        if (this.cacheData[waybillNum]) { // 如果缓存有数据，就不调接口
          return { data: this.cacheData[waybillNum] }
        }
        // 调接口获取数据
        const { data } = await this.$api.OutgoingOperation.findOrderDetails({ waybillNum })
        this.cacheData[waybillNum] = data // 缓存数据
        return { data }
      },
      async findOrderDetails (params) { // 扫描运单号
        let { data } = await this.getData(params) // 做了优化，请求到的结果缓存到变量
        // let { data } = await this.$api.OutgoingOperation.findOrderDetails2(params)
        // if (Array.isArray(data)) { // 调试所用，后面删除
        //   data = data[0]
        // }
        if (!data) return
        if (data.orderStatus == '9') {
          return this.$utils.commonUtils.tip(`运单号：${params.waybillNum}的包裹已拦截，请将包裹放入异常箱`)
        }
        let mailingReceiverComb = data['receiver'] + ' >> ' + data['mailingMethod']
        if (!this.mailingMethods.find(item => item.value === mailingReceiverComb)) {
          return this.$utils.commonUtils.tip('扫描的运单与添加的渠道不一致！')
        }
        this.mailingReceiverComb = mailingReceiverComb
        if (!this.tableListObj[this.mailingReceiverComb]) { // 如果同一运输不存在
          this.packageOrderNum = await this.generatePackageOrderNum(data) // 生成运单号
          this.$set(this.tableListObj, this.mailingReceiverComb, [])
        }
        this.$refs.tagSelect.activeIndex = this.mailingMethods.findIndex(item => item.value === mailingReceiverComb)
        if (!this.tableListObj[this.mailingReceiverComb].find(item => item.waybillNum === data.waybillNum)) { // 不存在的时候添加到列表
          data.packUserName = this.packUserName
          data.packageWeight = this.form.packageWeight
          data.mailingReceiverComb = this.mailingReceiverComb
          data.packageOrderNum = this.packageOrderNum
          data.packTime = this.$utils.commonUtils.format(Date.now(), 'YYYY-MM-DD HH:mm:ss')
          const errorCode = await this.addPackageToList(data) // 添加到集包单，真实数据放开
          if (errorCode !== '100200') { // 可能已经集包，不往下走
            return this.$set(this.tableListObj, this.mailingReceiverComb, undefined)
          }
          this.tableListObj[this.mailingReceiverComb].push(data)
        }
        this.dataSource.data = this.tableListObj[this.mailingReceiverComb]
        this.$refs.waybillNumRef.select()
        this.form.packageWeight = ''
        this.computeTotal()
        this.computeAllList()
      },
      computeAllList () { // 重新计算右侧所有列表
        this.dataSource2.data = []
        for (let item in this.tableListObj) {
          let data = this.tableListObj[item]
          this.dataSource2.data.push({
            packageOrderNum: data[0].packageOrderNum,
            mailingReceiverComb: data[0].mailingReceiverComb,
            bagWeight: JSON.parse(this.form.bagType).weight,
            packageAmount: data.length,
            packageWeight: data.reduce((pre, cur) => pre + Number(cur.packageWeight), 0)
          })
        }
      },
      computeTotal () { // 计算包裹总数和总重
        if (this.tableListObj && this.tableListObj[this.mailingReceiverComb]) {
          this.packageSum = this.tableListObj[this.mailingReceiverComb].length
          this.packageWeight = this.tableListObj[this.mailingReceiverComb].reduce((pre, cur) => pre + Number(cur.packageWeight), 0)
        } else {
          this.packageSum = 0
          this.packageWeight = 0
        }
      },
      async getSelectCollector () { // 获取揽收商列表
        const { data = {} } = await this.$api.LogisticsManage.getSelectCollector({
          page: 1,
          row: 999999
        })
        const { pageInfo = {} } = data
        const { list = [] } = pageInfo
        this.collectorList = list
      },
      async selectChange () { // 仓库/揽收商改变
        if (!this.warehouse || !this.collector) return
        this.select = ''
        const { data = [] } = await this.$api.LogisticsManage.packageLogistics({
          collectorCode: this.collector,
          warehouse: this.warehouse
        })
        this.selectList = data
      },
      selectorChange (val) { // 物流渠道改变
        val.forEach(id => {
          let theOne = this.selectList.find(item => item.id === id)
          let mailingReceiverComb = theOne.collectorName + ' >> ' + theOne.methodCnName
          if (!this.mailingMethodsAdded.find(item => item.value === mailingReceiverComb)) { // 如果同一运输不存在
            this.mailingMethodsAdded.push({
              label: mailingReceiverComb,
              value: mailingReceiverComb
            })
          }
        })
      },
      async findCanvasser () { // 完成集包找揽货方式
        const { data = [] } = await this.$api.LogisticsManage.packageLogistics()
        let selector = data.find(item => { // 找到是哪个物流渠道
          let mailingReceiverComb = item.collectorName + ' >> ' + item.methodCnName
          return mailingReceiverComb === this.mailingReceiverComb
        })
        if (!selector) return ''
        let collector = selector.warehouseCollectType.find(item => {
          return item.code == this.tableListObj[this.mailingReceiverComb][0].warehouseCode
        })
        if (!collector) return ''
        let canvasser = this.MaBiaoObj.canvasserTypeList.find(item => {
          return item.dataCode == collector.type
        })
        return canvasser ? canvasser.dataName : ''
      },
      // async getSelectMethod () { // 获取物流方式
      //   const { data = {} } = await this.$api.LogisticsManage.getSelectMethod({
      //     page: 1,
      //     row: 999999
      //   })
      //   const { pageInfo = {} } = data
      //   const { list = [] } = pageInfo
      //   this.selectList = list
      // },
      async generatePackageOrderNum (theOne) { // 生成集包单号
        let { mailingMethod, mailingMethodCode, receiver, receiverCode, warehouseCode,  warehouseName } = theOne
        const { data } = await this.$api.OutgoingOperation.generatePackageOrderNum({ mailingMethod, mailingMethodCode, receiver, receiverCode, warehouseCode,  warehouseName })
        return data
      },
      async addPackageToList (theOne) { // 添加到集包单
        let params = this.$utils.commonUtils.getCustomObjByKes(theOne, ['orderType', 'packageNum', 'packageOrderNum', 'packageWeight', 'size', 'waybillNum'])
        if (this.checkForm.lengthCheck) { // 截取长度勾选
          params.cutWaybillNum = this.checkForm.cutWaybillNum
        }
        if (this.checkForm.sizeCheck) { // 尺寸勾选了
          params.size = [ this.checkForm.sizeNum1, this.checkForm.sizeNum2, this.checkForm.sizeNum3 ].join('x')
        }
        const { errorCode } = await this.$api.OutgoingOperation.addPackageToList(params)
        return errorCode
      },
      async handleCompleteDialog () { // 集包完成
        let data = this.tableListObj[this.mailingReceiverComb]
        if (data && data.length) {
          this.completeVisible = true
          this.canvasser = await this.findCanvasser() // 提货方式
        } else {
          this.$utils.commonUtils.tip('当前包裹列表为空，请扫描运单号添加！')
        }
      },
      async finishPack () { // 集包完成
        let packageOrderNum = this.tableListObj[this.mailingReceiverComb][0].packageOrderNum
        const { errorCode } = await this.$api.OutgoingOperation.finishPack({ packageOrderNum })
        if (errorCode === '100200') {
          this.$utils.commonUtils.tip('集包成功', 'success')
          this.completeVisible = false
          this.$set(this.tableListObj, this.mailingReceiverComb, [])
          this.dataSource.data = this.tableListObj[this.mailingReceiverComb]
          // this.dataSource2.data = []
          this.form.waybillNum = ''
          this.$refs.waybillNumRef.focus()
        }
      },
      waybillNumEnter () { // PACKAGE3222, PACKAGE3238
        if (!this.form.packageWeight || !this.form.waybillNum.trim()) {
          this.$refs.packageWeightRef.focus()
          return
        }
        // this.findOrderDetails({ packageNum: this.form.waybillNum })
        this.findOrderDetails({ waybillNum: this.form.waybillNum })
      },
      packageWeightEnter () {
        if (!this.form.packageWeight || !this.form.waybillNum.trim()) return
        // this.findOrderDetails({ packageNum: 'PACKAGE3222' })
        this.findOrderDetails({ waybillNum: this.form.waybillNum })
      },
      orderCodeEnter () { // 弹窗运单号回车
        if (!this.addDataForm.orderCode) return
        // this.addMailingMethods({ packageNum: this.addDataForm.orderCode })
        this.addMailingMethods({ waybillNum: this.addDataForm.orderCode })
      },
      async addMailingMethods (params) { // 添加物流渠道
        let { data } = await this.getData(params)
        // let { data } = await this.$api.OutgoingOperation.findOrderDetails2(params)
        if (Array.isArray(data)) { // 调试所用，后面删除
          data = data[0]
        }
        if (!data) return
        // if (!data) {
        //   return this.$notify({
        //     title: '警告',
        //     message: '没有查到物流，请检查运单号！',
        //     type: 'warning'
        //   })
        // }
        let mailingReceiverComb = data['receiver'] + ' >> ' + data['mailingMethod']
        if (!this.mailingMethodsAdded.find(item => item.value === mailingReceiverComb)) { // 如果同一运输不存在
          this.mailingMethodsAdded.push({
            label: mailingReceiverComb,
            value: mailingReceiverComb
          })
        }
      },
      cancelAddMailingMethods () { // 取消添加物流渠道
        this.logisticsVisible = false
        setTimeout(this.resetDialogMailingMethods, 500)
      },
      confirmAddMailingMethods () { // 确定添加物流渠道
        for (let item of this.mailingMethodsAdded) {
          if (!this.mailingMethods.some(it => it.value === item.value)) {
            this.mailingMethods.push(item)
          }
        }
        // this.mailingMethods = this.mailingMethods.concat(this.mailingMethodsAdded)
        this.logisticsVisible = false
        this.$refs.waybillNumRef.select()
        setTimeout(this.resetDialogMailingMethods, 500)
      },
      resetDialogMailingMethods () { // 弹窗数据置空
        this.addDataForm.orderCode = ''
        this.mailingMethodsAdded = []
      },
      allPrint () { // 全部打印
        //
      },
      async handlePrintTable () { // 表格打印
        let data = arguments[1]
        let receiver = data.mailingReceiverComb
        this.canvasser = await this.findCanvasser() // 提货方式
        this.handlePrint(receiver.split(' >> ')[0], receiver.split(' >> ')[1], data.packageOrderNum)
      },
      handlePrintDialog () { // 弹窗打印
        let data = this.tableListObj[this.mailingReceiverComb][0]
        let receiver = data.mailingReceiverComb
        this.handlePrint(receiver.split(' >> ')[0], receiver.split(' >> ')[1], data.packageOrderNum)
      },
      handlePrint (receiver1, receiver2, packageOrderNum = '1234567890') {
        LODOP.SET_PRINT_PAGESIZE(1, 1000, 1500) // 设置打印尺寸 100mm*100mm
        LODOP.SET_PRINT_STYLE('FontSize', 30)
        LODOP.SET_PRINT_STYLE('Bold', 1)
        // LODOP.SET_PRINT_STYLE('Horient', 2)
        if (receiver1.length > 8) {
          LODOP.ADD_PRINT_TEXT(25, 15, 400, 50, receiver1.substr(0, 8))
          LODOP.ADD_PRINT_TEXT(70, 15, 400, 50, receiver1.substr(8))
        } else {
          LODOP.ADD_PRINT_TEXT(40, 15, 400, 50, receiver1)
        }
        LODOP.SET_PRINT_STYLE('Bold', 0)
        LODOP.SET_PRINT_STYLE('FontSize', 12)
        if (receiver1.length > 8) {
          LODOP.ADD_PRINT_BARCODE(130, 45, 300, 130, '128Auto', packageOrderNum)
        } else {
          LODOP.ADD_PRINT_BARCODE(120, 45, 300, 130, '128Auto', packageOrderNum)
        }
        LODOP.SET_PRINT_STYLE('FontSize', 18)
        LODOP.ADD_PRINT_TEXT(290, 15, 400, 50, receiver2)
        LODOP.ADD_PRINT_TEXT(335, 10, 400, 30, '提货方式：' + this.canvasser)
        LODOP.ADD_PRINT_TABLE(380, 8, 400, 400, printTable.outerHTML)
        // LODOP.PREVIEW()
        LODOP.PRINT()
      },
      lengthChange (type, val) { // 长度的加减
        let str = this.form.waybillNum.substr(this.checkForm.forLength)
        this.checkForm.cutWaybillNum = str.substring(0, str.length - this.checkForm.backLength)
      },
      lengthCheckChange () { // 截取长度勾选
        this.checkForm.forLength = 1
        this.checkForm.backLength = 1
        this.lengthChange()
      },
      sizeCheckChange () { // 尺寸勾选
        this.checkForm.sizeNum1 = ''
        this.checkForm.sizeNum2 = ''
        this.checkForm.sizeNum3 = ''
      },
      addLogisticsSubmit() {
        this.$refs['addDataForm'].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!');
            return false;
          }
        });
      },
      itemClick({ value }) {
        this.dataSource.data = this.tableListObj[value]
        this.mailingReceiverComb = value
        this.computeTotal()
      },
      itemDelete(item, index) {
        // let preMethod = this.mailingMethods[index].value
        // this.$set(this.tableListObj, this.mailingReceiverComb, null)
        // this.mailingMethods.splice(index, 1) // 内部已经删除了
        delete this.tableListObj[item.value]
        if (this.mailingMethods.length) {
          this.$refs.tagSelect.activeIndex = this.mailingMethods.length - 1
          this.mailingReceiverComb = this.mailingMethods[this.mailingMethods.length - 1].value
          this.dataSource.data = this.tableListObj[this.mailingReceiverComb]
        } else {
          this.dataSource.data = []
        }
        this.computeAllList()
      },
      radioChange(val) {
        if (val == 1) {
          this.rules.orderCode = [{required: true, message: '请输入运单号', trigger: 'blur'}]
        } else {
          delete this.rules.orderCode
        }
      },
      search () {
        // this.data = this.$options.data()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .layer {
    // display: flex;
    overflow: hidden;
    background-color: #EEE;
    .container {
      float: left;
      width: 49.5%;
      border-radius: 5px;
      background-color: #FFF;
    }
    .first {
      margin-right: 1%;
    }
  }
  .condition2 {
    padding: 20px 0;
    display: flex;
    align-items: end;
    margin: 0 20px;
    .el-select{
      width: 126px;
      height: 32px;
      margin-right: 10px;
      margin-bottom: 10px;
    }
    .el-button {
      height: 32px;
      margin-right: 10px;
      margin-bottom: 10px;
    }
    .el-input-number {
      /deep/ input {
        display: block;
        padding-left: 50px;
      }
    }
    .input-label-div {
      margin-right: 10px;
      margin-bottom: 10px;
      position: relative;
      .input-label-span {
        position: absolute;
        left: 0;
        display: inline-block;
        height: 32px;
        line-height: 32px;
        z-index: 1;
        border-right: 1px solid #DCDFE6;
        padding: 0 10px;
      }
    }
    .size-input {
      width: 100px;
      /deep/ .el-input-group__prepend {
        padding: 0 10px;
      }
    }
  }
  .row {
    width: 100%;
    display: flex;
    align-items: flex-end;
    .el-input, .el-checkbox {
      margin-right: 10px;
      margin-bottom: 10px;
    }
    .btn-left {
      flex: 1;
      display: flex;
    }
  }
  .tag-div {
    margin-bottom: 10px;
    margin-right: 10px;
    flex: 1;
    border-radius: 5px;
    border: 1px solid #dcdfe6;
    min-height: 60px;
  }
  .details-form {
    flex: 1;
    display: flex;
    &/deep/.el-form-item {
      width: 33%;
      margin-bottom: 0;
    }
  }
  .result-div {
    width: 240px;
    min-height: 130px;
    overflow-y: auto;
    border: 1px solid #dcdfe6;
  }
  .complete {
    color: #333333;
    padding: 0 15px;
    h1{
      font: 28px 'PingFangSC-Medium';
      text-align: center;
    }
    .table-title {
      font: 600 16px 'PingFangSC-Medium';
      margin-top: 20px;
    }
    table {
      width: 100%;
      margin-top: 10px;
      margin-bottom: 15px;
      td{
        border: 1px solid #dcdfe6;
        text-align: center;
        padding: 8px 12px;
      }
    }
  }
  .print {
    display: flex;
    align-items: center;
    .el-select {
      flex: 1;
      margin: 0 15px;
    }
  }
  .summary-cont {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
      font-weight: bold;
    }
  }
</style>
