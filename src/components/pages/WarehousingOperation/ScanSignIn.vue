<!-- 扫描签到页  页面开发：廖佳星 样式文件：ArrivalNotice.scss-->
<template>
  <div class="arrivalNotice">
    <!-- 顶部标题 -->
    <V-Title title="扫描签到">
        <div class="resetStyle" v-if="activeName=='1'" @click="dialogVisible=true">
            <i class="iconfont iconcanshupeizhi pr-5"></i>参数配置
        </div>
         <div class="search-content" v-else>
            <el-input clearable placeholder="请输入查询内容" v-model="form2.orderNum" class="input-with-select" @keyup.native.enter='PageNum=1;search()'>
            <el-select
                v-model="form2.orderType"
                placeholder="请选择"
                class="iconfont icon-xiala selectShelf selectScan"
                slot="prepend"
            >
                <el-option label="运单号" value="1"></el-option>
                <el-option label="来源单号" value="2"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click='PageNum=1;search()'></el-button>
            </el-input>
      </div>
    </V-Title>
    <!-- tab切换 -->
    <el-tabs v-model="activeName" @tab-click="handleClick" class='pl-20 pr-20'>
        <el-tab-pane label="签到" name="1"></el-tab-pane>
        <el-tab-pane label="查询" name="2"></el-tab-pane>
    </el-tabs>
      <!-- 签到筛选条件 -->
    <div class="flexBOX width130px pl-20" v-if="activeName=='1'">
        <!-- <el-select v-model="form1.wareHouse" placeholder="选择仓库" :disabled="!!configSet.wareHouse.dataName">
            <el-option
            v-for="item in warehouseList"
            :key="item.dataCode"
            :label="item.dataName"
            :value="item.dataCode"
            ></el-option>
        </el-select> -->
        <el-input v-model="form1.wareHouse" placeholder="选择仓库" disabled></el-input>
        <el-select v-model="form1.waybillType" placeholder="选择运输方式" class="ml-10" filterable clearable>
            <el-option
            v-for="item in yunList"
            :key="item.methodCode"
            :label="item.methodCnName"
            :value="item.methodCode"
            ></el-option>
        </el-select>
        <el-input clearable v-model="form1.packageNum" placeholder="包裹数量" class="ml-10" @keyup.native='form1.packageNum=form1.packageNum.replace(/\D/g,"")'></el-input>
        <el-input clearable v-model="form1.order" spellcheck ='false' ref='order' placeholder="请扫描运单号" class="ml-10" @keydown.native='scanEnter'></el-input>
        <el-checkbox v-model="checked" class="ml-20">
            <el-input v-model="form1.weight" placeholder="请输入重量" ref='weight' clearable :disabled="!checked" @keydown.native='getWeight' @keyup.native='form1.weight=form1.weight.replace(/[^\d\.]/g,"")'>
            <!-- <div slot="suffix" style="position: relative;right: 8px;top: 5px;">g</div> -->
            </el-input>
            <span >&nbsp;g</span> 
        </el-checkbox>
        <div class="resetStyle resetOther" @click='reset'>重置</div>
    </div>
    <!-- 查询筛选条件 -->
    <div class="flexBOX pl-20" v-else>
        <div class="seleTime flexBOX">
            <!-- 创建时间 -->
            <el-select v-model="timeType" placeholder="签到时间">
            <el-option label='签到时间' value='1'></el-option>
            </el-select>
            <!-- 日期时间选择器 -->
            <el-date-picker
            v-model="form2.signTime"
            class="ml-10"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm"
            :default-time="['00:00:00', '23:59:59']"
            @change='PageNum=1;search()'
            ></el-date-picker>
        </div>
        <el-input clearable v-model="form2.signInCreater" placeholder="签到人" class="ml-10 signer" @clear='PageNum=1;search()' @keyup.native.enter='PageNum=1;search()'></el-input>
        <!-- <el-select v-model="form2.wareHouse" placeholder="选择仓库" class="ml-10" @change='PageNum=1;search()'>
            <el-option
            v-for="item in warehouseList"
            :key="item.dataCode"
            :label="item.dataName"
            :value="item.dataCode"
            ></el-option>
        </el-select> -->
        <el-select v-model="form2.waybillType" placeholder="选择运输方式" class="ml-10" filterable clearable @change='PageNum=1;search()'>
            <el-option
            v-for="item in yunList"
            :key="item.methodCode"
            :label="item.methodCnName"
            :value="item.methodCode"
            ></el-option>
        </el-select>
        <el-select v-model="form2.sourceKind" placeholder="选择来源类型" class="ml-10" @change='PageNum=1;search()' clearable>
            <el-option v-for="item in MaBiaoObj.put_typeList" 
                :key="item.dataCode" :label="item.dataName" :value="item.dataCode">
            </el-option>
        </el-select>
        <div class="resetStyle" @click='reset'>重置</div>
    </div>
    <!-- 签到列表 -->
    <div class="flexBOX flexBOXS p-20 pb-20">
        <div style="font-weight:600">签到列表</div>
        <div v-show="activeName=='1'">
            <i class="iconfont iconshujutongji fcM pr-5"></i>总单数：{{totalOrder}}
            <span class="pl-20">包裹数：{{totalPackage}}</span>
        </div>
    </div>
    <div class="bodyBox table-container">
      <!-- 表格 -->
      <div class="tableBox" v-if='activeName=="1"'>
        <el-table :data="tableData1" style="width: 100%" class="shelfTable">
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="waybillTypeName" label="运输方式"></el-table-column>
          <el-table-column prop="waybillId" label="运单号"></el-table-column>
          <el-table-column prop="sourceId" label="来源单号"></el-table-column>
          <el-table-column prop="address" label="来源类型">
              <template slot-scope='scope'>
                  <span>{{getNameByMaId('put_type',scope.row.sourceType)}}</span>
              </template>
          </el-table-column>
          <el-table-column prop="parcelQuantity" label="包裹数"></el-table-column>
          <el-table-column prop="weight" label="重量（g）">
              <template slot-scope="scope">
                  <span>{{scope.row.weight == 0?'':scope.row.weight}}</span>
              </template>
          </el-table-column>
          <el-table-column prop="signInCreater" label="签到人"></el-table-column>
          <el-table-column prop="signInTime" label="接收时间"  width="180"></el-table-column>
        </el-table>
      </div>
      <div class="tableBox" v-else>
        <el-table :data="tableData2" style="width: 100%" class="shelfTable" v-loading='loading'>
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="waybillTypeName" label="运输方式"></el-table-column>
          <el-table-column prop="waybillId" label="运单号"></el-table-column>
          <el-table-column prop="sourceId" label="来源单号"></el-table-column>
          <el-table-column prop="sourceType" label="来源类型">
              <template slot-scope="scope">
                  <span>{{getNameByMaId('put_type',scope.row.sourceType)}}</span>
              </template>
          </el-table-column>
          <el-table-column prop="parcelQuantity" label="包裹数"></el-table-column>
          <el-table-column prop="weight" label="重量（g）">
              <template slot-scope="scope">
                  <span>{{scope.row.weight == 0?'':scope.row.weight}}</span>
              </template>
          </el-table-column>
          <el-table-column prop="signInCreater" label="签到人"></el-table-column>
          <el-table-column prop="signInTime" label="签到时间" width="180"></el-table-column>
        </el-table>
      </div>
    </div>
    <el-pagination
        v-show='activeName=="2"'
        class="p-20"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="PageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    <!-- 参数配置 -->

    <configSet :dialogVisible.sync="dialogVisible" @configSet='config' type='收货台'></configSet>
    <V-BottomBtn :noBack='true' :buttonList='buttonList' @goBack='$router.push("/WarehousingOperation/ArrivalNotice")'></V-BottomBtn> 
  </div>
