<template>
  <div class="code-table-detail">
    <V-Title title="码表详情"></V-Title>
    <div class="information">
      <p class="title">
        <strong>码表信息</strong>
      </p>
      <div class="p-20 section-cont yy-detail">
        <div class="section-item">
          <div class="cont-item">
            <div class="label tr">类型编码：</div>
            <div class="value" v-text="dataList.dictCode"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">类型名称：</div>
            <div class="value" v-text="dataList.dictName"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">状态：</div>
            <div class="value">{{dataList.dictState===1?'启用':'停用'}}</div>
          </div>
          <div class="cont-item">
            <div class="label tr">备注：</div>
            <div class="value" v-text="dataList.dictRemark"></div>
          </div>
        </div>
        <div class="section-item">
          <div class="cont-item">
            <div class="label tr">创建人：</div>
            <div class="value" v-text="dataList.createBy"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">创建时间：</div>
            <div class="value" v-text="dataList.createTime"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">修改人：</div>
            <div class="value" v-text="dataList.updateBy"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">修改时间：</div>
            <div class="value" v-text="dataList.updateTime"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="shelfTableBlock">
      <div class="title">
        <strong>码表详细信息</strong>
      </div>
      <el-table :data="dataList.dataList" border style="width: 100%" class="shelfTable">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="dataCode" label="类型值编码"></el-table-column>
        <el-table-column prop="dataName" label="类型值名称"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{scope.row.dataState===1?'启用':'禁用'}}</template>
        </el-table-column>
        <el-table-column prop="dataRemark" label="备注"></el-table-column>
      </el-table>
      <V-BottomBtn :buttonList="buttonList" :noBack="noBack" @toBack="toBack" @update="handleChangeCode"></V-BottomBtn>
    </div>
  </div>
</template>
<script>
export default {
  name: 'BasicConfiguration_CodeTableDetail',
  data() {
    return {
      // 详情数据數據
      dataList: {},
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
    };
  },
  methods: {
    // 返回
    toBack() {
      this.$router.push('/BasicConfiguration/CodeTable')
    },
    // 修改
    handleChangeCode(index,row){  //跳转去修改码表
        this.$router.push({ path: "/BasicConfiguration/CodeTableChange", query:{code:this.dataList.dictCode} })
        this.$store.commit("getFormDetailC", true)
    },
    // 查询码表详情信息
    search() {
      const that = this
      let params = {
        dictCode: that.$route.query.code
      }
      that.$api.BasicConfiguration.getCodeInfo(params)
        .then(res => {
          const { data } = res
          that.dataList = data
          console.log(data)
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  activated() {
    this.search()
  }
}
</script>
