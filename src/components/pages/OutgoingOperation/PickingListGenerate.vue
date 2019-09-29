/*
 * @Author: 高友谊 
 * @Date: 2019-06-04 17:32:21 
 * @Last Modified by: 高友谊
 * @Last Modified time: 2019-06-05 14:17:00
 */
<template>
<div class="yy-cont picking-list-generate">
  <V-Title ref="titleRef">
    <el-input
			clearable
			placeholder="请输入查询内容"
			v-model="form.sku"
      @keyup.enter.native="$event.target.select(); handleSearch();"
			class="input-select">
	    <el-select value="sku" slot="prepend" placeholder="库区名称" disabled>
	      <el-option label="SKU" value="sku"></el-option>
	    </el-select>
	    <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
	  </el-input>
  </V-Title>

  <div class="pl-20 pr-20 form-select" ref="formRef">
    <el-select
      clearable
      filterable
    	v-model="form.warehouseCode"
      @change="handleSearch"
    	placeholder="请选择仓库">
      <el-option
        v-for="item in warehouseList"
        :key="item.dataCode"
        :label="item.dataName"
        :value="item.dataCode">
      </el-option>
    </el-select>
    <el-select
      @change="orderTypeChange"
    	v-model="form.orderType"
    	placeholder="请选择订单类型">
      <el-option
        v-for="item in MaBiaoObj.orderTypeList"
        :key="item.dataCode"
        :label="item.dataName"
        :value="item.dataCode">
      </el-option>
    </el-select>
    <el-select
    	clearable
      :disabled="maxDisabled"
      @change="handleSearch"
    	v-model="form.packageType"
    	placeholder="选择包裹类型">
      <el-option
        v-for="item in MaBiaoObj.packageTypeList"
        :key="item.dataCode"
        :label="item.dataName"
        :value="item.dataCode">
      </el-option>
    </el-select>
    <el-select
    	clearable
    	v-model="form.salesChannels"
      @change="handleSearch"
    	placeholder="请选择销售渠道">
      <el-option
        v-for="item in platformList"
        :key="item.platformCode"
        :label="item.platformCn"
        :value="item.platformCode">
      </el-option>
    </el-select>
    <el-select
    	clearable
      @change="handleSearch"
    	v-model="form.remainingTime"
    	placeholder="请选择发货剩余时间">
      <el-option
        v-for="item in MaBiaoObj.shipRemainingTimeList"
        :key="item.dataCode"
        :label="item.dataName"
        :value="item.dataCode">
      </el-option>
    </el-select>
    <!-- <el-select
    	clearable
    	v-model="select7"
    	placeholder="选择国家">
      <el-option label="全部" value="1"></el-option>
      <el-option label="America" value="2"></el-option>
      <el-option label="GB" value="3"></el-option>
      <el-option label="CA" value="4"></el-option>
    </el-select> -->
  	<el-button type="text" @click="handleReset">重置</el-button>
	</div>

  <div class="pl-20 pr-20 pt-10 main-setion" :style="{ height }">
    <div class="pr-10 transport-way">
      <div class="title">运输方式</div>
      <el-tree
        class="yy-tree"
        ref="tree"
        @check="treeCheck"
        default-expand-all
        :data="treeDataList"
        node-key="id"
        show-checkbox
        :props="defaultProps">
      </el-tree>
      <!-- <div class="fr mt-20 handle-cont">
        <el-button>重置</el-button>
        <el-button type="primary">确定</el-button>
      </div> -->
    </div>
    <el-form class="info-collect" label-width="150px" :rules="formRules" ref="form" :model="generateForm">
      <div class="title">当前筛选的包裹信息汇总</div>
      <div class="pt-20 form-cont">
        <div class="sec-item">
          <el-form-item label="包裹数：">
            <el-input disabled :value="generateData.packageSum"></el-input>
          </el-form-item>
          <el-form-item label="SKU品种数：">
            <el-input disabled :value="generateData.skuVarietySum"></el-input>
          </el-form-item>
          <el-form-item label="每次拣货最多商品数：" prop="skuMaxNumber">
            <el-input v-model.number="generateForm.skuMaxNumber"></el-input>
          </el-form-item>
        </div>
        <div class="sec-item">
          <el-form-item label="订单数：">
            <el-input disabled :value="generateData.orderSum"></el-input>
          </el-form-item>
          <el-form-item label="商品数：">
            <el-input disabled :value="generateData.commoditySum"></el-input>
          </el-form-item>
          <el-form-item label="多品分拣最多包裹数：" prop="packageMaxNumber">
            <el-input v-model.number="generateForm.packageMaxNumber" :disabled="maxDisabled" type="number"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="运输方式：" class="last-form-item" prop="packageNumList">
          <el-select
            v-model="generateForm.packageNumList"
            @change="handleChange"
            multiple
            placeholder="请选择">
            <el-option
              v-for="item in mailingMethodsOptions"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-button type="primary" class="fr mr-40" :loading="generateButtonLoading" @click="generatePickingOrder">生成拣货单</el-button>
    </el-form>
  </div>
