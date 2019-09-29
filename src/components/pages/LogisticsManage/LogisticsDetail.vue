<!--
 * @Description: In User Settings Edit
 * @Author: zcr
 * @Date: 2019-08-10 09:38:17
 * @LastEditTime: 2019-08-12 14:10:16
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="logisManage">
    <V-Title title="物流商-详情信息"></V-Title>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="0"></el-tab-pane>
      <el-tab-pane label="面单信息" name="1" :disabled="!isDetail"></el-tab-pane>
      <el-tab-pane label="时效及运费" name="2" :disabled="!isDetail"></el-tab-pane>
    </el-tabs>
    <div v-show="activeName==='0'">
      <div class="baseInfo pl-20 pr-20 pt-15">
        <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="130px" class="ruleForm">
          <el-form-item label="物流商简称">
            <el-input v-model="formData.logisticsShortened" placeholder="请输入" disabled></el-input>
          </el-form-item>
          <el-form-item label="物流商编码">
            <el-input v-model="formData.logisticsCode" placeholder="请输入" disabled></el-input>
          </el-form-item>
          <el-form-item label="运输方式名称" prop="methodCnName">
            <el-input v-model="formData.methodCnName" placeholder="请输入" maxlength="50" @change="changeMethodName" :disabled="isDetail"></el-input>
          </el-form-item>
          <el-form-item label="运输方式编码" prop="methodCode">
            <el-input v-model="formData.methodCode" placeholder="请输入" maxlength="100" @change="changeMethodCode" :disabled="isDetail"></el-input>
          </el-form-item>
          <el-form-item label="结算方式" prop="clearingForm">
            <el-select v-model="formData.clearingForm" placeholder="请选择" style="width: 100%" :disabled="isDetail">
              <el-option
                v-for="item in timeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地址最大长度" prop="maxAddressLength">
            <el-input v-model="formData.maxAddressLength" placeholder="请输入" maxlength="3" @keyup.native="getAddressLength" :disabled="isDetail"></el-input>
          </el-form-item>
          <el-form-item label="可用仓库" prop="optionalWarehouseS">     
            <el-select v-model="formData.optionalWarehouse" value-key='dataCode' placeholder="请选择" style="width: 100%" multiple @change="getOptionalWarehouse" :disabled="isDetail">
              <el-option
                v-for="item in warehouseOptions"
                :key="item.dataCode"
                :label="item.dataName"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="有无跟踪单号" prop="haveTrackNum">
            <el-select v-model="formData.haveTrackNum" placeholder="请选择" style="width: 100%" :disabled="isDetail">
              <el-option
                v-for="item in hasOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="揽收商" v-if="relationList.length">
          </el-form-item>
        </el-form>
        <el-form class="relationClass">
          <el-form-item v-for="(item,index) in relationList" :label="item.warehouseName" prop="b" :key="index"  label-width="130px">
            <el-select v-model="item.info" value-key='id' placeholder="请选择" style="width: 100%" :disabled="isDetail">
              <el-option
                v-for="item in relationOption"
                :key="item.id"
                :label="item.collectorName"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <div class="contactInfo">
          <span class="info">联系信息</span>
          <el-checkbox-group v-model="checked" @change="getInfoCheck" :disabled="isDetail">
            <el-checkbox label="0">寄件人信息</el-checkbox>
            <el-checkbox label="1">揽件人信息</el-checkbox>
            <el-checkbox label="2">退货人信息</el-checkbox>
          </el-checkbox-group>
        </div>
        <div v-if="checked.indexOf('0')!==-1">
          <div class="title">寄件人信息</div>
          <div class="importInfo">
            <span class="info">导入寄件人信息</span>
            <span>
              <el-select v-model="formData.senderId" placeholder="请选择" class='selectWidth' @change="getsenderInfo" clearable :disabled="isDetail">
                <el-option
                  v-for="item in senderList"
                  :key="item.id"
                  :label="item.addressName"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
          <el-form :model="sender" label-width="130px" class="ruleForm">
            <el-form-item label="寄件人姓名" prop="name">
              <el-input v-model="sender.name" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item label="寄件人公司" prop="company">
              <el-input v-model="sender.company" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item label="寄件人国家" prop="country">
              <el-select v-model="sender.country" disabled
                filterable  
                placeholder="请选择" 
                style="width: 100%">
                <el-option
                  v-for="item in countryList"
                  :key="item.id"
                  :label="item.countryName"
                  :value="item.id+''">
                </el-option>
              </el-select> 
            </el-form-item>
            <el-form-item label="寄件人地区" prop="a" class="senderAddress">
              <el-select v-model="sender.state" disabled
                placeholder="省/州">
                <el-option
                  v-for="item in stateList"
                  :key="item.id"
                  :label="item.countryName"
                  :value="item.id+''">
                </el-option>
              </el-select>
              <el-select v-model="sender.city" placeholder="城市" disabled>
                <el-option
                  v-for="item in cityList"
                  :key="item.id"
                  :label="item.countryName"
                  :value="item.id+''">
                </el-option>
              </el-select>
              <el-input v-model="sender.district" placeholder="地区" disabled></el-input>
            </el-form-item>
            <el-form-item label="寄件人详细地址" prop="street">
              <el-input v-model="sender.street" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item label="寄件人邮编" prop="postcode">
              <el-input v-model="sender.postcode" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item label="寄件人邮箱" prop="email">
              <el-input v-model="sender.email" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item label="寄件人联系方式" prop="mobile">
              <el-input v-model="sender.mobile" placeholder="请输入" disabled></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="checked.indexOf('1')!==-1">
          <div class="title">揽收人信息</div>
          <div class="importInfo">
            <span class="info">导入揽收人信息</span>
            <span>
              <el-select v-model="formData.collectManId" placeholder="请选择" class='selectWidth' @change="getCollectMan" :disabled="isDetail">
                <el-option
                  v-for="item in tookerList"
                  :key="item.id"
                  :label="item.addressName"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
          <el-form :model="collectMan" label-width="130px" class="ruleForm">
            <el-form-item label="揽收人姓名" prop="name">
              <el-input v-model="collectMan.name" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item label="揽收人公司" prop="company">
              <el-input v-model="collectMan.company" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item label="揽收人国家" prop="country">
              <el-select v-model="collectMan.country" disabled
                filterable 
                placeholder="请选择" 
                style="width: 100%">
                <el-option
                  v-for="item in countryList"
                  :key="item.id"
                  :label="item.countryName"
                  :value="item.id+''">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="揽收人地区" prop="a" class="senderAddress">
              <el-select v-model="collectMan.state" disabled
                placeholder="省/州">
                <el-option
                  v-for="item in stateList1"
                  :key="item.id"
                  :label="item.countryName"
                  :value="item.id+''">
                </el-option>
              </el-select>
              <el-select v-model="collectMan.city" placeholder="城市" disabled>
                <el-option
                  v-for="item in cityList1"
                  :key="item.id"
                  :label="item.countryName"
                  :value="item.id+''">
                </el-option>
              </el-select>
              <el-input v-model="collectMan.district" placeholder="地区" disabled></el-input>
            </el-form-item>
            <el-form-item label="揽收人详细地址" prop="street">
              <el-input v-model="collectMan.street" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item label="揽收人邮编" prop="postcode">
              <el-input v-model="collectMan.postcode" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item label="揽收人邮箱" prop="email">
              <el-input v-model="collectMan.email" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item label="揽收人联系方式" prop="mobile">
              <el-input v-model="collectMan.mobile" placeholder="请输入" disabled></el-input>
            </el-form-item>
          </el-form>
        </div> 
        <div v-show="checked.indexOf('2')!==-1">
          <div class="title">退货人信息</div>
          <div class="importInfo">
            <span class="info">导入退货人信息</span>
            <span>
              <el-select v-model="formData.refunderId" placeholder="请选择" class='selectWidth' @change="getRefunder" :disabled="isDetail">
                <el-option
                  v-for="item in returnList"
                  :key="item.id"
                  :label="item.addressName"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
          <el-form :model="refunder" label-width="130px" class="ruleForm">
            <el-form-item label="退货人姓名" prop="name">
              <el-input v-model="refunder.name" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item label="退货人公司" prop="acompany">
              <el-input v-model="refunder.company" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item label="退货人国家" prop="country">
              <el-select v-model="refunder.country" disabled
                filterable
                placeholder="请选择" 
                style="width: 100%">
                <el-option
                  v-for="item in countryList"
                  :key="item.id"
                  :label="item.countryName"
                  :value="item.id+''">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="退货人地区" prop="a" class="senderAddress">
              <el-select v-model="refunder.state" disabled
                placeholder="省/州">
                <el-option
                  v-for="item in stateList2"
                  :key="item.id"
                  :label="item.countryName"
                  :value="item.id+''">
                </el-option>
              </el-select>
              <el-select v-model="refunder.city" placeholder="城市" disabled>
                <el-option
                  v-for="item in cityList2"
                  :key="item.id"
                  :label="item.countryName"
                  :value="item.id+''">
                </el-option>
              </el-select>
              <el-input v-model="refunder.district" placeholder="地区" disabled></el-input>
            </el-form-item>
            <el-form-item label="退货人详细地址" prop="street">
              <el-input v-model="refunder.street" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item label="退货人邮编" prop="postcode">
              <el-input v-model="refunder.postcode" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item label="退货人邮箱" prop="email">
              <el-input v-model="refunder.email" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item label="退货人联系方式" prop="mobile">
              <el-input v-model="refunder.mobile" placeholder="请输入" disabled></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="platform">
            <div class="title">可发货平台</div>
            <el-checkbox-group v-model="checkedPlatform" class='select-box' :disabled="isDetail">
              <el-checkbox v-for='item in platformList' :label="item.platformCn" :key='item.platformCode'></el-checkbox>
            </el-checkbox-group>
        </div>     
      </div>
      <V-BottomBtn v-if="isDetail" :buttonList="buttonListU" :noBack="noBack" @cancel="toBack" @edit="toUpdate"></V-BottomBtn>
      <V-BottomBtn v-else :buttonList="buttonList" :noBack="noBack" @cancel="toBack" @save="submit"></V-BottomBtn>
    </div>
    <div v-show="activeName==='1'">
      <div class="printContainer pl-20 pr-20 pt-15">
        <orderInformation></orderInformation>  
      </div>
    </div>
    <div v-show="activeName==='2'">
      <div class="printContainer pl-20 pr-20 pt-15">
        <LogisticsFreight :Logistics='$route.query.Logistics' :id='methodId' :logisticsMethodCode='methodCode' :logisticsMethodName='methodCnName'></LogisticsFreight>  
      </div>
    </div>
  </div>
