<template>
<div class="client-info-box">
  <V-Title v-if='id' title="编辑客户信息"></V-Title>
  <V-Title v-else title="新添客户信息"></V-Title>
  <div class="p-20 form-cont client-modify-box">
    <el-form :inline="true" :rules="formRules" :model="fromData" ref="detail" class="demo-form-inline" label-width='100px'>
      <el-form-item label="客户编码" prop="customerCode">
        <el-input  clearable :disabled="true"  placeholder="" v-model="fromData.customerCode"></el-input>
      </el-form-item>
      <el-form-item label="客户中文名" prop="chineseName">
        <el-input clearable  placeholder="" v-model="fromData.chineseName"></el-input>
      </el-form-item>
      <el-form-item label="客户英文名" prop="englishName">
        <el-input clearable  placeholder="" v-model="fromData.englishName"></el-input>
      </el-form-item>
      <el-form-item label="客户状态" prop="status">
        <el-select  placeholder="" v-model="fromData.status">
            <el-option  v-for="item in MaBiaoObj.putaway_strategy_statusList"
              :key="item.dataCode" :label="item.dataName" :value="item.dataCode"
            ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户ID" prop="customerAppId">
        <el-input clearable :disabled="true" placeholder="" v-model="fromData.customerAppId"></el-input>
      </el-form-item>
      <el-form-item label="客户秘钥" prop="customerSecretKey">
        <el-input clearable  :disabled="true" placeholder="" v-model="fromData.customerSecretKey"></el-input>
      </el-form-item>
      <el-form-item label="所在地区" prop="provincial"  class="provincialItem">
            <el-select v-model="fromData.provincial" placeholder="请选择省" @change="((val)=>{getCity(val, 1)})" style="width: 126px;margin-right: 10px">
              <el-option v-for="item in provinceOptions"
                :id="item.id"
                :data-dataName="item.name"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="fromData.city" placeholder="请选择市" @change="((val)=>{getArea(val, 1)})" style="width: 125px;margin-right: 10px">
              <el-option v-for="item in cityOptions"
                :id="item.id"
                :data-dataName="item.name"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="fromData.district" placeholder="请选择区" @change="((val)=>{getAreaName(val, 1)})" style="width: 125px;">
              <el-option v-for="item in regionOptions"
                :id="item.id"
                :data-dataName="item.name"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                >
              </el-option>
            </el-select>
          </el-form-item>
      
      <el-form-item label="详细地址" prop="address">
        <el-input  clearable  placeholder="" v-model="fromData.address"></el-input>
      </el-form-item>
      <el-form-item label="销退质检方式" prop="cancellationRefundCode" @change="cancellationRefundFn">
        <el-select  placeholder="" v-model="fromData.cancellationRefundCode">
            <el-option  v-for="item in MaBiaoObj.receive_arrival_notice_quality_typeList"
              :key="item.dataCode" :label="item.dataName" :value="`${item.dataCode}|${item.dataName}`">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联系人" prop="contacts">
        <el-input  clearable  placeholder="" v-model="fromData.contacts"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="contactWay">
        <el-input  clearable  placeholder="" v-model="fromData.contactWay"></el-input>
      </el-form-item>
    </el-form>
  </div>
  <div class="shelfTableBlock">
      <div class="title">
        <strong>货主信息</strong>
      </div>
      <div class="tableClass clearfix">
        <div class="mb-10 clearfix">
          <button type="button" class="addbtn fr" @click="addshipperInfoBox" v-show="btnPermission('新添货主')">
            <i class="iconfont iconchuangjianqiaban"></i>
            <span>添加货主</span>
          </button>
        </div>
        <V-Table 
        :dataSource="dataSource" 
        @modifyShipperInfo = 'modifyShipperInfo' 
        class="table-main" 
        ></V-Table>
      </div>
      <!-- <V-BottomBtn  @toBack="toBack"></V-BottomBtn> -->
    </div>
  <el-dialog
    :title="CargoOwnerBoxTitle"
    :visible.sync="addCargoOwnerBox"
    :close-on-press-escape='false'
    :before-close='hideAddCargoOwnerBox'
    :closeOnClickModal='false'
    width="565px"
    class='return-box'
    >
    <div class="CargoOwnerBox">
        <el-form label-position="right" label-width="100px" :rules="CargoOwnerRules" ref="CargoOwnerRef" :model="shipperInfoList">
          <el-form-item label="货主编码" prop="shipperCode">
            <el-input  :disabled="CargoOwnerBoxTitle == '修改货主信息'" v-model="shipperInfoList.shipperCode"></el-input>
          </el-form-item>
          <el-form-item label="货主名称" prop="shipperName">
            <el-input v-model="shipperInfoList.shipperName"></el-input>
          </el-form-item>
          <el-form-item label="所在地区" prop="provincial">
            <el-select v-model="shipperInfoList.provincial" placeholder="请选择省" @change="((val)=>{getCity(val, 2)})" style="width: 126px;margin-right: 10px">
              <el-option v-for="item in provinceOptions"
                :id="item.id"
                :data-dataName="item.name"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="shipperInfoList.city"  placeholder="请选择市" @change="((val)=>{getArea(val, 2)})" style="width: 125px;margin-right: 10px">
              <el-option v-for="item in cityOptions"
                :id="item.id"
                :data-dataName="item.name"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="shipperInfoList.district" placeholder="请选择区" @change="((val)=>{getAreaName(val, 2)})" style="width: 125px;">
              <el-option v-for="item in regionOptions"
                :id="item.id"
                :data-dataName="item.name"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="shipperInfoList.address"></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="contacts">
            <el-input v-model="shipperInfoList.contacts"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="contactWay">
            <el-input v-model="shipperInfoList.contactWay"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="hideAddCargoOwnerBox">取 消</el-button>
          <el-button type="primary" @click="submitClient()">确 定</el-button>
        </span>
    </div>
