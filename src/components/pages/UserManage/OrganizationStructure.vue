<template>
  <div class="organizationBox">
    <V-Title></V-Title>
    <!-- <div class="iconfont iconbufenxuanze"></div> -->
    <div class="condition pl-20 pr-20 mt-20">
      <div class="table-container">
        <div class="table-operation mb-10">
          <div class="title">组织架构列表</div>
          <div class="operation">
            <div @click="addcompanyShow()"  v-show="btnPermission('新添组织架构')">
              <i class="iconfont iconchuangjianqiaban"></i>
              <span>新添</span>
            </div>
          </div>
        </div>
      </div>
      <el-table
        class="tree-table"
        :data="tableData"
        row-key="id"
        border
        :height="height"
        :tree-props="{children: 'children', hasChildren: 'hasChildrens'}"
      >
        <el-table-column prop="name" :formatter="formatter" label="部门名称" :show-overflow-tooltip='true'></el-table-column>
        <el-table-column prop="position" :formatter="formatter" label="职位"></el-table-column>
        <el-table-column prop="createTime" width="180" :formatter="formatter" label="创建时间"></el-table-column>
        <el-table-column prop="lastUpdateTime" width="180" :formatter="formatter" label="修改时间"></el-table-column>
        <el-table-column fixed="right" width="200" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addUnderlingFn(scope.row);"  v-show="btnPermission('组织架构添加下级')">添加下级</el-button>
            <el-button type="text" size="small" @click="changeunderlingFn(scope.row)"  v-show="btnPermission('组织架构编辑')">编辑</el-button>
            <el-button type="text" size="small" @click="deleteBox=true;clickId=scope.row.id"  v-show="btnPermission('组织架构删除')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <el-dialog
      :title="addCompanytitle"
      :visible.sync="addCompanyShow"
      width="480px"
      class="return-box"
    >
      <el-form :model="addCompanyData" :rules="companyNameFormRules" ref="companyNameFormRef" label-width="100px" class="return-form">
        <el-form-item label="公司名称" prop="companyName">
          <el-input
            clearable
            v-model="addCompanyData.companyName"
            placeholder="请输入公司名称"
            style="width:240px;"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCompanyShow=false">取 消</el-button>
        <el-button type="primary" @click="addCompanyFn()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="addunderlingtitle"
      :visible.sync="addunderlingShow"
      width="480px"
      class="return-box"
    >
      <el-form :model="addunderlingData" :rules="addunderlingRules" ref='addunderlingRes' label-width="100px" class="return-form">
        <el-form-item label="上级部门" prop="companyName">
          <el-input
            clearable
            :disabled="true"
            v-model="addunderlingData.companyName"
            placeholder="请输入公司名称"
            style="width:240px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门名称" prop="department">
          <el-input
            clearable
            v-model="addunderlingData.department"
            placeholder="请输入部门名称"
            style="width:240px;"
          ></el-input>
        </el-form-item>
        <span class="addPositionName" v-if="addunderlingData.position.length<5" @click="addpositionFn()">添加</span>
        <el-form-item label="职位名称" v-for="(item,key) in addunderlingData.position" :prop="'position['+ key +'].name'" :key="key" 
        :rules="[{required: true, message: '职位名称必填', trigger: 'blur'},{max:20,message: '只能输入20个字符', trigger: 'blur'}]"
        >
          <el-input clearable v-model="item.name" placeholder="请输入职位名称" style="width:240px;"></el-input>
          <span class="deletePositionName" v-if="addunderlingData.position.length!=1" @click="removePositionFn(key)">删除</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addunderlingShow=false">取 消</el-button>
        <el-button type="primary" @click="addUnderlingFromFn()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除" :visible.sync="deleteBox" width="480px" class="return-box">
      <div class="modifyPwdBox">
        <p class="iconyichangp">
            <img src="../../../assets/img/warning.png"/>
        </p>
        <p class="text mt-30 mb-40">确认删除吗？</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteBox=false">取 消</el-button>
          <el-button type="primary" @click="deleteFn()">确 定</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import utils from '../../../utils/element'