</template>

<script>
import orderInformation from './OrderInformation';
import LogisticsFreight from './LogisticsFreight'
export default {
  name:'LogisticsManage_LogisticsManManage',
  data () {
    return {
      addToEdit: false,
      warehouseOptions: [], // 仓库下拉数据
      platformList: [], // 可用平台
      checkedPlatform: [],
      methodId: '', // 当前记录的运输方式ID
      methodCnName: '', // 当前记录的运输方式名称
      methodCode: '', // 当前记录的运输方式编码
      isDetail: false, // 是否点击查看按钮进来
      isRepeatN: false, // 运输方式名称是否与已存在的数据重复
      isRepeatC: false, // 运输方式编码是否与已存在的数据重复
      senderList: [], // 寄件人地址
      tookerList: [], // 揽收人地址
      returnList: [], // 退货人地址
      activeName: '0',
      checked: [],
      options: [{
        value: '1',
        label: '寄件人信息'
      }],
      formData: {
        isValid: '1', // 是否有效 
        logisticsShortened: '', // 物流商名称
        logisticsCode: '', // 物流商编码
        methodCnName: '', // 运输方式名称
        methodCode: '', // 运输方式编码
        clearingForm: '', // 结算方式
        maxAddressLength: '', // 地址最大长度
        haveTrackNum: '', // 有无跟踪单号
        optionalWarehouse: [], // 可用仓库
        optionalWarehouseS: '', // 可用仓库校验
        collectManId: '', // 揽收人信息(关联邮寄方式角色表主键)
        refunderId: '', // 退货人信息(关联邮寄方式角色表主键)
        senderId: '', // 寄件人信息(关联邮寄方式角色表主键)
        providerId: '', // 关联物流商表主键
        supportPlatformList: [],
      },
      relationOption: [], // 揽收商下拉数据
      relationList: [], // 揽收商
      sender: {}, // 寄件人信息
      collectMan: {}, // 揽收人信息
      refunder: {}, // 退货人信息
      rules: {
        methodCnName: [{ required: true, message: '请输入运输方式名称', trigger: 'blur' }],
        methodCode: [{ required: true, message: '请输入运输方式编码', trigger: 'blur' }],
        clearingForm: [{ required: true, message: '请选择结算方式', trigger: 'blur' }],
        optionalWarehouseS: [{ required: true, message: '请选择可用仓库', trigger: 'blur' }],
        haveTrackNum: [{ required: true, message: '请选择有无跟踪单号', trigger: 'blur' }],
      },
      buttonListU:[
        {
          name:'返回',    //按钮名称
          emitType:'cancel'    //方法
        },
        {
          name:'修改',    //按钮名称
          type:true,    //是否为主按钮-可不传
          emitType:'edit'    //方法
        },
      ],
      buttonList:[
        {
          name:'取消',    //按钮名称
          emitType:'cancel'    //方法
        },
        {
          name:'保存',    //按钮名称
          type:true,    //是否为主按钮-可不传
          emitType:'save'    //方法
        },
      ],
      noBack: true,   // 为true时不需要返回按钮
      countryList:[], // 国家列表
      stateList:[],  // 省份列表 寄件人
      cityList:[], // 城市列表 寄件人
      stateList1:[],  // 省份列表 揽收人
      cityList1:[], // 城市列表 揽收人
      stateList2:[],  // 省份列表 退货人
      cityList2:[], // 城市列表 退货人
      timeOption: [{
          value: 1,
          label: '周结'
        },{
          value: 2,
          label: '半月结'
        },{
          value: 3,
          label: '月结'
        }],
        hasOption: [{
          value: 1,
          label: '有'
        },{
          value: 0,
          label: '无'
        }
      ]
    }
  },
  activated() {
    localStorage.setItem('activeMenu','/LogisticsManage/LogisticsManManage')
    this.$store.commit('SET_ACTIVE','/LogisticsManage/LogisticsManManage')
    this.activeName = "0" 
    // 点击新添进来初始化数据 清校验
    if(this.$route.query.type === '1' && this.$store.state.warehouse.isFreshAddL) {
      Object.assign(this.$data, this.$options.data())
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
      this.$store.commit("getFreshAddL", false)
    }
    this.getSelectCollector() // 获取物流揽收商数据
    this.getAddressSettingList() // 获取地址信息  寄件人，揽收人，退货人
    this.getLogisticsDetail() // 获取对应物流商详情信息
    this.getWareHouseList() // 获取可用仓库数据
    this.getPlathformList()
  },
  created() {
    this.$store.commit("getFreshAddL", true)
  },
  methods: {
    // 获取仓库下拉框数据
    getWareHouseList() {
      this.$api.Warehousing.getWareHouseList().then(res => {
        if(res.errorCode === '100200'){
          this.warehouseOptions = res.data
        }else{
          this.$utils.commonUtils.tip(res.msg,'error')
        }
      }).catch(error => {

      })
    },
    // 获取平台列表
    async getPlathformList (){
      let params = {
        page: 1,
        row: 1000
      }
      let res = await this.$api.Warehousing.getplathformList(params)
      this.platformList = res.data.pageInfo.list.filter(item => {
        return item.isValid === 1
      })
      console.log(this.platformList)     
    },
    // 获取 国家、省、市
    async cascaderChangeHandle(val, propList) {
      let { data = [] } = await this.$api.LogisticsManage.getCountryCascader(val)
      this[propList] = data
      console.log(propList,this[propList])
    },
    // 地址最大长度 数字校验
    getAddressLength(val) {
      this.formData.maxAddressLength = this.formData.maxAddressLength.replace(/[^\d]/g,'')
    },
    // 查看运输方式数据详情
    async getSelectMethod(param) {
      let param0 = {
        page:1,
        row:10
      }
      let params = {}
      Object.assign(params,param0,param)
      const res = await this.$api.LogisticsManage.getSelectMethod(params)
      let list = []
      if(res.errorCode === '100200') {
        list = res.data.pageInfo.list
      }
      return list
    },
    // 更改运输方式名称
    async changeMethodName(val) {
      this.isRepeatN = false
      // 修改页面如果与进页面值一样时无需校验
      if(this.$route.query.type === '2' && this.methodCnName === val) {
        return
      }
      const list = await this.getSelectMethod({methodCnName: val})
      if(list.length) {
        this.$message.error('该运输方式名称已存在，请重新输入！')
        this.isRepeatN = true
      }
    },
    // 更改运输方式编码
    async changeMethodCode(val) {
      this.isRepeatC = false
      // 修改页面如果与进页面值一样时无需校验
      if(this.$route.query.type === '2' && this.methodCode === val) {
        return
      }
      const list = await this.getSelectMethod({methodCode: val})
      if(list.length) {
        this.$message.error('该运输方式编码已存在，请重新输入！')
        this.isRepeatC = true
      }
    },
    // 选择寄件人信息
    getsenderInfo() {
      console.log(this.senderList)    
      this.senderList.forEach(item => {
        if(item.id === this.formData.senderId) {
          this.sender = item
          // 获取国家
          this.cascaderChangeHandle('', 'countryList').then(() => {
            if (!this.sender.country) return
            this.cascaderChangeHandle(this.sender.country, 'stateList').then(() => {
            if (!this.sender.state) return
            this.cascaderChangeHandle(this.sender.state, 'cityList')
            })
          })
        }
      })
      console.log(this.sender)      
    },
    // 选择揽收人信息
    getCollectMan() {
      console.log(this.tookerList)     
      this.tookerList.forEach(item => {
        if(item.id === this.formData.collectManId) {
          this.collectMan = item
          // 获取国家
          this.cascaderChangeHandle('', 'countryList').then(() => {
            if (!this.collectMan.country) return
            this.cascaderChangeHandle(this.collectMan.country, 'stateList1').then(() => {
            if (!this.collectMan.state) return
            this.cascaderChangeHandle(this.collectMan.state, 'cityList1')
            })
          })
        }
      })
    },
    // 选择退货人信息
    getRefunder() {
      this.returnList.forEach(item => {
        if(item.id === this.formData.refunderId) {
          this.refunder = item
          // 获取国家
          this.cascaderChangeHandle('', 'countryList').then(() => {
            if (!this.refunder.country) return
            this.cascaderChangeHandle(this.refunder.country, 'stateList2').then(() => {
            if (!this.refunder.state) return
            this.cascaderChangeHandle(this.refunder.state, 'cityList2')
            })
          })
        }
      })
    },
    // 获取对应物流商详情信息
    async getLogisticsDetail() {
      this.checkedPlatform = [] // 清除选中平台
      // 点击详情进页面的 调运输方式详情接口
      if(this.$route.query.type === '2' && this.$store.state.warehouse.isFreshAddL) {
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate()
        })
        this.$store.commit("getFreshAddL", false)
        this.isDetail = true
        const list = await this.$api.LogisticsManage.getSelectMethodByID({methodId:this.$route.query.Logistics}).then(res=>{
          if(res.errorCode == '100200'){
            console.log(res.data);
            
            this.formData = res.data
            // 保存当前记录运输方式ID，名称和编码 时效及运费tab页需要
            this.methodId = this.formData.id        
            this.methodCnName = this.formData.methodCnName
            this.methodCode = this.formData.methodCode
            // 联系信息回显
            if(this.formData.senderId) {
              this.checked.push('0')
              this.getsenderInfo()
            }
            if(this.formData.collectManId) {
              this.checked.push('1')
              this.getCollectMan()
            }
            if(this.formData.refunderId) {
              this.checked.push('2')
              this.getRefunder()
            }
            // 可用仓库回显
            this.relationList = res.data.relationList
            let arr = []
            this.relationList.forEach((item,index) => {
              arr.push({id:item.warehouseId,dataCode:item.warehouse,dataName:item.warehouseName})
              this.$set(item,'info',{id:item.collectorId,collectorName:item.collectorName,collectorCode:item.collectorCode})
            })
            this.formData.optionalWarehouse = arr
            if(arr.length) {
              this.$set(this.formData,'optionalWarehouseS','11111111')
            }
            if(this.formData.supportPlatformList) {
              let arr = this.formData.supportPlatformList.filter(item => {
                return item.isValid === 1
              })
              arr.forEach(item => {
                this.checkedPlatform.push(item.platformCn)
              })
            }
          }
        })
      }
      let params={
        page:1,
        row:10,
        id:this.$route.query.id
      }
      const res = await this.$api.LogisticsManage.getLogisticsList(params).then(res=>{
        if(res.errorCode == '100200'){
          console.log(res.data)
          let data = res.data.pageInfo.list[0]
          this.formData.providerId = data.id
          this.formData.logisticsShortened = data.logisticsShortened
          this.formData.logisticsCode = data.logisticsCode
          // this.formData.isValid = data.isValid 
        }
      })
      console.log(this.formData)         
    },
    // 选择可选仓库 push可选仓库对应揽收商信息
    getOptionalWarehouse() {
      let warehouseArr = []
      this.relationList.forEach(item => {
        warehouseArr.push(item.warehouse)
      })
      let arr = []
      this.formData.optionalWarehouse.forEach((item,index) => {
        if(this.relationList.length && warehouseArr.indexOf(item.dataCode) !== -1) {
          arr.push(this.relationList[warehouseArr.indexOf(item.dataCode)])
        } else {
          arr.push({warehouseId: item.id,warehouse: item.dataCode,warehouseName: item.dataName, info:{}})
        }    
      })
      this.relationList = arr
      if(arr.length) {
        this.$set(this.formData,'optionalWarehouseS','11111111')
      }
      console.log(this.relationList);
      
    },
    // 获取物流揽收商数据
    getSelectCollector() {
      let params = {
        page: '1',
        row: '9999'
      }
      this.$api.LogisticsManage.getSelectCollector(params).then(res => {
        if(res.errorCode === '100200') {
          console.log(res.data)
          this.relationOption = res.data.pageInfo.list  
        }
      })
    },
    // 获取地址信息  寄件人，揽收人，退货人
    getAddressSettingList() {
      let params = {
        page: '1',
        row: '9999'
      }
      this.$api.LogisticsManage.getAddressSettingList(params).then(res => {
        if(res.errorCode === '100200') {
          let list = res.data.pageInfo.list
          this.senderList = list.filter(item => {
            return item.type === 1
          })
          this.tookerList = list.filter(item => {
            return item.type === 2
          })
          this.returnList = list.filter(item => {
            return item.type === 3
          })
        }
      })
    },
    // 切换tab
    handleClick(tab) {
      // Object.assign(this.$data, this.$options.data())
      this.activeName = tab.name
    },
    // 返回列表页
    toBack() {
      this.$router.push({path:'/LogisticsManage/LogisticsManManageDetail',query:{activeName:'second',id:this.$route.query.id}})
    },
    // 变为可编辑状态
    toUpdate() {
      this.isDetail = false
      if(this.$route.query.type === '1') {
        // this.$router.push({path: '/LogisticsManage/LogisticsDetail', query: {id: this.$route.query.id,Logistics:this.methodId,type:'2'}})
        this.addToEdit = true
      }
      this.$store.commit("getFreshAddL", true)
      console.log(this.isDetail)  
    },
    // 提交运输方式基本信息
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        if(valid) {
          if(this.isRepeatN || this.isRepeatC) {
            this.$message.error('运输方式名称或编码与已存在数据重复，请重新输入！')
            return
          }
          let relationList = []
          for (let i = 0; i < this.relationList.length; i++) {
            const item = this.relationList[i]
            if(!item.info.id) {
              this.$message.error('请将揽收商信息填写完整！')
              return
            }
            relationList.push({
              warehouseId: item.warehouseId || item.id,
              warehouse: item.warehouse,
              warehouseName: item.warehouseName,
              collectorId: item.info.id,
              collectorName: item.info.collectorName,
              collectorCode:item.info.collectorCode
            })
          }
          let supportPlatformList = []
          if(this.checkedPlatform) {
            this.checkedPlatform.forEach(item0 => {
              this.platformList.forEach((item,index) => {
                if(item0 === item.platformCn) {
                  supportPlatformList.push({platformId:item.id,isValid:item.isValid})
                }
              })
            })
          }
          this.formData.supportPlatformList = supportPlatformList
          console.log(this.formData.supportPlatformList)
          
          if(this.checked.indexOf('0') !== -1 && !this.formData.senderId) {
            this.$message.error('请选择寄件人信息！')
            return
          }
          if(this.checked.indexOf('1') !== -1 && !this.formData.collectManId) {
            this.$message.error('请选择揽收人信息！')
            return
          }
          if(this.checked.indexOf('2') !== -1 && !this.formData.refunderId) {
            this.$message.error('请选择退货人信息！')
            return
          }
          this.formData.relationList = relationList
          if(this.$route.query.type === '2' || (this.$route.query.type === '1' && this.addToEdit)) {
            if(this.$route.query.Logistics) {
              this.formData.id = this.$route.query.Logistics
            } else {
              this.formData.id = this.methodId
            }
          }
          this.$api.LogisticsManage.addEditMethod(this.formData).then(res => {
            if(res.errorCode === '100200') {
              if(this.$route.query.type === '2' || (this.$route.query.type === '1' && this.addToEdit)) {
                this.$message.success('编辑成功！')
                this.isDetail = true
                if(this.addToEdit) {
                  this.addToEdit = false
                }
              } else {           
                this.$message.success('添加成功！')
                this.isDetail = true
                // 保存当前记录运输方式ID 时效及运费tab页需要
                this.methodId = res.data               
                console.log(this.methodId,'methodIdmethodId')              
              }
              // 保存当前记录运输方式名称和编码 时效及运费tab页需要
              this.methodCnName = this.formData.methodCnName
              this.methodCode = this.formData.methodCode
              // this.$router.push({path:'/LogisticsManage/LogisticsManManageDetail',query:{activeName:'second',id:this.$route.query.Logistics}})
            }
          })
        }
      })
    },
    // 联系信息 勾选取消 数据初始化
    getInfoCheck() {
      if(this.checked.indexOf('0') === -1) {
        this.sender = {}
        this.formData.senderId = ''
      }
      if(this.checked.indexOf('1') === -1) {
        this.collectMan = {}
        this.formData.collectManId = ''
      }
      if(this.checked.indexOf('2') === -1) {
        this.refunder = {}
        this.formData.refunderId = ''
      }
    }
  },
  components:{
    orderInformation,
    LogisticsFreight
  }
}
</script>

