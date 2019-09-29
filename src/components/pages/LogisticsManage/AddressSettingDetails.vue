/*
* @Author: 李涛
* @describe: 物流管理/地址设置/地址详情
* @Date: 2019年7月22日10:16:36
*/
<template>
  <div class="container">
    <div class="header-container">
      <V-Title :title="fromPageType === 'add' ? '新添地址' : '地址设置详情'">
      </V-Title>
      <div class="condition">
      </div>
    </div>

    <div class="table-container">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm">
        <el-form-item label="地址设置名称" prop="addressName">
          <el-input v-model="ruleForm.addressName" :disabled="isReadonly" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="地址类型" prop="type">
          <el-select v-model="ruleForm.type" :disabled="isReadonly" placeholder="请输入" style="width: 100%">
            <el-option label="寄件人信息" :value="1"></el-option>
            <el-option label="揽件人信息" :value="2"></el-option>
            <el-option label="退货人信息" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name" :disabled="isReadonly" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="公司" prop="company">
          <el-input v-model="ruleForm.company" :disabled="isReadonly" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="国家" prop="country">
          <el-select v-model="ruleForm.country" :disabled="isReadonly" placeholder="请选择"
                     filterable @change="val => cascaderChangeHandle(val, 'stateList', ['state', 'city'])" style="width: 100%">
            <el-option v-for="item in countryList" :key="item.id" :label="item.countryName" :value="item.id + ''"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="省/州" prop="state">
          <el-select v-model="ruleForm.state" :disabled="isReadonly || !ruleForm.country" :placeholder="ruleForm.country ? '请选择' : '请先选择国家'"
                     filterable @change="val => cascaderChangeHandle(val, 'cityList', ['city'])" style="width: 100%">
            <el-option v-for="item in stateList" :key="item.id" :label="item.countryName" :value="item.id + ''"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市">
          <el-select v-model="ruleForm.city" :disabled="isReadonly || !ruleForm.state" :placeholder="ruleForm.state ? '请选择' : '请先选择省/州'"
                     filterable style="width: 100%">
            <el-option v-for="item in cityList" :key="item.id" :label="item.countryName" :value="item.id + ''"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地区" prop="district">
          <el-input v-model="ruleForm.district" :disabled="isReadonly" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="street">
          <el-input v-model="ruleForm.street" :disabled="isReadonly" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="邮编" prop="postcode">
          <el-input v-model="ruleForm.postcode" :disabled="isReadonly" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="mobile">
          <el-input v-model="ruleForm.mobile" :disabled="isReadonly" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" :disabled="isReadonly" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <V-BottomBtn v-if="formStatus === 'look'" :buttonList="buttonList" :noBack="true" @backHandle="$router.go(-1)" @editHandle="editHandle"></V-BottomBtn>
    <V-BottomBtn v-else :buttonList="buttonList2" :noBack="true" @cancelHandle="cancelHandle" @saveHandle="saveHandle"></V-BottomBtn>
  </div>
</template>

