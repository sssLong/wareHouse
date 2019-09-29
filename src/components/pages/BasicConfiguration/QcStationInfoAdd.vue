<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-24 17:45:20
 * @LastEditTime: 2019-08-10 16:41:34
 * @LastEditors: Please set LastEditors
 -->
<!-- 新添工作台信息  页面开发：高友谊 -->
<template>
<div class="qc-station-info-add">
  <V-Title title="新添工作台信息"></V-Title>

  <div class="p-20 form-cont">
    <el-form :inline="true" :rules="formRules" :model="formInline" ref="formInline" class="demo-form-inline" label-width='170px'>
        <el-form-item label="仓库名称" prop="warehouseCode">
            <el-select v-model="formInline.warehouseCode" placeholder="请选择仓库名称" @change="getArea">
                <el-option v-for="item in warehouseList"
                    :key="item.dataCode"
                    :label="item.dataName"
                    :value="item.dataCode">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="工作台编码" prop="qcCode">
            <el-input clearable v-model="formInline.qcCode" placeholder="请填写工作台编码" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="工作台名称" prop="qcName">
            <el-input clearable v-model="formInline.qcName" placeholder="请填写工作台名称" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="入库类型" prop="putType">
            <el-select v-model="formInline.putType" placeholder="请选择类型">
                <el-option v-for="item in inputOptions"
                    :key="item.dataCode"
                    :label="item.dataName"
                    :value="item.dataCode">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="所属库区" prop="areaId">
            <el-select v-model="formInline.areaId" placeholder="请选择所属库区">
                <el-option v-for="item in areaOptions"
                    :key="item.dataCode"
                    :label="item.dataName"
                    :value="item.dataCode">
                </el-option>
            </el-select>
        </el-form-item>
    </el-form>
  </div>

  <!-- <div class="p-20 handle-cont">
    <el-button @click="$router.push('QcStationInfo')">返回</el-button>
    <el-button type="primary" @click="submit">保存</el-button>
  </div> -->
  <V-BottomBtn :buttonList="buttonList" :noBack="noBack" @toBack="toBack" @save="submit"></V-BottomBtn>
</div>
</template>

<script>
export default {
  name: 'BasicConfiguration_QcStationInfoAdd',
  data () {
    return {
      buttonList:[
        {
            name:'返回',    //按钮名称
            emitType:'toBack'    //方法
        },
        {
          name:'保存',    //按钮名称
          type:true,    //是否为主按钮-可不传
          emitType:'save'    //方法
        },
      ],
      noBack: true,   // 为true时不需要返回按钮
      inputOptions: [], // 入库类型下拉框数据
      areaOptions: [], // 所属库区下拉框数据
      formInline: {
          warehouseCode: '',
          qcCode: '',
          qcName: '',
          putType: '',
          areaId: '',
          updateBy: 'xiaoha'
      },
      formRules: {
          warehouseCode: [{ required: true, message: "请选择仓库名称", trigger: "change" }],
          qcCode: [{ required: true, message: "请输入工作台编码", trigger: "change" }],
          qcName: [{ required: true, message: "请输入工作台名称", trigger: "change" }],
          putType: [{ required: true, message: "请选择类型", trigger: "change" }],
          areaId: [{ required: true, message: "请选择所属库区", trigger: "change" }],
      },
    }
  },
  methods: {
    // 返回
    toBack() {
        this.$router.push('/BasicConfiguration/QcStationInfo')
        // 返回清数据
        Object.assign(this.$data, this.$options.data())
        this.$nextTick( () => {
            this.$refs['formInline'].clearValidate()
        })
        this.getInput()
        this.getWareHouse()
    },
    // 获取入库类型数据
    getInput() {
      this.$api.BasicConfiguration.getDictCode({dictCode:"put_type"}).then(res => {
        if(res.errorCode === '100200'){
            console.log(res.data)
            this.inputOptions = res.data
        }else{
            this.$message.error(res.msg)
        }
      }).catch(error => {
        
      });
    },
    // 获取库区数据
    getArea(val) {
        this.$api.BasicConfiguration.kvArea({warehouseCode:val}).then(res => {
            if(res.errorCode === '100200'){
                console.log(res.data)
                this.areaOptions = res.data
            }else{
                this.$message.error(res.msg)
            }
        }).catch(error => {

        });
    },
    // 提交数据
    submit() {
      this.$refs.formInline.validate(valid => {
        if(valid) {
            let param = this.formInline      
            this.$api.BasicConfiguration.addQc(param).then(res => {
                if(res.errorCode === '100200'){
                    console.log(res.data)
                    Object.assign(this.$data, this.$options.data())
                    this.$nextTick( () => {
                        this.$refs['formInline'].clearValidate()
                    })
                    this.$router.push('/BasicConfiguration/QcStationInfo')
                }else{
                    this.$message.error(res.msg)
                }
            }).catch(error => {

            });
        } else {
            this.$utils.commonUtils.tip('必填项未填写完整！','error')
        }
      })
    }
  },
  activated() {
      // 已打开新添页面，再次点击新添进来清除数据
      if(this.$store.state.warehouse.isFreshAddQ) {
          Object.assign(this.$data, this.$options.data())
          this.$nextTick( () => {
             this.$refs['formInline'].clearValidate()
          })
          this.$store.commit("getFreshAddQ", false)
      }
      this.getInput()
      this.getWareHouse()
  }
}
</script>
