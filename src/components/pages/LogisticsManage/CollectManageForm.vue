/*
* @Author: 李涛
* @describe: 物流管理/揽收商管理 => 新增/修改所引用的表单
* @Date: 2019年7月22日10:16:36
*/
<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">

    <div class="section split">
      <el-form-item label="揽收商名称" prop="collectorName">
        <el-input v-model="ruleForm.collectorName" :disabled="isReadonly" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="揽收商编码" prop="collectorCode">
        <el-input v-model="ruleForm.collectorCode" :disabled="isReadonly" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="collector">
        <el-input v-model="ruleForm.collector" :disabled="isReadonly" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="mobile">
        <el-input v-model="ruleForm.mobile" :disabled="isReadonly" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="isValid">
        <el-select v-model="ruleForm.isValid" :disabled="isReadonly" placeholder="请选择" style="width: 100%">
          <el-option label="启用" :value="1"></el-option>
          <el-option label="禁用" :value="2"></el-option>
        </el-select>
      </el-form-item>
    </div>

    <div class="section">
      <el-form-item label="所属仓库" prop="warehouse">
        <el-select v-model="ruleForm.warehouse" :disabled="isReadonly" multiple placeholder="请选择" style="width: 100%" @change="warehouseChangeHandle">
          <el-option
            v-for="item in warehouseCollectList"
            :key="item.code"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="ruleForm.warehouse && ruleForm.warehouse.length > 0" label="提货方式">
      </el-form-item>
      <el-form-item v-for="item in warehouseCollectList.filter(val => ruleForm.warehouse.includes(val.code))" :key="item.code" :label="item.name">
        <!--暂未设置数据绑定对象-->
        <el-select v-model="item.type" :disabled="isReadonly" placeholder="请选择" style="width: 100%">
          <el-option v-for="v in offerType" :key="item.code + v.value" :label="v.label" :value="v.value"></el-option>
        </el-select>
      </el-form-item>
    </div>

    <div class="section split">
      <el-form-item label="国家" prop="receiveCountry">
        <el-select v-model="ruleForm.receiveCountry" :disabled="isReadonly" placeholder="请选择"
                   filterable @change="val => cascaderChangeHandle(val, 'stateList', ['receiveState', 'receiveCity'])" style="width: 100%">
          <el-option v-for="item in countryList" :key="item.id" :label="item.countryName" :value="item.id + ''"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="省/州" prop="receiveState">
        <el-select v-model="ruleForm.receiveState" :disabled="isReadonly || !ruleForm.receiveCountry" :placeholder="ruleForm.receiveCountry ? '请选择' : '请先选择国家'"
                   filterable @change="val => cascaderChangeHandle(val, 'cityList', ['receiveCity'])" style="width: 100%">
          <el-option v-for="item in stateList" :key="item.id" :label="item.countryName" :value="item.id + ''"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="城市">
        <el-select v-model="ruleForm.receiveCity" :disabled="isReadonly || !ruleForm.receiveState" :placeholder="ruleForm.receiveState ? '请选择' : '请先选择省/州'"
                   filterable style="width: 100%">
          <el-option v-for="item in cityList" :key="item.id" :label="item.countryName" :value="item.id + ''"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="详细地址" prop="receiveAddress">
        <el-input v-model="ruleForm.receiveAddress" :disabled="isReadonly" placeholder="请输入"></el-input>
      </el-form-item>
    </div>
    <V-BottomBtn v-if="formStatus === 'look'" :buttonList="buttonList" :noBack="true" @backHandle="$router.go(-1)" @editHandle="editHandle"></V-BottomBtn>
    <V-BottomBtn v-else :buttonList="buttonList2" :noBack="true" @cancelHandle="cancelHandle" @saveHandle="saveHandle"></V-BottomBtn>
  </el-form>
</template>

