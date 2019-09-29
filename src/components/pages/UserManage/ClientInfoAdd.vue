<template>
<div class="warehouse-information-add">
  <V-Title v-if='id' title="编辑仓库信息"></V-Title>
  <V-Title v-else title="新添客户信息"></V-Title>
  <div class="p-20 form-cont">
    <el-form :inline="true" :rules="formRules" :model="fromData" ref="formRef" class="demo-form-inline" label-width='170px'>
      <el-form-item label="客户编码" prop="customerCode">
        <el-input  clearable max="20" placeholder="" v-model="fromData.customerCode"></el-input>
      </el-form-item>
      <el-form-item label="客户中文名" prop="chineseName">
        <el-input clearable max="50" placeholder="" v-model="fromData.chineseName"></el-input>
      </el-form-item>
      <el-form-item label="客户英文名" prop="englishName">
        <el-input clearable max="25" placeholder="" v-model="fromData.englishName"></el-input>
      </el-form-item>
      <el-form-item label="客户状态" prop="status">
        <el-select  placeholder="" v-model="fromData.status">
            <el-option  v-for="item in MaBiaoObj.putaway_strategy_statusList"
              :key="item.dataCode" :label="item.dataName" :value="item.dataCode"
            ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所在地区" prop="provincial">
        <el-select v-model="fromData.provincial" placeholder="请选择省" @change="getCity">
          <el-option v-for="item in provinceOptions"
            :id="item.id"
            :data-dataName="item.name"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="fromData.city" placeholder="请选择市" @change="getArea">
          <el-option v-for="item in cityOptions"
            :id="item.id"
            :data-dataName="item.name"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="fromData.district" placeholder="请选择区" @change="getAreaName">
          <el-option v-for="item in regionOptions"
            :id="item.id"
            :data-dataName="item.name"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="详细地址"  prop="address">
        <el-input  clearable  placeholder="" max="100" v-model="fromData.address"></el-input>
      </el-form-item>
      <el-form-item label="销退质检方式" prop="cancellationRefundval">
        <el-select  placeholder="" v-model="fromData.cancellationRefundval">
            <el-option  v-for="item in MaBiaoObj.receive_arrival_notice_quality_typeList"
              :key="item.dataCode" :label="item.dataName" :value="`${item.dataCode}|${item.dataName}`">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联系人"  prop="contacts">
        <el-input  clearable max="10" placeholder="" v-model="fromData.contacts"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="contactWay">
        <el-input  clearable max="11" placeholder="" v-model="fromData.contactWay"></el-input>
      </el-form-item>
    </el-form>
  </div>
  <V-BottomBtn :buttonList="buttonList" :noBack="noBack" @toBack="toBack" @subm="submit"></V-BottomBtn>
</div>
</template>

