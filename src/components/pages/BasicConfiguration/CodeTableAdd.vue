<template>
  <div class="code-table-add">
    <V-Title v-if='code' title="修改码表信息"></V-Title>
    <V-Title v-else title="新增码表"></V-Title>
    <div class="information">
      <p class="title">
        <strong>码表信息</strong>
      </p>
      <el-form
        :inline="true"
        :model="detail"
        ref="detail"
        :rules="rule"
        class="demo-form-inline"
        label-width="110px"
      >
        <el-form-item label="类型编码" prop="dictCode">
          <el-input
            clearable
            @clear="validrules('dictCode')"
            v-model="detail.dictCode"
            placeholder="请输入类型编码"
            maxlength="50"
            :disabled="code!==''"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型名称" prop="dictName">
          <el-input
            clearable
            @clear="validrules('dictName')"
            v-model="detail.dictName"
            placeholder="请输入类型名称"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="dictState">
          <el-select v-model="detail.dictState" placeholder="请选择状态">
            <el-option
              v-for="(item,index) in status"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="dictRemark">
          <el-input
            type="textarea"
            :rows="1"
            clearable
            v-model="detail.dictRemark"
            placeholder="请填写备注"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="shelfTableBlock">
      <div class="title">
        <span>
          <strong>码表详细信息</strong>
        </span>
        <span class="add" @click="addTableList()">
          <i class="el-icon-circle-plus"></i>新增
        </span>
      </div>

      <el-table :data="dataList" style="width: 100%" class="shelfTable">
        <el-table-column label="序号" width="50" type="index"></el-table-column>
        <el-table-column>
          <template slot="header">
            <span class="errColor">*</span>类型值编码
          </template>
          <template slot-scope="scope">
            <el-input
              :disabled="code!==''&&dataList[scope.$index].dataCode!==''"
              :clearable="!iserrStale"
              placeholder="请填写类型值编码"
              :ref="'dataCode'+scope.$index"
              @focus="iserrStale=false"
              :class="iserrStale?'iserr':''"
              v-model="dataList[scope.$index].dataCode"
              maxlength="50"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot="header">
            <span class="errColor">*</span>类型值名称
          </template>
          <template slot-scope="scope">
            <el-input
              :clearable="!iserrStale"
              placeholder="请填写类型值名称"
              :ref="'dataName'+scope.$index"
              :class="iserrStale?'iserr':''"
              v-model="dataList[scope.$index].dataName"
              maxlength="20"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot="header">
            <span class="errColor">*</span>状态
          </template>
          <template slot-scope="scope">
            <el-select v-model="dataList[scope.$index].dataState " placeholder="请选择状态">
              <el-option
                v-for="(item,key) in statusList"
                :key="key"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <el-input clearable v-model="dataList[scope.$index].dataRemark" placeholder="请输入备注"></el-input>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteTable(scope.$index)">删除</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <V-BottomBtn :buttonList="buttonList" :noBack="noBack" @toBack="toBack" @subm="preserve"></V-BottomBtn>
  </div>