<script>
  export default {
    name: "LogisticsManage_AddressSettingDetails",
    data() {
      let validate = async (rule, value, callback) => {
        // 获取平台信息列表(可用于查询当前所要新增的平台信息是否已存在)
        let res = await this.$api.LogisticsManage.getAddressSettingList({page: 1, row: 10, [rule.field]: value})
        /*
        * 1. 新增情况下, 如返回结果为不为空[]时, 证明重复(此时this.editCurrentRow.id 为undefined 肯定 !== res.data.pageInfo.list[0].id)
        * 2. 修改情况下, 结果肯定不会为空(因为可以查到自身), 但如果this.editCurrentRow.id !== res.data.pageInfo.list[0].id 说明结果并非是自己, 证明重复
        * */
        if (res.data.pageInfo.list.length > 0 && this.editCurrentRow.id !== res.data.pageInfo.list[0].id) {
          callback(new Error(`地址设置名称重复, 请检查!`))
        } else {
          callback()
        }
      }
      return {
        // 来源页面类型 look/edit/add
        fromPageType: 'look',
        // 表单只读状态
        isReadonly: true,
        // 表单当前状态look/edit/add(因可以在查看时进行编辑操作, 所以和fromPageType不一样)
        formStatus: 'look',
        // 表格操作跳转时带过来的当前行数据
        editCurrentRow: {},
        buttonList: [{
          name: '返回',
          type: false,
          emitType: 'backHandle'
        }, {
          name: '修改',
          type: true,
          emitType: 'editHandle'
        }],
        buttonList2: [{
          name: '取消',
          type: false,
          emitType: 'cancelHandle'
        }, {
          name: '保存',
          type: true,
          emitType: 'saveHandle',
          isDisplay: this.btnPermission('修改或新增提交')
        }],
        // 国家
        countryList: [],
        // 省市级联数据
        stateList: [],
        // 城市级联属性
        cityList: [],
        // 表单
        ruleForm: {
          // 地址设置名称
          addressName: '',
          // 地址类型
          type: 1,
          // 姓名
          name: '',
          // 公司
          company: '',
          // 国家
          country: '',
          // 省/州
          state: '',
          // 城市
          city: '',
          // 地区
          district: '',
          // 街道
          street: '',
          // 邮编
          postcode: '',
          // 联系方式
          mobile: '',
          // 邮箱
          email: '',
        },
        rules: {
          addressName: [
            { required: true, message: '请输入地址设置名称', trigger: 'blur' },
            { max: 100, message: '字符长度在100个以内', trigger: 'blur' },
            { validator: validate, trigger: 'blur' }
          ],
          type: [ { required: true, message: '请输入地址类型', trigger: 'change'} ],
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur'},
            { max: 50, message: '字符长度在50个以内', trigger: 'blur'}
          ],
          company: [
            { required: true, message: '请输入公司', trigger: 'blur'},
            { max: 50, message: '字符长度在50个以内', trigger: 'blur'}
          ],
          country: [ { required: true,message: '请选择国家', trigger: 'change'} ],
          state: [ { required: true, message: '请选择省/州', trigger: 'change'} ],
          // city: [ { required: true, message: '请选择城市', trigger: 'change'} ],
          district: [
            { required: true, message: '请输入地区', trigger: 'blur'},
            { max: 50, message: '字符长度在50个以内', trigger: 'blur'}
          ],
          street: [
            { required: true, message: '请输入街道', trigger: 'blur'},
            { max: 50, message: '字符长度在100个以内', trigger: 'blur'}
          ],
          postcode: [
            { required: true, message: '请输入邮编', trigger: 'blur'},
            { max: 100, message: '字符长度在100个以内', trigger: 'blur'}
          ],
          mobile: [
            { required: true, message: '请输入联系方式', trigger: 'blur'},
            { max: 100, message: '字符长度在100个以内', trigger: 'blur'}
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur'},
            { max: 100, message: '字符长度在100个以内', trigger: 'blur'}
          ]
        }
      }
    },
    created() {

    },
    activated() {
      // 获取及保存页面信息
      this.fromPageType = this.$route.query.fromPageType
      this.editCurrentRow = JSON.parse(this.$route.query.editCurrentRow || '{}')
      this.isReadonly = this.fromPageType === 'look'
      this.formStatus = this.fromPageType
      // 回显数据
      if(this.fromPageType !== 'add') {
        this.dataMapping(this.editCurrentRow)
        this.$refs['ruleForm'].clearValidate()
      } else {
        this.$refs['ruleForm'].resetFields()
      }
      // 获取国家
      this.cascaderChangeHandle('', 'countryList').then(() => {
        if (!this.editCurrentRow.country) return
        this.cascaderChangeHandle(this.editCurrentRow.country, 'stateList').then(() => {
          if (!this.editCurrentRow.state) return
          this.cascaderChangeHandle(this.editCurrentRow.state, 'cityList')
        })
      })
    },
    methods: {
      // 数据回显
      dataMapping(data) {
        for(let key in this.ruleForm) {
          this.ruleForm[key] = data[key]
        }
      },
      // 取消操作
      cancelHandle() {
        if(this.fromPageType === 'look'){
          this.isReadonly = true
          this.formStatus = 'look'
          this.$refs['ruleForm'].clearValidate()
        } else {
          this.$router.back()
        }
      },
      // 修改操作
      editHandle() {
        this.isReadonly = false
        this.formStatus = 'edit'
      },
      // 保存操作
      saveHandle() {
        this.$refs['ruleForm'].validate((valid) => {
          if (!valid) return
          if(this.formStatus === 'edit') {
            this.addOrEditAddressSetting({...this.ruleForm, id: this.editCurrentRow.id}, '修改').then(() => {
              this.$refs['ruleForm'].clearValidate()
            })
          } else {
            this.addOrEditAddressSetting({...this.ruleForm}, '新增').then(() => {
              this.$refs['ruleForm'].resetFields()
            })
          }
        })
      },
      // 新增或修改请求
      async addOrEditAddressSetting(data, str) {
        let res = await this.$api.LogisticsManage.addOrEditAddressSetting(data)
        if (res.errorCode === '100200'){
          this.$utils.commonUtils.tip(`${str}地址成功`,'success')
          this.$router.back()
        }
      },
      /*
      * 级联操作
      * val: 所选值
      * propList: 下一级选择列表
      * clearProps: 需要清空数据的下一级
      * */
      async cascaderChangeHandle(val, propList, clearProps = []) {
        let { data = [] } = await this.$api.LogisticsManage.getCountryCascader(val)
        this[propList] = data
        clearProps.forEach((prop) => this.ruleForm[prop] = '')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .ruleForm {
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      width: 35%;
    }
  }
</style>
