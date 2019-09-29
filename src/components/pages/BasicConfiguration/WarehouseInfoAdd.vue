<template>
<div class="warehouse-information-add">
  <V-Title v-if='id' title="编辑仓库信息"></V-Title>
  <V-Title v-else title="新添仓库信息"></V-Title>
  <div class="p-20 form-cont">
    <el-form :inline="true" :rules="formRules" :model="detail" ref="detail" class="demo-form-inline" label-width='170px'>
        <el-form-item label="仓库编码" prop="warehouseCode">
            <el-input :disabled="id!==''" clearable v-model="detail.warehouseCode" placeholder="请填写仓库编码" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="仓库名称" prop="warehouseName">
            <el-input clearable v-model="detail.warehouseName" placeholder="请填写仓库名称" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="仓库类型" prop="warehouseType">
            <el-select v-model="detail.warehouseType" placeholder="请选择仓库类型" @change="getWhType">
                <el-option v-for="item in warehouseOptions"
                    :id="item.dataCode"
                    :data-dataName="item.dataName"
                    :key="item.dataCode"
                    :label="item.dataName"
                    :value="item.dataCode">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="运营类型" prop="serviceType">
            <el-select v-model="detail.serviceType" placeholder="请选择运营类型"  @change="getSeType">
                <el-option v-for="item in serviceOptions"
                    :key="item.dataCode"
                    :label="item.dataName"
                    :value="item.dataCode">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="所在国家" prop="country">
            <el-input clearable v-model="detail.country" placeholder="请填写所在国家"></el-input>
        </el-form-item>
        <el-form-item label="仓库负责人" prop="warehouseManager">
            <el-select v-model="detail.warehouseManager" placeholder="" filterable="true">
              <el-option v-for="(item,index) in userOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.name">
              </el-option>
            </el-select>
            <!-- <el-input clearable v-model="detail.warehouseManager" placeholder="请填写仓库负责人"></el-input> -->
        </el-form-item>
        <el-form-item label="电话/手机" prop="managerPhone">
            <el-input clearable v-model="detail.managerPhone" placeholder="请填写电话/手机" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="邮编" prop="postalCode">
            <el-input clearable v-model="detail.postalCode" placeholder="请填写邮政编码" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="所在地区" prop="provinceId">
            <el-select v-model="detail.provinceId" placeholder="请选择省" @change="getCity">
                <el-option v-for="item in provinceOptions"
                    :id="item.id"
                    :data-dataName="item.name"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-select v-model="detail.cityId" placeholder="请选择市" @change="getArea">
                <el-option v-for="item in cityOptions"
                    :id="item.id"
                    :data-dataName="item.name"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-select v-model="detail.regionId" placeholder="请选择区" @change="getAreaName">
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
            <el-input clearable type="text" v-model="detail.address" placeholder="请填写详细地址" maxlength="100"></el-input>
        </el-form-item>
    </el-form>
  </div>

  <V-BottomBtn :buttonList="buttonList" :noBack="noBack" @toBack="toBack" @subm="submit"></V-BottomBtn>
</div>
</template>