<script>
  export default {
    name: "LogisticsManage_CollectManageForm",
    data() {
      let validate = async (rule, value, callback) => {
        // 获取揽收商列表(可用于查询当前所要新增的揽收商是否已存在)
        let res = await this.$api.LogisticsManage.getSelectCollector({page: 1, row: 10, [rule.field]: value})
        /*
        * 1. 新增情况下, 如返回结果为不为空[]时, 证明重复(此时this.editCurrentRow.id 为undefined 肯定 !== res.data.pageInfo.list[0].id)
        * 2. 修改情况下, 结果肯定不会为空(因为可以查到自身), 但如果this.editCurrentRow.id !== res.data.pageInfo.list[0].id 说明结果并非是自己, 证明重复
        * */
        if (res.data.pageInfo.list.length > 0 && this.editCurrentRow.id !== res.data.pageInfo.list[0].id) {
          let isCargoCode = rule.field === 'collectorCode'
          callback(new Error(`揽收商${ isCargoCode ? '编码' : '名称'}重复, 请检查!`))
        } else {
          callback()
        }
      }
      return {
        offerType: [{
          value: 1,
          label: '中转仓揽收'
        }, {
          value: 2,
          label: '自提'
        }, {
          value: 3,
          label: '自送货'
        }, {
          value: 4,
          label: '快递邮寄'
        }],
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
        // 修改过参数的仓库列表
        warehouseCollectList: [],
        // 国家
        countryList: [],
        // 省市级联数据
        stateList: [],
        // 城市级联属性
        cityList: [],
        // 表单
        ruleForm: {
          // 揽收商名称
          collectorName: '',
          // 揽收商编码
          collectorCode: '',
          // 联系人
          collector: '',
          // 联系方式
          mobile: '',
          // 状态
          isValid: 1,
          // 所属仓库
          warehouse: [],
          // 国家
          receiveCountry: '',
          // 省/州
          receiveState: '',
          // 城市
          receiveCity: '',
          // 详细地址
          receiveAddress: '',
        },
        rules: {
          collectorName: [
            { required: true, message: '请输入揽收商名称', trigger: 'blur' },
            { max: 100, message: '字符长度在100个以内', trigger: 'blur' },
            { validator: validate, trigger: 'blur' }
          ],
          collectorCode: [
            { required: true, message: '请输入揽收商编码', trigger: 'blur' },
            { max: 50, message: '字符长度在50个以内', trigger: 'blur' },
            { validator: validate, trigger: 'blur' }
          ],
          isValid: [ { required: true, trigger: 'change'} ],
          warehouse: [ { required: true, message: '请选择仓库', trigger: 'change'} ],
          collector: [
            { required: true, message: '请输入联系人', trigger: 'blur'},
            { max: 100, message: '字符长度在100个以内', trigger: 'blur'}
          ],
          mobile: [
            { required: true, message: '请输入联系方式', trigger: 'blur'},
            { max: 100, message: '字符长度在100个以内', trigger: 'blur'}
          ],
          receiveCountry: [ { required: true, message: '请选择国家', trigger: 'change'} ],
          receiveState: [ { required: true, message: '请选择省/州', trigger: 'change'} ],
          // receiveCity: [ { required: true, message: '请选择城市', trigger: 'change'} ],
          receiveAddress: [
            { required: true, message: '请输详细地址', trigger: 'blur'},
            { max: 200, message: '字符长度在200个以内', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      console.log(2)
      // 获取仓库数据,并改造
      this.getWareHouseList().then(() => {
        this.warehouseList.forEach((item) => {
          this.warehouseCollectList.push({
            type: 1,
            code: item.dataCode,
            name: item.dataName
          })
        })
      })
    },
    activated() {
      console.log(3)
      // 获取及保存页面信息
      this.fromPageType = this.$route.query.fromPageType
      this.editCurrentRow = JSON.parse(this.$route.query.editCurrentRow || '{}')
      this.isReadonly = this.fromPageType === 'look'
      this.formStatus = this.fromPageType
      // 回显数据
      if(this.fromPageType !== 'add') {
        this.dataMapping(this.editCurrentRow)
      }
      // 获取国家
      this.cascaderChangeHandle('', 'countryList').then(() => {
        if (!this.editCurrentRow.receiveCountry) return
        this.cascaderChangeHandle(this.editCurrentRow.receiveCountry, 'stateList').then(() => {
          if (!this.editCurrentRow.receiveState) return
          this.cascaderChangeHandle(this.editCurrentRow.receiveState, 'cityList')
        })
      })
    },
    methods: {
      // 数据回显
      dataMapping(data) {
        for(let key in this.ruleForm) {
          this.ruleForm[key] = data[key]
        }
        this.ruleForm.warehouse = data.warehouseCollectType ? data.warehouseCollectType.map((item)=> item.code) : []
      },
      warehouseChangeHandle(val) {
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
          let warehouseCollectType = this.warehouseCollectList.filter(val => this.ruleForm.warehouse.includes(val.code))
          let ruleForm = {...this.ruleForm, warehouseCollectType}
          delete ruleForm.warehouse
          if(this.formStatus === 'edit') {
            this.addOrEditCollector({...ruleForm, id: this.editCurrentRow.id}, '修改').then(() => {
              this.$refs['ruleForm'].clearValidate()
            })
          } else {
            this.addOrEditCollector(ruleForm, '新增').then(() => {
              this.$refs['ruleForm'].resetFields()
            })
          }
        })
      },
      // 新增或修改请求
      async addOrEditCollector(data, str) {
        let res = await this.$api.LogisticsManage.addOrEditCollector(data)
        if (res.errorCode === '100200'){
          this.$utils.commonUtils.tip(`${str}揽收商成功`,'success')
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
    .section {
      border-bottom: 1px solid #EEEEEE;
      margin-bottom: 20px;
      &.split{
        display: flex;
        flex-wrap: wrap;
      }
      .el-form-item {
        width: 35%;
      }
    }
  }
</style>
