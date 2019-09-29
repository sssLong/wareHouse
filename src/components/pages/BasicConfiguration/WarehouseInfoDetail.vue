<template>
<div class="warehouse_detail">
  <V-Title title="详情页"></V-Title>

  <div class="p-20 section-cont yy-detail">
    <el-form :inline="true" :model="detail" class="demo-form-inline" label-width='150px'>
      <el-form-item label="仓库编码：">
        <span class="spanWith">{{detail.warehouseCode}}</span>
      </el-form-item>
      <el-form-item label="仓库名称：">
        <span class="spanWith">{{detail.warehouseName}}</span>
      </el-form-item>
      <el-form-item label="仓库类型：">
        <span class="spanWith">{{detail.warehouseTypeName}}</span>
      </el-form-item>
      <el-form-item label="运营类型：">
        <span class="spanWith">{{detail.serviceTypeName}}</span>
      </el-form-item>
      <el-form-item label="是否启用：">
        <span class="spanWith">{{detail.warehouseState === 1 ? '是' : '否'}}</span>  
      </el-form-item>
      <el-form-item label="所在国家：">
        <span class="spanWith">{{detail.country}}</span>
      </el-form-item>
      <el-form-item label="仓库负责人：">
        <span class="spanWith">{{detail.warehouseManager}}</span>
      </el-form-item>
      <el-form-item label="电话/手机：">
      <span class="spanWith">{{detail.managerPhone}}</span>
      </el-form-item>
      <el-form-item label="所在地区：">
        <span class="spanWith">{{detail.province}}{{detail.city?'/'+detail.city:''}}{{detail.region?'/'+detail.region:''}}</span>
      </el-form-item>
       <el-form-item label="邮编：">
        <span class="spanWith">{{detail.postalCode}}</span>
      </el-form-item>
       <el-form-item label="详细地址：">
        <span class="spanWith">{{detail.address}}</span>
      </el-form-item>
      <el-form-item label="单据来源：">
        <span class="spanWith">{{detail.orderFrom}}</span>
      </el-form-item>
    </el-form>
  </div>
  <V-BottomBtn :buttonList="buttonList" :noBack="noBack" @toBack="toBack" @update="toEdit"></V-BottomBtn>
</div>
</template>

<script>
export default {
  name: 'BasicConfiguration_WarehouseInfoDetail',
  data () {
    return {
      id: '', // 当前仓库id
      detail: {},
      buttonList:[
        {
            name:'返回',    //按钮名称
            emitType:'toBack'    //方法
        },
        {
            name:'修改',    //按钮名称
            type:true,    //是否为主按钮-可不传
            emitType:'update'    //方法
        },
      ],
      noBack: true,   // 为true时不需要返回按钮
    }
  },
  methods: {
    search(id) {
      this.$api.BasicConfiguration.infoWarehouse({id:id}).then(res => {
          if(res.errorCode === '100200'){
              console.log(res.data)
              this.detail =  res.data
          }else{
              this.$message.error(res.msg)
          }
      }).catch(error => {

      })
    },
    // 编辑
    toEdit() {
      this.$store.commit("getFormDetail", true)
      this.$router.push({path:'/BasicConfiguration/WarehouseInfoEdit',query: {id:this.id}})
    },
    toBack() {
      this.$router.push('/BasicConfiguration/WarehouseInfo')
    }
  },
  activated() {
    console.log(this.$route.query.id)
    this.id = this.$route.query.id
    this.search(this.id)
  }
}
</script>