import '../../../assets/css/UserManame/OrganizationStructure.scss'
export default {
  name:'UserManage_OrganizationStructure',
  data() {
    return {
      deleteBox: false, //删除按钮弹窗
      height: 0, // 表格高度
      addunderlingData: {
        //添加下级弹窗data
        companyName: "",
        department: "",
        position: [{ name: "" }]
      },
      addunderlingRules:{
        department:[{required: true, message: '部门名称必填', trigger: 'blur' },
          {min:2,max:20, message: '不能超过20个字', trigger: 'blur' }
        ],
        name:[{required: true, message: '职位名称必填', trigger: 'blur' },{min:2,max:20, message: '不能超过20个字', trigger: 'blur' }]
      },
      companyNameFormRules:{
        companyName:[{required: true, message: '公司名称必填', trigger: 'blur' },{min:2,max:20,message: '不能超过20个字', trigger: 'blur'}]
      },
      addunderlingtitle: "添加下级", //添加下级弹窗title
      addunderlingShow: false, //添加下级弹窗
      addCompanyShow: false,  //添加公司弹窗判断
      addCompanytitle: "新添公司",  //添加&修改公司title
      addCompanyData: {
        companyName: "" //新增公司名称
      },
      tableData: [],
      clickId: "",
    };
  },
  created() {
    this.search();
  },
  deactivated(){
    this.addCompanyShow = false
    this.addunderlingShow = false
    this.deleteBox = false
  },
  mounted() {
    this.$nextTick( async() => {
      this.SettingTableHeightFn()
      let height = await this.$utils.element.setTableHeight()
      this.height = height-10
    })
	},
  methods: {
    addUnderlingFn(row) {   //添加下级弹窗
      this.addunderlingtitle = "添加下级";
      this.addunderlingShow = true;
      this.clickId = row.id;
      this.addunderlingData.companyName = row.name;
      this.addunderlingData.department = ''
      this.addunderlingData.position = [{ name: "" }]
    },
    addUnderlingFromFn() {   //添加下级确定按钮
      let addunderlingData = this.addunderlingData;
      let position = addunderlingData.position;
      let positionList = [];
      position.forEach(item => {
        positionList.push(item.name);
      });
      let params = {
        parentId: this.clickId,
        name: addunderlingData.department,
        position: positionList.join(",")
      };
      this.$refs['addunderlingRes'].validate((valid)=>{ 
        if(valid){
          if(this.addunderlingtitle == "编辑"){
            let params = {
              id: this.clickId,
              name: addunderlingData.department,
              position: positionList.join(",")
            };
            this.$api.UserManage.updateCompany(params).then(res => {
              if (res.errorCode == "100200") {
                this.search();
                this.addunderlingShow = false;
                this.$utils.commonUtils.tip(res.msg,'success')
              }else{
                this.$utils.commonUtils.tip(res.msg,'error')
              }
            });
          } 
          else {
            let params = {
              parentId: this.clickId,
              name: addunderlingData.department,
              position: positionList.join(",")
            };
            this.$api.UserManage.addUnderling(params).then(res => {
              if (res.errorCode == "100200") {
                this.search();
                this.addunderlingShow = false;
                this.$utils.commonUtils.tip(res.msg,'success')
              }else{
                this.$utils.commonUtils.tip(res.msg,'error')
              }
            });
          }
        }
      })
    },
    changeunderlingFn(rowData) {        //编辑部门
      let level = rowData.level;
      this.clickId = rowData.id;
      if (level == 0) {
        this.addCompanyShow = true;
        this.addCompanytitle = "编辑";
        this.$refs.companyNameFormRef && this.$refs.companyNameFormRef.resetFields();
        this.addCompanyData.companyName = rowData.name;
      } else {
        this.addunderlingShow = true;
        this.addunderlingtitle = "编辑";
        let position = rowData.position.split(",");
        let positionList = [];
        position.forEach(item => {
          let positionDict = {};
          positionDict.name = item;
          positionList.push(positionDict);
        });
        let parentId = rowData.parentId;
        let _this = this;
        let parentRowData = {}
        getParentName(this.tableData);
        function getParentName (data){
          let returnData=data.find(item=>{
            if(item.children != null){
              if(item.id != parentId){
                getParentName(item.children)
              }else{
                parentRowData = item;
              }
            }
          })
        }
        this.addunderlingData = {
          companyName: parentRowData.name,
          department: rowData.name,
          position: positionList
        };
      }
    },
    search() {  //获取组织架构表格数据
      this.$api.UserManage.getCompanyTree().then(res => {
        if (res.errorCode == "100200") {
          this.tableData = res.data;
        }else{
            this.$utils.commonUtils.tip(res.msg,'error')
        }
      });
    },
    addpositionFn() {   //添加职位输入框
      this.addunderlingData.position.push({ name: "" });
    },
    formatter() {
      return arguments[2] || "--";
    },
    addCompanyFn() {  //添加公司
      let companyName = this.addCompanyData.companyName;
      let params = {
        name: companyName,
        id: this.clickId,
        position: ""
      };
      this.$refs['companyNameFormRef'].validate(valid=>{
        if(valid){
          if (this.addCompanytitle == "编辑") {
            this.$api.UserManage.updateCompany(params).then(res=>{
              if(res.errorCode === '100200'){
                this.search();
                this.addCompanyShow = false;
                this.$utils.commonUtils.tip(res.msg,'success')
              }else{
                  this.$utils.commonUtils.tip(res.msg,'error')
              }
            })
          } 
          else {
            if(companyName == ''){
              this.$utils.commonUtils.tip(res.msg,'error')
              return false;
            }
            this.$api.UserManage.addCompany(companyName).then(res => {
              if (res.errorCode == "100200") {
                this.search();
                this.addCompanyShow = false;
                this.$utils.commonUtils.tip(res.msg,'success')
              }else{
                this.$utils.commonUtils.tip(res.msg,'error')
              }
            });
          }
        }
      })
    },
    removePositionFn(index) {     //移除职位
      this.addunderlingData.position.splice(index, 1);
    },
    deleteFn() {
      //删除部门
      let clickId = this.clickId;
      this.$api.UserManage.deleteCompany(clickId).then(res => {
        if (res.errorCode == "100200") {
          this.search();
          this.deleteBox = false;
          this.$utils.commonUtils.tip(res.msg,'success')
        }else{
          this.$utils.commonUtils.tip(res.msg,'error')
        }
      });
    },
    SettingTableHeightFn(){   //设置表格高度
      let mainDom = document.getElementsByClassName('main')[0]
      let tableDom = document.getElementsByClassName('table-container')[0]
      let elTableDom= document.getElementsByClassName('el-table')[0].parentElement
      let elTableDomMarginTop = utils._getMarginTop(tableDom,'marginTop')
      let arr =  utils._siblings(tableDom)
      let elArr =  utils._siblings(elTableDom)
      let outSum =  utils._getSum(arr)
      let innerSum =  utils._getSum(elArr)
      this.height = mainDom.offsetHeight-outSum-innerSum-elTableDomMarginTop
      document.getElementsByClassName('el-table__empty-block')[0].style.height = this.height + 'px' // 设置"暂无数据"的高度
    },
    addcompanyShow(){
      this.$refs.companyNameFormRef && this.$refs.companyNameFormRef.resetFields();
      this.addCompanyData.companyName=''
      this.addCompanyShow=true
      this.addCompanytitle='新添公司'
    }
  }
};
</script>