</el-dialog>
  <V-BottomBtn :buttonList="buttonList"  :noBack="noBack" @toBack="toBack" @subm="submit"></V-BottomBtn>
</div>
</template>

<script>
import { shipperInfoTable } from './cols'
import '../../../assets/css/UserManame/client.scss'
export default {
  name: 'UserManage_ClientInfoModify',
  data () {
    return {
      id:'',
      formRules:{
        customerCode: [{ required: true, message: "请输入客户编码", trigger: "blur" }],
        chineseName: [{ required: true, message: "请输入客户中文名", trigger: "blur" }],
        provincial: [{ required: true, message: "请选择所在地", trigger: "blur" }],
        address: [{ required: true, message: "请输入详细地址", trigger: "blur" }],
        contacts: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        contactWay: [{ required: true, message: "请输入联系方式", trigger: "blur" }],
      },
      fromData:{
        customerCode:"",		//客户编码
        chineseName:"",		//客户中文名
        englishName:"",		//客户英文名
        status:"",			//客户状态
        customerAppId:"",		//客户ID
        customerSecretKey:"",		//销退质检方式
        contacts:"",			//联系人
        contactWay:"",		//联系方式
      },
      addCargoOwnerBox:false,  //添加货主信息弹窗-判断
      CargoOwnerRules:{
        shipperCode: [
          { required: true, message: '请填写货主编码', trigger: 'blur' },
          {validator:(rule,val,fn)=>{
            if(!/^[0-9]\d*$|^0$/i.test(val)){
              fn(new Error('只能输入纯数字'))
            }else{
              fn()
            }
          }}
        ],
        shipperName: [{ required: true, message: '请填写货主名称', trigger: 'blur' }],
        address: [{ required: true, message: '请填写详细地址', trigger: 'blur' }],
        contacts: [{ required: true, message: '请填写联系人', trigger: 'blur' }],
        contactWay: [
          { required: true, message: '请填写联系方式', trigger: 'blur' },
          {validator:(rule,val,fn)=>{
            if(!/^[^[\u4e00-\u9fa5]][\W]|\d$/.test(val)){
              fn(new Error('只能输入纯数字'))
            }else{
              fn()
            }
          }}  
        ],
        provincial:[{required: true, message: '请选择所在地区', trigger: 'change'}]
      },
      shipperInfoList:{
        address: "",  //详细地址
        city: "", // 市
        contactWay: "", //联系方式
        district: "", //区
        provincial: "", //省
        shipperCode: "",  //货主编码
        shipperName: "", //货主名称
        contacts:"",  //联系人
      },
      dataSource: {
        data: [], // 表格数据
        cols: shipperInfoTable, // 表格的列数据
        isSelection: false, // 表格有多选时设置
        isOperation: true, // 表格有操作列时设置
        operation: { // 表格有操作列时设置
                label: '操作', // 列名
                width: '80', // 根据实际情况给宽度
                data: [
                    {
                        label: '修改', // 操作名称
                        emitType: 'modifyShipperInfo', // 触发父组件
                        permission: '货主修改', // 后期这个操作的权限，用来控制权限
                    },
                ]
            }
      },
      buttonList:[
        {
            name:'返回',    //按钮名称
            emitType:'toBack'    //方法
        },
        // {
        //     name:'保存',    //按钮名称
        //     type:true,    //是否为主按钮-可不传
        //     emitType:'subm',    //方法
        //     disabState:false
        // },
      ],
      noBack: true,  // 为true时不需要返回按钮
      provinceOptions:[],
      cityOptions:[],
      regionOptions:[],
      addressIdArr:[],
      id:'',  //客户id
      clickRowId:'',  //货主id
      CargoOwnerBoxTitle:'新添货主信息'
    }
  },
  activated(){
    this.getMoreMaList('receive_arrival_notice_quality_type','putaway_strategy_status')
    this.getProv()
    this.id = this.$route.query.id    
  },
  deactivated(){
    this.addCargoOwnerBox = false
  },
  methods: {
    search(){ //获取客户信息
      let params = this.id
      this.$api.UserManage.getCustomerDetail(params).then(res=>{
        if(res.errorCode == '100200'){
          try{
            this.$refs.detail.resetFields();
          }catch(e){}
          this.fromData = res.data
          this.dataSource.data = res.data.shipperInfoList
          if(this.provinceOptions.length != 0){
            let provinceOptionsItem ={}
            this.provinceOptions.forEach(item =>{  
              if(item.name == res.data.provincial){
                provinceOptionsItem = item
              }
            })
            this.getCity(provinceOptionsItem.id,3)
          }
          this.getProv()
        }else{
          this.$utils.commonUtils.tip('请刷新之后重试','error')
        }
      })
    },
    iscityNullFn(type){ //判断省份城市是否已经选中有值
      if(type == 1){
        if(this.cityOptions.length != 0 && this.fromData.city == '' ){
          this.$utils.commonUtils.tip('市区还没有选择','error')
          this.buttonList[1].disabState = false
          return false
        }
        else if(this.regionOptions.length !=0 && this.fromData.district == ''){
          this.$utils.commonUtils.tip('城市还有选择','error')
          this.buttonList[1].disabState = false
          return false
        }else{
          return true
        }
      }
      if(type == 2){
        if(this.cityOptions.length != 0 && this.shipperInfoList.city == '' ){
          this.$utils.commonUtils.tip('市区还没有选择','error')
          this.buttonList[1].disabState = false
          return false
        }
        else if(this.regionOptions.length !=0 && this.shipperInfoList.district == ''){
          this.$utils.commonUtils.tip('城市还有选择','error')
          this.buttonList[1].disabState = false
          return false
        }else{
          return true
        }
      }
    },
    submit(){   //保存按钮提交数据
      this.buttonList[1].disabState = true
      if(!this.iscityNullFn(1)) return false
      this.$refs['detail'].validate((valid)=>{
        if(valid){
          let params = this.fromData
          this.$api.UserManage.updateCustomer(params).then(res=>{
              if(res.errorCode == '100200'){
                this.$utils.commonUtils.tip(res.msg,'success')
                this.$refs.detail.clearValidate()
                this.buttonList[1].disabState = false
                this.$router.push('/UserManage/ClientInfo')
              }else{
                this.buttonList[1].disabState = false
              }
          })
        }else{
          this.buttonList[1].disabState = false
          this.$utils.commonUtils.tip('请先通过验证','error')
        }
      })

    },
    submitClient(){   //添加&&修改货主信息
      if(!this.iscityNullFn(2)) return false
      this.$refs["CargoOwnerRef"].validate((valid) => {
        let params = this.shipperInfoList
        if(valid){
          if(this.CargoOwnerBoxTitle=='新添货主信息'){
            params.customerId = this.id
            this.$api.UserManage.addShipperInfo(params).then(res=>{
                if(res.errorCode == '100200'){
                  this.addCargoOwnerBox = false
                  this.$utils.commonUtils.tip(res.msg,'success')
                  this.$refs.detail.clearValidate()
                  this.search()
                }
            })
          }else{
            params.id = this.clickRowId
            params.customerId = this.id
            this.$api.UserManage.updateCargoOwnerInfo(params).then(res=>{
                if(res.errorCode == '100200'){
                  this.addCargoOwnerBox = false
                  this.$utils.commonUtils.tip(res.msg,'success')
                  this.$refs.detail.clearValidate()
                  this.search()
                }
            })
          }
        }else{
          this.$utils.commonUtils.tip('请先通过验证','error')
        }
      })
    },
    modifyShipperInfo(index,rowData){  //修改货主弹窗&回填内容
      this.clickRowId = rowData.id
      this.CargoOwnerBoxTitle = '修改货主信息'
      this.shipperInfoList = rowData
      if(this.provinceOptions.length != 0){
        let provinceOptionsItem =this.provinceOptions.find(item =>{return item.name == rowData.provincial})
        this.getCity(provinceOptionsItem.id,4)
      }
      this.addCargoOwnerBox = true
    },
    addshipperInfoBox(){  //添加货主弹窗
      try{
        this.shipperInfoList = {
          address: "",  //详细地址
          city: "", // 市
          contactWay: "", //联系方式
          district: "", //区
          provincial: "", //省
          shipperCode: "",  //货主编码
          shipperName: "", //货主名称
          contacts:"",  //联系人
        }
        this.shipperInfoList.provincial = this.provinceOptions[0].name
        this.getCity(this.provinceOptions[0].id,2)
        this.$refs.CargoOwnerRef.resetFields()
      }catch(e){}
      this.CargoOwnerBoxTitle = '新添货主信息'
      this.addCargoOwnerBox = true
    },
    // 返回
    toBack() {
      // 新添页面返回清数据
      this.$router.push('/UserManage/ClientInfo')
    },
    hideAddCargoOwnerBox(){ //隐藏货主弹框
      this.addCargoOwnerBox = false
      this.search()
    },
    //  获取省
    getProv() {
      this.$api.BasicConfiguration.getProv().then(res => {
          if(res.errorCode === '100200'){
              this.provinceOptions = res.data
          }else{
              this.$utils.commonUtils.tip(res.msg,'error')
          }
      }).catch(error => {

      });
    },
    // 根据省id获取市
    getCity(val,type) {
        this.$api.BasicConfiguration.getCity({parentId:val}).then(res => {
          if(res.errorCode === '100200'){
              this.cityOptions=[]
              this.regionOptions=[]
              this.cityOptions = res.data
              let regionName = document.getElementById(val).dataset.dataname
              if(type === 1){
                this.$set(this.fromData,'provincial',regionName)
                this.fromData.city = ''
                this.fromData.district = ''
              }
              else if (type === 2){
                this.$set(this.shipperInfoList,'provincial',regionName)
                this.shipperInfoList.district = ''
                this.shipperInfoList.city = ''
              }
              else if(type === 3 && res.data.length != 0){
                res.data.forEach(item=>{
                  if(item.name == this.fromData.city) this.getArea(item.id,3)
                })
              }
              else if(type === 4 && res.data.length != 0){
                res.data.forEach(item=>{
                  if(item.name == this.shipperInfoList.city) this.getArea(item.id,4)
                })
              }
          }else{
              this.$utils.commonUtils.tip(res.msg,'error')
          }
        }).catch(error => {

        })
    },
    // 根据市id获取区
    getArea(val,type) {
        this.$api.BasicConfiguration.getArea({parentId:val}).then(res => {
          if(res.errorCode == '100200'){
              this.regionOptions = res.data
              let regionName = document.getElementById(val).dataset.dataname
              if(type == 1){
                this.$set(this.fromData,'city',regionName)
                this.fromData.district = ''
              }
              else{
                // this.shipperInfoList.district = ''
                this.$set(this.shipperInfoList,'city',regionName)
              }
              if(type == 4){
                res.data.forEach(item=>{
                  if(item.name == this.shipperInfoList.district) this.getAreaName(item.id,4)
                })
              }
          }else{
              this.$utils.commonUtils.tip(res.msg,'error')
          }
        }).catch(error => {

        })
    },
    // 选中区
    getAreaName(val,type) {
        let regionName = document.getElementById(val).dataset.dataname
        if(type == 1){
          this.$set(this.fromData,'district',regionName)
        }else{
          this.$set(this.shipperInfoList,'district',regionName)
        }
    },
    cancellationRefundFn(val){
      let regionName = document.getElementById(val).dataset.dataname
      this.$set(this.fromData,'cancellationRefundCode',regionName)
    },
  },
}
</script>