</div>
</template>

<script>
export default {
  name: 'OutgoingOperation_PickingListGenerate',
  data () {
    return {
      form: { // 查询拣货数据
        sku: '', // 右上角sku搜索值
        orderType: '', // 订单类型
        warehouseCode: '', // 仓库
        packageType: '', // 包裹类型
        salesChannels: '', // 销售渠道
        remainingTime: '' // 发货剩余时间
      },
      generateForm: { // 生成拣货单的数据
        skuMaxNumber: 200, // sku最大数量，小于等于200，默认200
        packageMaxNumber: 55, // 包裹数，小于等于55，默认55
        packageNumList: [] // 包裹号集合
      },
      treeDataList: [{ // 树形邮寄方式
        id: 1,
        label: '全选',
        disabled: true, // 没有格式化数据前禁用
        children: []
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      initFind: true, // 第一次查找
      maxDisabled: false, // 最大值的禁用，退供和调拨为1，禁用
      packageNumberObj: {}, // 邮寄方式对应的包裹号
      mailingMethodsOptions: [], // 邮寄方式下拉选项
      height: 0,
      generateButtonLoading: false, // 拣货单生成的按钮loading
      platformList: [], // 销售渠道
      generateData: {
        packageSum: '',
        skuVarietySum: '',
        orderSum: '',
        commoditySum: ''
      }, // 结果数据显示在表单
      formRules: {
        skuMaxNumber: [
          {
            required: true, // 会有星号
            validator (rule, value, cb) {
              if (value <= 0) {
                rule.message = '每次拣货最多商品数不能为空'
                return cb(1)
              } else if (value > 200) {
                rule.message = '每次拣货最多商品数不能超过200'
                return cb(1)
              }
              cb()
            }
          }
        ],
        packageMaxNumber: [
          {
            required: true, // 会有星号
            validator (rule, value, cb) {
              if (value <= 0) {
                rule.message = '多品分拣最多包裹数不能为空'
                return cb(1)
              } else if (value > 55) {
                rule.message = '多品分拣最多包裹数不能超过55'
                return cb(1)
              }
              cb()
            }
          }
        ],
        packageNumList: [
          {
            required: true,
            validator (rule, value, cb) { // 数组必须有长度
              if (!value.length) {
                rule.message = '运输方式不能为空'
                return cb(1) // cb 后面有值就行
              }
              cb()
            }
          }
        ]
      }
    }
  },
  async created () {
    await Promise.all([
      this.batchMaTableList('order_type', 'package_type', 'ship_remaining_time'), // 订单类型，包裹类型， 发货剩余时间
      this.getPlatformList(), // 销售渠道
      this.getWareHouse() // 仓库列表
    ])
    if (this.warehouseList.length) {
      this.form.warehouseCode = this.warehouseList[0].dataCode
    }
    if (this.MaBiaoObj.orderTypeList && this.MaBiaoObj.orderTypeList.length) {
      this.form.orderType = this.MaBiaoObj.orderTypeList[0].dataCode
    }
    // this.findGeneratePickingOrder()
  },
  mounted () {
    setTimeout(this.setHeight, 0)
  },
  methods: {
    handleChange () { // 联动设置左侧树形
      this.$refs.tree.setCheckedKeys(this.generateForm.packageNumList)
      this.findGeneratePickingOrder()
    },
    // formatZeroCode (list = []) { // 全部的dataCode为00改为空字符串
    //   // 把全部放到最后一项
    //   let index = list.findIndex(item => ~~item.dataCode === 0)
    //   if (list.length && index !== list.length - 1) {
    //     let theOne = list.splice(index, 1)
    //     list.push(...theOne)
    //   }
    //   // 修改dataCode为00的为空字符串
    //   return list.map(item => {
    //     return (~~item.dataCode === 0 ? ({
    //       dataCode: '',
    //       dataName: item.dataName
    //     }) : { ...item })
    //   })
    // },
    orderTypeChange (val) { // 订单类型变动
      this.form.packageType = ''
      if (val == '2' || val == '3') {
        this.maxDisabled = true
        setTimeout(() => {
          this.generateForm.packageMaxNumber = 1
        })
      } else {
        this.maxDisabled = false
        this.generateForm.packageMaxNumber = this.$options.data().generateForm.packageMaxNumber
      }
      this.handleSearch()
    },
    setHeight () { // 设置高度
      let titleHeight = this.$refs.titleRef.$el.offsetHeight
      let formHeight = this.$refs.formRef.offsetHeight
      this.height = document.querySelector('.main').offsetHeight - titleHeight - formHeight + 'px'
    },
    async getPlatformList() { // 销售渠道
      let { data = {} } = await this.$api.LogisticsManage.getPlatformList({page: 1, row: Math.pow(10,8), isValid: 1})
      let { pageInfo = {} } = data
      let { list = [] } = pageInfo
      this.platformList = list
    },
    async findGeneratePickingOrder () { // 根据表单获取拣货单信息
      // if (!this.form.warehouseCode) {
      //   return this.$utils.commonUtils.tip('请选择仓库')
      // }
      // if (!this.form.packageType) {
      //   return this.$utils.commonUtils.tip('请选择包裹类型')
      // }
      let packageNumList = this.getPackageNumByName()
      const { data = {} } = await this.$api.OutgoingOperation.findGeneratePickingOrder(Object.assign({}, this.form, { packageNumList }))
      if (data.packageSum && data.orderSum && data.packageSum !== data.orderSum) {
        data.orderSum = data.orderSum - 1
      }
      if (this.initFind) {
        const { list = [] } = data
        this.getPackageNumberObj(list)
        this.getTreeDataList(list)
        this.initFind = false
      } else {
        if (!packageNumList || !packageNumList.length) {
          this.generateData = this.$options.data().generateData
        } else {
          this.generateData = data
        }
      }
    },
    getPackageNumberObj (list) { // 邮寄列表获取对应的包裹号
      // let treeArr = []
      // for (let item of Object.values(list)) {
      //   treeArr = treeArr.concat(item)
      // }
      // for (let item of treeArr) {
      //   console.log(0, item)
      //   let tempArr = item.split('>>')
      //   let key = tempArr[1].trim()
      //   let val = tempArr[0].trim()
      //   if (this.packageNumberObj[key]) {
      //     this.packageNumberObj[key].push(val)
      //   } else {
      //     this.packageNumberObj[key] = [ val ]
      //   }
      // }
      for (let item in list) {
        for (let it of list[item]) {
          let tempArr = it.split('>>')
          let key = item + ' >> ' + tempArr[1].trim()
          let val = tempArr[0].trim()
          if (!this.packageNumberObj[key]) {
            this.packageNumberObj[key] = []
          }
          this.packageNumberObj[key].push(val)
        }
      }
      for (let item of Object.keys(this.packageNumberObj)) {
        this.mailingMethodsOptions = this.mailingMethodsOptions.concat(item)
      }
      return this.packageNumberObj
    },
    getPackageNumByName () { // 通过邮寄名获取对应包裹号
      let numArr = []
      for (let item of this.generateForm.packageNumList) {
        numArr = numArr.concat(this.packageNumberObj[item])
      }
      return numArr
    },
    getTreeDataList (list) { // 格式化邮寄树形数据
      for (let item in list) {
        let arr = list[item].map(it => {
          return it.split('>>')[1].trim()
        })
        this.treeDataList[0].disabled = false
        this.treeDataList[0].children.push({
          id: Math.random(),
          label: item,
          children: Array.from(new Set(arr)).map(it => {
            return {
              id: item + ' >> ' + it,
              label: it
            }
          })
        })
      }
      return this.treeDataList
    },
    treeCheck () { // 树形选中切换
      let lastLevelCheckedArr = arguments[1].checkedNodes.filter(item => !item.children || !item.children.length)
      let mailingMethodsArr = lastLevelCheckedArr.map(item => item.id)
      this.generateForm.packageNumList = mailingMethodsArr
      this.findGeneratePickingOrder()
    },
    generatePickingOrder () { // 生成拣货单
      this.$refs.form.validate(async valid => {
        if (!valid) return // 校验不通过
        let { orderType, packageType, remainingTime, salesChannels, sku, warehouseCode } = this.form
        if (!warehouseCode) {
          return this.$utils.commonUtils.tip('请选择仓库')
        }
        // if (!packageType || !packageType.length) {
        //   return this.$utils.commonUtils.tip('请选择包裹类型')
        // }
        // 必填的有this.generateForm下的3个属性，warehouseCode，共4个属性
        // console.log(this.getPackageNumByName())
        let data = Object.assign({}, this.generateForm, {
          orderType, packageType, remainingTime, salesChannels, sku, warehouseCode,
          packageNumList: this.getPackageNumByName()
        })
        this.generateButtonLoading = true
        let { data: resData = {}, errorCode } = await this.$api.OutgoingOperation.generatePickingOrder(data)
        this.generateButtonLoading = false
        if (errorCode === '100200') {
          this.resetData()
          this.$utils.commonUtils.tip('生成拣货单成功', 'success')
        }
      })
    },
    handleReset () { // 重置
      this.form = this.$options.data().form
      // if (this.warehouseList.length) {
      //   this.form.warehouseCode = this.warehouseList[0].dataCode
      // }
      this.resetData()
    },
    resetData () { // 成功后清空数据
      this.mailingMethodsOptions = []
      this.packageNumberObj = {}
      this.$refs.form.resetFields()
      this.generateForm = this.$options.data().generateForm
      this.treeDataList = this.$options.data().treeDataList
      this.generateData = this.$options.data().generateData
    },
    handleSearch () { // 搜索
      this.resetData()
      this.initFind = true
      this.findGeneratePickingOrder()
    },
    search () {
      this.initFind = true
      this.findGeneratePickingOrder()
    }
  }
}
</script>
