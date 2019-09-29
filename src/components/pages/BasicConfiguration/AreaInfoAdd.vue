<template>
  <div class="area-info-add">
    <V-Title :title="ifStale?'编辑库区信息':'新添库区信息'" :key="ifStale?'addTitle':'edirTitle'"></V-Title>
    <div class="p-20">
      <el-form
        :inline="true"
        :rules="formRules"
        ref="detail"
        :model="detail"
        class="demo-form-inline"
        label-width="170px">
        <el-form-item label="仓库名称" prop="warehouseCode">
          <el-select v-model="detail.warehouseCode" placeholder="请选择仓库名称" :disabled="ifStale" @change="getAccountName">
            <el-option
              v-for="item in warehouseList"
              :key="item.dataCode"
              :label="item.dataName"
              :value="item.dataCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="库区编码" prop="areaCode">
          <el-input clearable v-model="detail.areaCode" placeholder="请填写库区编码" :disabled="ifStale" maxlength="5"></el-input>
        </el-form-item>
        <el-form-item label="库区名称" prop="areaName">
          <el-input clearable v-model="detail.areaName" placeholder="请填写库区名称" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="分区功能" prop="areaFunction">
          <el-select v-model="detail.areaFunction" placeholder="请选择分区功能">
            <el-option
              v-for="item in functionOptions"
              :key="item.dataCode"
              :label="item.dataName"
              :value="item.dataCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分区楼层" prop="areaFloor">
          <el-input clearable v-model="detail.areaFloor" placeholder="请填写楼层 例: 1" maxlength="2"></el-input>
        </el-form-item>
        <el-form-item label="管理员" prop="areaManager">
          <el-select multiple v-model="detail.areaManager" placeholder="" @change="getRole" filterable="true">
              <el-option v-for="(item,index) in userOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.name">
              </el-option>
          </el-select>
          <span class="espShow" v-if="espShow">……</span>
          <!-- <el-input clearable v-model="detail.areaManager" placeholder="请填写管理员姓名"></el-input> -->
        </el-form-item>
        <el-form-item label="绑定分类">
          <el-button :title="categorys?'已选分类：'+categorys:''" type="text" style="width:80px;margin-right:100px" @click="dakaifenlei">选择分类>></el-button>
        </el-form-item>
        <el-form-item label="描述" prop="areaRemark">
          <el-input
            clearable
            type="textarea"
            :rows="1"
            v-model="detail.areaRemark"
            placeholder="一段文字描述"
            maxlength="50"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>

    <V-BottomBtn :buttonList="buttonList" :noBack="noBack" @toBack="toBack" @save="AreaInfoSave"></V-BottomBtn>

    <!-- 选择分类 -->
    <el-dialog width="520px" title="选择分类" :visible.sync="dialogVisible">
      <div class="pl-10">
        <el-tree
         class="areaTree"
         :data="treeData" 
         ref="tree"
         show-checkbox 
         node-key="id" 
         :props="cateProps"></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="middle-button" @click="dialogVisible = false">取消</el-button>
        <el-button class="middle-button" type="primary" @click="handleCheckTree">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'BasicConfiguration_AreaInfoAdd',
  data() {
    return {
      userOptions: [], // 用户列表数据
      espShow: false, // 管理员多选时显示省略号
      roleArr: [], // 选中管理员数组
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
      ifStale:false,//false为新增，true为编辑
      functionOptions: [], // 分区功能下拉数据
      detail: {
        areaManager:[]
      }, // 详情   
      dialogVisible: false,
      formRules: {
        warehouseCode: [{ required: true, message: "请选择仓库名称", trigger: "change" }],
        areaCode: [{ required: true, message: "请填写库区编码", trigger: "change" }],
        areaName: [{ required: true, message: "请填写库区名称", trigger: "change" }],
        areaFunction: [{ required: true, message: "请选择分区功能", trigger: "change" }],
        areaFloor: [{ required: true, message: "请填写楼层 例：1", trigger: "blur" },
        {pattern:/^[0-9]{0,2}$/,message: "楼层只能是数字",trigger:"blur"}],
        areaManager: [{ required: true, message: "请填写管理员姓名", trigger: "change" }],
      },
      treeData: [], // 分类数据
      cateProps: {
        children: "children",
        label: "name",
      },
      terrCheck:[],// 选中树形数组
      categorys: '', // 鼠标悬浮显示已选分类
    };
  },
  methods: {
    // 根据所属仓库获取库区管理员下拉数据
    getAccountName(val) {
      this.$api.BasicConfiguration.getAccountName({warehouseCode:val}).then(res => {
        if (res.errorCode === '100200') {
          this.userOptions = res.data
        } else {
          this.$utils.commonUtils.tip(res.msg, 'error')
        }
      })
    },
    // 获取库区管理员
    getRole(val) {
      console.log(val);      
      if(val.length > 1) {
        this.espShow = true
      } else {
        this.espShow = false
      }
    },
    // 返回
    toBack() {
      this.$router.push('/BasicConfiguration/AreaInfo')
      // 返回清数据
      Object.assign(this.$data, this.$options.data())
      this.getAllInfo()
      this.$nextTick( () => {
          this.$refs['detail'].clearValidate()
      })
    },
    dakaifenlei(){
      const that=this;
      that.dialogVisible = true;
      // 编辑回显
      if(that.ifStale){
        let arrays = [];
        //回显不上证明详细数据的分类ID在分类接口不存在
        that.detail.categoryList.forEach(v => {
          arrays.push(Number(v.dataCode))
        });
        that.$nextTick(()=>{
          that.$refs.tree.setCheckedKeys(arrays);//根据树形的key值回显
        })
      }
    },
    //保存方法
    AreaInfoSave(){
      const that=this;
      that.$refs.detail.validate((valid) => {
        if (valid) {
          let params = that.detail;//表单数据
          params.categoryList = [];//分类数组
          that.terrCheck.forEach((v) => {
            params.categoryList.push({
              dataCode:v.id,
              dataName:v.name
            })
          })
          for (let i = 0; i < that.warehouseList.length; i++) {
            const element = that.warehouseList[i];
            if(element.dataCode===params.warehouseCode){
              that.$set(params,'warehouseName',element.dataName) // 仓库名称
              break
            }
          }
          if(that.ifStale){//ID存在时是编辑，调用编辑接口
            that.editFun(params)
          }else{//否则调用新增接口
            that.addFun(params)
          }
        } else {
          that.$message.error("必填项未填写完整！")
        }
      })
    },
    // 新增接口
    addFun(params){
      const that= this;
      that.$api.BasicConfiguration.addArea(params).then((res) => {
        if (res.errorCode === '100200') {
          that.$message.success('新增库区信息成功！')
          Object.assign(this.$data, this.$options.data())
          this.getAllInfo()
          this.$nextTick( () => {
             this.$refs['detail'].clearValidate()       
          })
          that.$router.push('/BasicConfiguration/AreaInfo')
        } else {
          that.$message.error(res.msg)
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    // 编辑接口
    editFun(params){
      const that= this;
      that.$api.BasicConfiguration.updateArea(params).then((res) => {
        if (res.errorCode === '100200') {
          that.$message.success('修改库区信息成功！')
          that.$router.push('/BasicConfiguration/AreaInfo')
        } else {
          that.$message.error(res.msg)
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    // 树形勾选数据
    handleCheckTree(){
      this.terrCheck=this.$refs.tree.getCheckedNodes();//获取到勾选中的数组对象
      // let arr = []
      // arr = this.$refs.tree.setCheckedKeys();//获取到勾选中的数组对象
      // console.log(arr)      
      console.log(this.terrCheck,"勾选数组");
      if(this.terrCheck.length) {
        let idArr = []
        this.terrCheck.forEach(item => {
          idArr.push(item.id)
        })
        // 获取分类级联名称进行展示
        this.$api.BasicConfiguration.goodsPositionInfo(idArr).then((res) => {
          console.log(res.data)
          let arr = []
          res.data.forEach(item => {
            arr.push(item.dataName)
          })
          this.categorys = arr.join(',')
        }).catch((err) => {
          console.log(err);
        });
      }
      this.dialogVisible = false;
    },
    // 获取品类节点
    async getCatelogy(resolve, params = '', level) {
      let res = await this.$api.WarehouseData.getCategoryNode()
      if (res.errorCode === '100200') {
        this.treeData = this.getTree(res.data, 0)
        console.log(this.treeData)
      } else {
        this.$utils.commonUtils.tip(res.msg, 'error')
      }
    },
    // 转成树
    getTree(data, pid) {
      let result = []
      let temp
      for (let i = 0; i < data.length; i++) {
        if (data[i].pid == pid) {
          temp = this.getTree(data, data[i].id)
          if (temp.length > 0) {
            data[i].children = temp
          }
          result.push(data[i])
        }
      }
      return result
    },
    // 获取分区功能数据
    getDictCode() {
      return new Promise(resolve =>{
        this.$api.BasicConfiguration.getDictCode({dictCode:"area_function"}).then(res => {
          if (res.errorCode === "100200") {
            console.log(res.data, "分区功能");
            this.functionOptions = res.data;
            resolve()
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });

      })
    },
    // 获取详情信息
    search(id) {
      const that = this;
      that.$api.BasicConfiguration.detailArea({id:id}).then(res => {
        if (res.errorCode === "100200") {
          console.log(res.data, "编辑详情");
          that.detail = res.data;
          that.detail.warehouseCode = String(res.data.warehouseCode) //仓库ID类型转换
          this.getAccountName(that.detail.warehouseCode) // 根据仓库id获取仓库管理员下拉数据
          if(that.detail.areaManager.length > 1) {
            that.espShow = true
          }
          let categoryArr = []
          let keysArr = []
          res.data.categoryList.forEach(item => {
            categoryArr.push(item.dataName)
            keysArr.push(Number(item.dataCode))
          })
          this.$nextTick(()=>{
            this.$refs.tree.setCheckedKeys(keysArr) //根据树形的key值回显
          })
          this.categorys = categoryArr.join(',')
        } else {
          this.$message.error(res.msg);
        }
      })
      .catch(error => {
        console.log(error);
      });
    },
    async getAllInfo(){
      await this.getDictCode(); // 获取分区功能数据
      await this.getCatelogy(); // 获取分类数据
      await this.getWareHouse(); // 获取仓库下拉框数据
      //编辑时取ID查询详情
      if (this.$route.query.id) {
        this.ifStale = true
        let id = this.$route.query.id
        this.search(id)
      } else {
        this.ifStale = false
      }
    }
  },
  activated() {
    // 已打开新添页面，再次点击新添进来清除数据
    if(this.$store.state.warehouse.isFreshAddA) {
      Object.assign(this.$data, this.$options.data())
      this.$nextTick( () => {
        this.$refs['detail'].clearValidate()
      })
      this.$store.commit("getFreshAddA", false)
    }
    this.getAllInfo()
  }
};
</script>