<script>
export default {
  name: 'UserManage_ClientInfoAdd',
  data () {
    return {
      id:'',
      formRules:{
        customerCode: [
          { required: true, message: "请输入客户编码", trigger: "blur" },
          {validator:(rule,val,fn)=>{
            if(!/^[0-9]\d*$|^0$/i.test(val)){
              fn(new Error('只能输入纯数字'))
            }else{
              fn()
            }
          }}
        ],
        englishName:[
          {validator:(rule,val,fn)=>{
            if(!/^[a-zA-Z\s]+$/.test(val)){
              fn(new Error('只能输入纯英文'))
            }else{
              fn()
            }
          }}
        ],
        chineseName: [{ required: true, message: "请输入客户中文名", trigger: "blur" }],
        provincial: [{ required: true, message: "请选择所在地", trigger: "blur" }],
        address: [{ required: true, message: "请输入详细地址", trigger: "blur" }],
        contacts: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        contactWay: [{ required: true, message: "请输入联系方式", trigger: "blur" },
          {validator:(rule,val,fn)=>{
            if(!/^[^[\u4e00-\u9fa5]][\W]|\d$/.test(val)){
              fn(new Error('只能输入纯数字'))
            }else{
              fn()
            }
          }}  
        ],
      },
      fromData:{
        "address": "",    //详细地址
        "cancellationRefundval": "1|全检",   //销退质检方式val
        "chineseName": "",   //中文名称
        "city": "",   //市
        "contactWay": "",  //联系方式
        "contacts": "",   //联系人
        "customerCode": "",   // 客户编码
        "district": "",    //区
        "englishName": "",    //英文名称
        "provincial": "",    //省
        "status": "1"   //客户状态
      },
      buttonList:[
        {
            name:'返回',    //按钮名称
            emitType:'toBack'    //方法
        },
        {
            name:'保存',    //按钮名称
            type:true,    //是否为主按钮-可不传
            emitType:'subm'    //方法
        },
      ],
      noBack: true,   // 为true时不需要返回按钮
      provinceOptions:[],
      cityOptions:[],
      regionOptions:[],
      addressIdArr:[]
    }
  },
  activated(){
    this.$refs.formRef.resetFields(); 
    this.getProv()
    this.getMoreMaList('receive_arrival_notice_quality_type','putaway_strategy_status')
    this.cityOptions = []
    this.regionOptions = []
  },
  
  methods: {
    submit(){ //提交客户信息
      let params = this.fromData
      params.cancellationRefundCode  = params.cancellationRefundval
      params.cancellationRefundName  = params.cancellationRefundval.split('|')[1]
      // if(params.city ==''){
      //   this.$utils.commonUtils.tip('城市还没有选择','error')
      //   return false
      // }
      // if(params.district ==''){
      //   this.$utils.commonUtils.tip('城市还没有选择','error')
      //   return false
      // }
      this.$refs['formRef'].validate((valid) => {
        if(valid){
          this.$api.UserManage.addCustomer(params).then(res=>{
            if(res.errorCode == '100200'){
              this.$utils.commonUtils.tip(res.msg,'success')
              this.$router.push('/UserManage/ClientInfo')
            }
          })
        }else{
          this.$utils.commonUtils.tip('请先通过校验','error')
        }
      })
    },
    // 返回
    toBack() {
      // 返回新添页面
      this.$router.push('/UserManage/ClientInfo')
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
    getCity(val) {
        if(this.id && this.fromData.cityId == this.addressIdArr[1]) {
            // 编辑页面首次获取不清数据
        } else {
            this.$set(this.fromData,'city','')
            this.$set(this.fromData,'district','')
        }
        this.$api.BasicConfiguration.getCity({parentId:val}).then(res => {
          if(res.errorCode === '100200'){
              this.cityOptions = res.data
              let proName = document.getElementById(val).dataset.dataname
              this.$set(this.fromData,'provincial',proName)
              this.addressIdArr[0] = this.fromData.provinceId
          }else{
              this.$utils.commonUtils.tip(res.msg,'error')
          }
        }).catch(error => {

        })
    },
    // 根据市id获取区
    getArea(val) {
        if(this.id && this.fromData.cityId == this.addressIdArr[1]) {
            // 编辑页面首次获取不清数据
        } else {
            this.$set(this.fromData,'district','')
        }
        this.$api.BasicConfiguration.getArea({parentId:val}).then(res => {
          if(res.errorCode === '100200'){
              this.regionOptions = res.data
              let cityName = document.getElementById(val).dataset.dataname
              this.$set(this.fromData,'city',cityName)
              this.addressIdArr[1] = this.fromData.cityId
          }else{
              this.$utils.commonUtils.tip(res.msg,'error')
          }
        }).catch(error => {

        })
    },
    // 选中区
    getAreaName(val) {
        let regionName = document.getElementById(val).dataset.dataname
        this.$set(this.fromData,'district',regionName)
        this.addressIdArr[2] = this.fromData.regionId
    },
  },
}
</script>