</template>
<script>
export default {
  name: 'BasicConfiguration_CodeTableAdd',
  data() {
    return {
      code: '', // 列表页面带过来的code
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
      status: [{ value: 1, label: "启用" }, { value: 0, label: "禁用" }],
      statusList: [{ value: 1, label: "启用" }, { value: 0, label: "禁用" }],
      detail: {
        dictCode: "", // 类型编码
        dictName: "", // 类型名称
        dictState: 1, // 状态
        dictRemark: "" // 备注
      },
      // 验证规则
      rule: {
        dictCode: [{ required: true, message: "请输入类型编码", trigger: "blur" }],
        dictName: [{ required: true, message: "请输入类型名称", trigger: "blur" }],
        dictState: [{ required: true, message: "请选择状态", trigger: "change" }]
      },
      iserrStale:false,
      // 新增表格數據
      dataList: []
    };
  },
  methods: {
    // 新增表格数组push对象
    addTableList() {
      const that = this;
      that.dataList.push({
        dataCode:"",// 类型编码
        dataName:"",// 类型名称
        dataState:that.detail.dictState,// 状态
        dataRemark:""// 备注
      });
      console.log(that.dataList);
    },
    // 删除行
    deleteTable(key) {
      return
      this.dataList.splice(key, 1);
    },
    // 删除输入框值时触发验证规则
    validrules(keyName) {
      this.$refs.detail.validateField(keyName);
    },
    // 返回
    toBack() {
      this.$router.push('/BasicConfiguration/CodeTable')
      // 返回清数据
      Object.assign(this.$data, this.$options.data())
      this.$nextTick( () => {
          this.$refs['detail'].clearValidate()
      })
    },
    // 新增保存
    preserve(){
      const that=this;
      that.$refs.detail.validate(valid => {
        // 头部表单验证通过
        if (valid) {
          const that=this;
          // 表格验证
          for (let i = 0; i < that.dataList.length; i++) {
            const element = that.dataList[i];
            if(!element.dataCode||!element.dataName){
              if(!element.dataCode){
                that.$refs['dataCode'+i].focus()
              }else if(!element.dataName){
                that.$refs['dataName'+i].focus()
              }
              that.iserrStale=true
              return false
            }else{
              that.iserrStale=false
            }
          }
          let params = {
            dictCode: that.detail.dictCode,//类型编码 
            dictName: that.detail.dictName,//类型名称 
            dictState: that.detail.dictState,//状态 0-禁用 1-启用
            dictRemark: that.detail.dictRemark,//备注 
            dataList:that.dataList,//码表详情信息数组
            createBy:"manager",//创建人-暂时写死
          }
          console.log(JSON.stringify(params));
          if(this.code) {
              that.$api.BasicConfiguration.updateCode(params).then((res) => {
              console.log(res);
              if(res.errorCode==='100200'){
                that.$utils.commonUtils.tip('修改码表成功！','success')
                // 新增成功初始化数据-路由跳转回首页
                Object.assign(this.$data, this.$options.data());
                that.$router.push('/BasicConfiguration/CodeTable')
              }else{that.$utils.commonUtils.tip(res.msg,'error')}
            }).catch((err) => {console.log(err)});
          } else {
            that.$api.BasicConfiguration.addCode(params).then((res) => {
            console.log(res);
            if(res.errorCode==='100200'){
              that.$utils.commonUtils.tip('新增码表成功！','success')
              // 新增成功初始化数据-路由跳转回首页
              Object.assign(this.$data, this.$options.data());
              this.$nextTick( () => {
                  this.$refs['detail'].clearValidate()
              })
              that.$router.push('/BasicConfiguration/CodeTable')
            }else{that.$utils.commonUtils.tip(res.msg,'error')}
          }).catch((err) => {console.log(err)});
          }
        }else{that.$utils.commonUtils.tip('必填项未填写完整！','error')}
      });
    },
    // 查询码表详情信息
    search(code){
      const that=this;
      let params = {
        dictCode: code
      }
      that.$api.BasicConfiguration.getCodeInfo(params).then((res) => {
        const {data} = res;
        that.detail = {
          dictCode:data.dictCode,
          dictName:data.dictName,
          dictState:data.dictState,
          dictRemark:data.dictRemark,
        }
        that.dataList=data.dataList
        console.log(data);
      }).catch((err) => {console.log(err)});
    }
  },
  activated() {
      // 进来清校验
      this.$nextTick( () => {
          this.$refs['detail'].clearValidate()
      })
      // 已打开新添页面，再次点击新添进来清除数据
      if(this.$store.state.warehouse.isFreshAddC) {
          Object.assign(this.$data, this.$options.data())
          this.$nextTick( () => {
             this.$refs['detail'].clearValidate()
          })
          this.$store.commit("getFreshAddC", false)
      }
      if(this.$route.query.code) {
          this.code = this.$route.query.code
          this.search(this.code)
      }
  },
};
</script>