</template>

<script>
export default {
    name: 'WarehousingOperation_ScanSignIn',
    data() {
        return {
            activeName: "1",
            dialogVisible:true,
            checked: false, //为false时输入重量输入框为禁用
            form1: {
                waybillType: '',  //运输方式
                packageNum: 1,   //包裹数量
                order: '',  //运单号
                weight: '',  //重量
                wareHouse: ''
            },
            form2: {
                orderType: "1", //头部搜索框类型
                signTime: ['',''],  //创建时间
                wareHouse: '', //仓库
                waybillType: '',  //运输方式
                orderNum: "", // 单号
                sourceKind: '',  //来源方式
                signInCreater: '' //签到人
            },
            timeType: '1',  //签到时间
            PageNum: 1,
            PageSize: 10,
            total: null,
            warehouseList: [],
            logisticalList:[],
            tableData1: [],
            tableData2: [],
            totalOrder: 0,
            totalPackage: 0,
            configSet: {
                wareHouse: {},
                delivery: {},
                friendList: []
            },
            height: 0,
            yunList: [],
            buttonList:[
                {
                    name:'返回',    //按钮名称
                    type:true,    //是否为主按钮-可不传
                    emitType:'goBack'    //方法
                },
            ],
            loading: true
        };
    },

    created() {
        this.getMoreMaList('put_type');
        this.getWareHouse();
    },
    activated (){
        if (this.configSet.wareHouse.dataName){
            this.dialogVisible = false;
        } else{
            this.dialogVisible = true;
        }
    },
    deactivated (){
        this.dialogVisible && (this.dialogVisible = false);
    },
    methods: {
        search (){
            if (this.activeName == '1'){  

            } else{
                this.getSignList();
            }
        },
        getShippingMethods (){
            let params = {
                page: 1,
                row: 1000,
                warehouse: this.configSet.wareHouse.dataCode
            }
            this.$api.Warehousing.getShippingMethods(params).then(res=>{
                if(res.errorCode == '100200'){
                    this.yunList = res.data.pageInfo.list;
                }
            })
        },
        getWeight (e){
            if(e.which == 13) {
                this.signEnter();
            }
        },
        //扫描后
        afterScan (){
            if (!this.checked){
                this.signEnter();
            } else{
                this.$refs.weight.select();
            }
        },
        //扫描签到
        signEnter (code){
            if (String(this.form1.packageNum).trim() == ''){
                this.$utils.commonUtils.tip('请输入包裹数量','error');
                return;
            }
            if (String(this.form1.packageNum).trim() == 0){
                this.$utils.commonUtils.tip('包裹数量不能为0','error');
                return;
            }
            if (this.form1.waybillType == ''){
                this.$utils.commonUtils.tip('运输方式不能为空','error');
                return;
            }
            if (this.checked && String(this.form1.weight) === ''){
                this.$utils.commonUtils.tip('重量不能为空','error');
                return;
            }
            if (this.checked && String(this.form1.weight) === '0'){
                this.$utils.commonUtils.tip('重量不能为0','error');
                return;
            }
            for (let i = 0; i < this.tableData1.length; i ++){
                if (this.tableData1[i].waybillId == this.form1.order){
                    this.$utils.commonUtils.tip('该运单号已经扫描过，请勿重复扫描','error');
                    return;
                }
            }
            let synergyName = [];
            this.configSet.friendList.forEach(item=>{
                synergyName.push({
                    synergyName: item.name,
                    synergyId: item.id
                })
            })
            let params = {
                waybillId: this.form1.order,
                warehouse: this.configSet.wareHouse.dataCode,
                waybillType: this.form1.waybillType,
                parcelQuantity: this.form1.packageNum,
                weight: Math.ceil(this.form1.weight),
                receiveGoodNumber: this.configSet.delivery.dataCode,
                synergyName: JSON.stringify(synergyName)     //协同人
            }
            this.$api.Warehousing.signEnter(params).then(res=>{
                if (res.errorCode === '100200'){
                    this.$refs.order.select();
                    this.tableData1.unshift(res.data);
                    this.totalOrder ++;
                    this.totalPackage += (+res.data.parcelQuantity);
                }
            })
        },
        config(form){
            if (this.configSet.wareHouse.dataCode != form.wareHouse.dataCode || this.configSet.delivery.dataCode != form.delivery.dataCode ){
                let MaBiaoObj = this.MaBiaoObj;
                let warehouseList = this.warehouseList;
                
                Object.assign(this.$data, this.$options.data());
                this.MaBiaoObj = MaBiaoObj;
                this.warehouseList = warehouseList;
                
                
            }
            this.form1.wareHouse = form.wareHouse.dataName;
            this.configSet = Object.assign(this.configSet,form);
            this.getShippingMethods();
        },
        //签到查询列表
        getSignList (){
            let params = {
                waybillId: this.form2.orderType=='1'?this.form2.orderNum:'',
                sourceId: this.form2.orderType=='2'?this.form2.orderNum:'',
                beginTime: this.form2.signTime[0]!=''?this.$utils.commonUtils.format(this.form2.signTime[0],'YYYY-MM-DD HH:mm'):'',
                endTime: this.form2.signTime[1]!=''?this.$utils.commonUtils.format(this.form2.signTime[1],'YYYY-MM-DD HH:mm'):'',
                warehouse: this.configSet.wareHouse.dataCode,
                waybillType: this.form2.waybillType,
                sourceType: this.form2.sourceKind,
                signInCreater: this.form2.signInCreater,
                page: this.PageNum,
                row: this.PageSize
            }
            this.$api.Warehousing.signList(params).then(res=>{
                this.loading = false;
                 if (res.errorCode === '100200'){
                    let data = res.data.pageInfo;
                    this.tableData2 = data.list;
                    this.total = data.total
                } 
            })
        },
        //切换tab
        handleClick (tab){
            if (this.activeName == '2'){
                this.getSignList();
                
            }
        },
        //重置
        reset (){
            if (this.activeName == '1'){
                this.form1 = this.$options.data().form1;
            } else{
                this.form2 = this.$options.data().form2;
                this.PageNum=1;this.search();
            }
        }
    },
    
};
</script>