<style lang='scss' >
.logisManage {
  .title-cont {
    padding-bottom: 0!important;
    border-bottom: none!important;
  }
  .el-tabs__nav {
    margin-left: 20px;
  }
  .ruleForm {
    display: flex;
    flex-wrap: wrap;
  }
  .el-form-item {
    width: 360px;
    margin-right: 200px;
  }
  .baseInfo {
    .platform {
      margin-bottom: 20px;
    }
    .contactInfo {
      padding: 20px;
      border-top: 2px solid #eee;
      .el-checkbox-group {
        display: inline;
      }
      .info {
        margin-right: 10px;
        margin-left: 40px;
        color: #666;
      }
    }
    .title {
      height: 40px;
      line-height: 40px;
      background: #EFF1F5;
      color: #000;
      padding-left: 14px;
      margin-bottom: 17px;
      .iconDelete{
        color: #2A8BFF;
        font-size: 12px;
        float: right;
        margin-right: 10px;
        .iconyichu {
          margin-right: 2px;
        }
      }
    }
    .senderAddress {
      .el-select {
        width: 110px;
      }
      .el-input {
        width: 110px;
      }
    }
    .el-form-item.senderAddress {
      width: 540px;
      margin-right: 136px;
    }
    .importInfo {
      margin-bottom: 18px;
      margin-left: 20px;
      color: #666;
      .info {
        margin-right: 8px;
      }
      .selectWidth {
        width: 230px;
      }
    }
    @media screen and (max-width: 1440px) {
      .contactInfo {
        .info {
          margin-left: 50px;
        }
      }
      .importInfo {
        margin-bottom: 15px;
        margin-left: 35px;
        .info {
          margin-right: 7px;
        }
        .selectWidth {
          width: 230px;
        }
      }
    }
    .el-checkbox-group.select-box {
      margin-left: 22px;
    }
  }
}
</style>