<script>
export default {
  name: 'BasicConfiguration_WarehouseInfoAdd',
  data () {
    return {
      userOptions: [], // 仓库负责人数据
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
      provinceOptions: [],
      cityOptions: [],
      regionOptions: [],
      id: '',
      addressId: [], // 级联选择
      options: [],
      categoryProps: {
        expandTrigger: 'hover',
        label: 'name',
        value: 'id'
      }, 
      warehouseOptions: [], // 仓库类型
      serviceOptions: [], // 运营类型
      addressIdArr: [],
      detail: {
          warehouseCode: '',
          warehouseName: '',
          warehouseType: '',
          serviceType: '',
          country: '',
          warehouseManager: '',
          managerPhone: '',
          postalCode: '',
          address: '',
          addressId: '',
          province: '',
          city: '',
          region: '',
          provinceId: '',
          cityId: '',
          regionId: '',
          addressId: '',
          orderFrom: 'WMS新添'
      },
      statusOptions: [
          {
              value: 0,
              label: '否'
          },
          {
              value: 1,
              label: '是'
          }
      ],
      formRules: {
          warehouseCode: [{ required: true, message: "请输入仓库编码", trigger: "blur" }],
          warehouseName: [{ required: true, message: "请输入仓库名称", trigger: "blur" }],
          warehouseType: [{ required: true, message: "请选择仓库类型", trigger: "change" }],
          serviceType: [{ required: true, message: "请选择运营类型", trigger: "change" }],
          managerPhone: [{ required: true, message: "请输入电话/手机", trigger: "blur" },
            {pattern:/^[0-9]*[1-9][0-9]*$/,message: "电话/手机号只能是数字",trigger:"blur"}],
          postalCode: [{ required: true, message: "请输入邮编", trigger: "blur" },
            {pattern:/^[A-Za-z0-9]+$/,message: "请输入正确的邮编",trigger:"blur"}],
          address: [{ required: true, message: "请输入详细地址", trigger: "blur" }],
          provinceId: [{ required: true, message: "请选择所在地区", trigger: "change" }],
      },
      warehouseCode: '' // 仓库code
    }
  },
  methods: {
    // 获取仓库负责人下拉数据
    getAccountName() {
        let param = {}
        if(this.warehouseCode) {
            param.warehouseCode = this.warehouseCode
        }
        this.$api.BasicConfiguration.getAccountName(param).then(res => {
            if (res.errorCode === '100200') {
                this.userOptions = res.data
            } else {
                this.$utils.commonUtils.tip(res.msg, 'error')
            }
        })
    },
    // 更改warehouseTypeName值
    getWhType(val) {
        let name = document.getElementById(val).dataset.dataname
        this.$set(this.detail,'warehouseTypeName',name)
    },
    // 更改serviceTypeName值
    getSeType(val) {
        let name = document.getElementById(val).dataset.dataname
        this.$set(this.detail,'serviceTypeName',name)
    },
    //  获取省
    getProv() {
      this.$api.BasicConfiguration.getProv().then(res => {
          if(res.errorCode === '100200'){
              console.log(res.data)
              this.provinceOptions = res.data
          }else{
              this.$message.error(res.msg)
          }
      }).catch(error => {

      });
    },
    // 根据省id获取市
    getCity(val) {
        if(this.id && this.detail.provinceId == this.addressIdArr[0]) {
            // 编辑页面首次获取不清数据
        } else {
            this.$set(this.detail,'cityId','')
            this.$set(this.detail,'regionId','')
            this.$set(this.detail,'city','')
            this.$set(this.detail,'region','')
        }
        this.$api.BasicConfiguration.getCity({parentId:val}).then(res => {
          if(res.errorCode === '100200'){
              console.log(res.data)
              this.cityOptions = res.data
              let proName = document.getElementById(this.detail.provinceId).dataset.dataname
              this.$set(this.detail,'province',proName)
              this.addressIdArr[0] = this.detail.provinceId
          }else{
              this.$message.error(res.msg)
          }
        }).catch(error => {

        })
    },
    // 根据市id获取区 
    getArea(val) {
        if(this.id && this.detail.cityId == this.addressIdArr[1]) {
            // 编辑页面首次获取不清数据
        } else {
            this.$set(this.detail,'regionId','')
            this.$set(this.detail,'region','')
        }
        this.$api.BasicConfiguration.getArea({parentId:val}).then(res => {
          if(res.errorCode === '100200'){
              console.log(res.data)
              this.regionOptions = res.data
              let cityName = document.getElementById(val).dataset.dataname
              this.$set(this.detail,'city',cityName)
              this.addressIdArr[1] = this.detail.cityId
          }else{
              this.$message.error(res.msg)
          }
        }).catch(error => {

        })
    },
    // 选中区 
    getAreaName(val) {
        let regionName = document.getElementById(val).dataset.dataname
        this.$set(this.detail,'region',regionName)
        this.addressIdArr[2] = this.detail.regionId
        // this.detail.addressId = this.addressIdArr.join(',')
    },
    // 获取运营类型数据
    getDictCode() {
      this.$api.BasicConfiguration.getDictCode({dictCode:"service_type"}).then(res => {
          if(res.errorCode === '100200'){
              console.log(res.data)
              this.serviceOptions = res.data
          }else{
              this.$message.error(res.msg)
          }
      }).catch(error => {

      })
    },
    // 获取仓库类型数据
    getWarehouseType() {
      this.$api.BasicConfiguration.getWarehouseType().then(res => {
          if(res.errorCode === '100200'){
              console.log(res.data)
              this.warehouseOptions = res.data
          }else{
              this.$message.error(res.msg)
          }
      }).catch(error => {

      })
    },
    // 查仓库详情
    search(id) {
      this.$api.BasicConfiguration.infoWarehouse({id:id}).then(res => {
          if(res.errorCode === '100200'){
              console.log(res.data,55555)
              this.detail =  res.data   
              this.addressIdArr = this.detail.addressId.split(',')
              // 三元判断符防止页面出现NAN符号
              this.$set(this.detail,'provinceId',this.addressIdArr[0] ? parseInt(this.addressIdArr[0]) : '')
              this.$set(this.detail,'cityId',this.addressIdArr[1] ? parseInt(this.addressIdArr[1]) : '')
              this.$set(this.detail,'regionId',this.addressIdArr[2] ? parseInt(this.addressIdArr[2]) : '')
              this.getCity(this.detail.provinceId)
              this.getArea(this.detail.cityId)
              this.warehouseCode = res.data.warehouseCode
              this.getAccountName()
          }else{
              this.$message.error(res.msg)
          }
      }).catch(error => {

      })
    },
    // 返回
    toBack() {
        if(this.id && this.$store.state.warehouse.formDetail) {
            this.$router.push({path:'/BasicConfiguration/WarehouseInfoDetail',query: {id: this.id}})
            this.$store.commit("getFormDetail", false)
        } else {
            this.$router.push('/BasicConfiguration/WarehouseInfo')
            // 新添页面返回清数据
            Object.assign(this.$data, this.$options.data())
            this.$nextTick( () => {
                this.$refs['detail'].clearValidate()
            })
            this.getProv()
            this.getWarehouseType()
            this.getDictCode()
        }
    },
    // 提交
    submit() {
        this.$refs.detail.validate(valid => {
            if(valid) {
                console.log()
                if((this.cityOptions.length && !this.detail.cityId) || (this.regionOptions.length && !this.detail.regionId) ) {
                    this.$message.error('请完善所在地区！')
                    return
                }
                // 如果该省下无相关市数据,则id置空
                if(!this.detail.cityId) {
                    this.addressIdArr[1] = ''
                }
                // 如果该市下无相关区数据,则id置空
                if(!this.detail.regionId) {
                    this.addressIdArr[2] = ''
                }
                this.detail.addressId = this.addressIdArr.join(',')
                if (this.id) {
                    let param = this.detail
                    param.id = this.id
                    console.log(this.detail)
                    this.$api.BasicConfiguration.updateWarehouse(param).then(res => {
                        if(res.errorCode === '100200'){
                            console.log(res.data)
                            Object.assign(this.$data, this.$options.data())
                            this.$nextTick( () => {
                                this.$refs['detail'].clearValidate()
                            })
                            this.getProv()
                            this.getWarehouseType()
                            this.getDictCode()
                            this.$message.success('修改成功！')
                            this.$router.push('/BasicConfiguration/WarehouseInfo')
                        }else{
                            this.$message.error(res.msg)
                        }
                    }).catch(error => {

                    })
                } else {
                    this.$api.BasicConfiguration.addWarehouse(this.detail).then(res => {
                        if(res.errorCode === '100200'){
                            console.log(res.data)
                            this.$message.success('新添成功！')
                            Object.assign(this.$data, this.$options.data())
                            this.$nextTick( () => {
                                this.$refs['detail'].clearValidate()
                            })
                            this.getProv()
                            this.getWarehouseType()
                            this.getDictCode()
                            this.$router.push('/BasicConfiguration/WarehouseInfo')
                        }else{
                            this.$message.error(res.msg)
                        }
                    }).catch(error => {

                    })
                }
            } else {
                this.$utils.commonUtils.tip('必填项未填写完整！','error')
            }
        })
    }
  },  
  activated() {
      if(this.$route.query.id) {
          this.id = this.$route.query.id
        //   this.formRules.warehouseManager = [{ required: true, message: "请输入仓库负责人", trigger: "blur" }]
          this.search(this.id)
          this.$set(this.formRules,'warehouseManager',[{ required: true, message: "请输入仓库负责人", trigger: "blur" }])
          this.$nextTick( () => {
             this.$refs['detail'].clearValidate()
          })
      } else {
          this.getAccountName()
      }
      // 已打开新添页面，再次点击新添进来清除数据
      if(this.$store.state.warehouse.isFreshAdd) {
          Object.assign(this.$data, this.$options.data())
          this.$nextTick( () => {
             this.$refs['detail'].clearValidate()
          })
          this.$store.commit("getFreshAdd", false)
      }
      this.getProv()
      this.getWarehouseType()
      this.getDictCode()
  }
}
</script>
