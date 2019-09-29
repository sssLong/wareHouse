<!-- 到货通知  页面开发：廖佳星 样式文件：ArrivalNotice.scss -->
<template>
    <div class="arrivalNotice">
        <!-- 顶部标题+搜索 -->
        <div class="header-container base-container">
        <V-Title title="到货通知">
            <!-- <div class="title-bar-icon" @click="dialogVisible=true"><i class="iconfont iconcanshupeizhi"></i>&nbsp;参数配置</div> -->
            <div class="search-content">
                <el-input clearable placeholder="请输入单号" v-model="form.order" class="input-with-select" @keyup.native.enter='PageNum=1;search()' @clear='PageNum=1;search()'>
                    <el-select
                        v-model="form.orderType"
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
    
        <!-- 筛选条件 -->
        <div class="bodyBox pt-15">
            <div class="flexBOX">
                <div class="seleTime flexBOX">
                    <!-- 创建时间 -->
                    <el-select v-model="form.timeType" placeholder="创建时间"
                        @change='PageNum=1;search()'
                    >
                        <el-option
                        v-for="item in option2"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        ></el-option>
                    </el-select>
                    <!-- 日期时间选择器 -->
                    <el-date-picker
                        v-model="form.TimeValue"
                        class="ml-10"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        format="yyyy-MM-dd HH:mm"
                        :default-time="['00:00:00', '23:59:59']"
                        @change='PageNum=1;search()'
                    ></el-date-picker>
                    <el-input clearable placeholder="创建人" v-model="form.creater" class="ml-10 creater" @clear='PageNum=1;search()' @keyup.native.enter='PageNum=1;search()'></el-input>
                    <el-select v-model="form.wareHouse" placeholder="选择仓库" class="ml-10" @change='PageNum=1;search()' clearable>
                        <el-option
                            v-for="item in warehouseList"
                            :key="item.dataCode"
                            :label="item.dataName"
                            :value="item.dataCode"
                        ></el-option>
                    </el-select>
                    <el-select v-model="form.orderStatu" placeholder="选择单据状态" class="ml-10" @change='PageNum=1;search()' clearable>
                        <el-option v-for="item in MaBiaoObj.receive_arrival_notice_statusList" 
                            :key="item.dataCode" :label="item.dataName" :value="item.dataCode">
                        </el-option>
                    </el-select>
                    <el-select v-model="form.sourceType" placeholder="选择来源类型" class="ml-10" @change='PageNum=1;search()' clearable>
                        <el-option v-for="item in MaBiaoObj.put_typeList" 
                            :key="item.dataCode" :label="item.dataName" :value="item.dataCode">
                        </el-option>
                    </el-select>
                    <div class="resetStyle" @click="reset">重置</div>
                </div>
            </div>
        </div>
        </div>
        <div class="table-container">
        <!-- 批量操作 -->
        <div class="flexBOX flexBOXS Operation">
            <div>到货通知列表</div>
            <ul>
                <li @click="takedelivery()" v-show='btnPermission("收货完成")'>
                    <i class="iconfont iconshouhuowancheng"></i>收货完成
                </li>
                <li @click="ScanSignInTo" v-show='btnPermission("扫描签到")'>
                    <i class="iconfont iconsaomiao"></i>扫描签到
                </li>
                <li @click="FoundCardTo" v-show='btnPermission("创建卡板")'>
                    <i class="iconfont iconchuangjianqiaban"></i>创建卡板
                </li>
            </ul>
        </div>
        <!-- 表格 -->
        <div class="ml-20 mr-20 tableBox table-container">
            <el-table :data="tableData" style="width: 100%" class="shelfTable just-for-flag" 
                @selection-change="handleSelectionChange" 
                ref="multipleTable" :height="height"
                @sort-change='sortMethod'
                v-loading='loading'
            >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="index" label="序号" width="55"></el-table-column>
                <el-table-column prop="arrivalNoticeId" label="到货通知单" width='150'></el-table-column>
                <el-table-column prop="sourceType" label="来源类型">
                    <template slot-scope="scope">
                        <span>{{getNameByMaId('put_type',scope.row.sourceType)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="warehouse" label="仓库名称"></el-table-column>
                <el-table-column prop="status" label="单据状态">
                    <template slot-scope="scope">
                        <span>{{getNameByMaId('receive_arrival_notice_status',scope.row.status)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="sourceId" label="来源单号" width='150'></el-table-column>
                <el-table-column prop="qualityType" label="质检方式">
                    <template slot-scope="scope">
                        <span>{{scope.row.qualityType | qualityType}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="customerName" label="客户名称"></el-table-column>
                <el-table-column prop="plannedQuantity" label="计划数"></el-table-column>
                <el-table-column prop="deliveryQuantity" label="收货数"></el-table-column>
                <el-table-column prop="parcelQuantity" label="包裹数"></el-table-column>
                <el-table-column prop="creater" label="创建人"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" sortable='custom' width='160'></el-table-column>
                <el-table-column prop="plannedTime" label="预到仓时间" sortable='custom' width='160'></el-table-column>
                <el-table-column prop="arrivalTime" label="实到仓时间" sortable='custom' width='160'></el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="checkTo(scope.row)">查看</el-button>
                </template>
                </el-table-column>
            </el-table>
        </div>
        <el-pagination
            class="p-20"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="PageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="PageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
        ></el-pagination>
    <!-- 收货完成弹窗 -->
        <el-dialog title="提示" :visible.sync="confirmVisible">
            <p class="fz14">勾选单据如下,请确定是否收货完成？</p>
            <el-table :data="gridData" class="mt-10 pt-5 tableBox" ref="sureData">
                <el-table-column property="arrivalNoticeId" label="收货单号"></el-table-column>
                <el-table-column property="plannedQuantity" label="计划数"></el-table-column>
                <el-table-column property="deliveryQuantity" label="收货数"></el-table-column>
                <el-table-column property="differQuantity" label="差异数"></el-table-column>
                <el-table-column property="comment" label="备注">
                    <template slot-scope='scope'>
                        <el-input v-model='scope.row.comment' placeholder="备注"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="confirmVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmReceive">确 定</el-button>
            </div>
        </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WarehousingOperation_ArrivalNotice',
    data() {
        return {
            form: {
                orderType: "2", //单号类型
                order:"",//头部搜索值
                timeType: 1,  //时间类型
                TimeValue:['',''],//时间
                creater: '',
                wareHouse: '',
                orderStatu: '',
                sourceType: '',
                orderDateType: '',  //排序时间类型
                orderStatus: ''     //排序类型
            },
            multipleTable: '',
            option2:[
                {
                    value:1,
                    label:"创建时间",
                },
                {
                    value:2,
                    label:"预到仓时间"
                },
                {
                    value:3,
                    label:"实到仓时间"
                }
            ],
            PageNum: 1, //页码
            PageSize: 10, //行数
            total: null, //总页数
            // 到货质检列表表格数据
            tableData: [],
            confirmVisible: false, //确定收货弹窗状态
            // 确定收货表格数据
            gridData: [],
            // 最终确定收货表格数据
            sureData: [],
            height: 0,
            loading: true
        };
    },
    created (){
        this.$store.dispatch('addNoticeRoute',this.$route);
        this.getMoreMaList('receive_arrival_notice_status','put_type');
        this.getWareHouse();
    },
    deactivated (){
        this.confirmVisible && (this.confirmVisible = false);
    },
    methods: {
        search (){
            if (!this.form.TimeValue)this.form.TimeValue = ['',''];
            let params = {
                page: this.PageNum,
                row: this.PageSize,
                sourceId: this.form.orderType == 2?this.form.order:'',
                wayBillId: this.form.orderType == 1?this.form.order:'',
                beginTime: this.form.TimeValue[0]!=''?this.$utils.commonUtils.format(this.form.TimeValue[0],'YYYY-MM-DD HH:mm'):'',
                afterTime: this.form.TimeValue[1]!=''?this.$utils.commonUtils.format(this.form.TimeValue[1],'YYYY-MM-DD HH:mm'):'',
                creater: this.form.creater,
                dateType: this.form.timeType,
                warehouse: this.form.wareHouse,
                sourceType: this.form.sourceType,
                status: this.form.orderStatu,
                orderDateType: this.form.orderDateType,
                orderStatus: this.form.orderStatus
            }
            this.$api.Warehousing.getArrivalList(params).then(res=>{
                this.loading = false;
                if (res.errorCode === '100200'){
                    let {list,total} = res.data.pageInfo;
                    this.tableData = list;
                    this.total = total;
                } 
            })
        },
        // 确定收货
        confirmReceive(){
            let receiveArrivalNotice = [];
            this.gridData.forEach(item=>{
                receiveArrivalNotice.push({
                    sourceId: item.sourceId,
                    comment: item.comment
                })
            })
            this.$api.Warehousing.sureArrivalList(receiveArrivalNotice).then(res=>{
                if (res.errorCode === '100200'){
                    this.confirmVisible = false;
                    this.$utils.commonUtils.tip('收货成功','success')
                    this.search();
                } 
            })
        },
        //点击收货
        takedelivery (){
            if (!this.gridData.length){
                this.$utils.commonUtils.tip('你没有勾选任何单据','error')
                return
            }
            let statusData = this.gridData.filter(item => {
                return item.status == 4
            })
            if (statusData.length){
                this.$utils.commonUtils.tip( `单号为${statusData[0].arrivalNoticeId}的到货通知单已经是收货完成的状态`,'error');
                return;
            }

            this.confirmVisible = true;
        },
        // 查看-跳转详情页
        checkTo(row){
            let sourceId = row.sourceId;
            window.localStorage.ArrivaldetailFlag = '1';
            this.$router.push({path:'ArrivalNDetails',query:{sourceId}});
        },
        //扫描签到-跳转扫描签到页
        ScanSignInTo(){
            this.$router.push({path:'ScanSignIn'})
        },
        // 创建卡板-跳转创建卡板页
        FoundCardTo(){
            this.$router.push({path:'FoundCard'})
        },
        // 表格勾選
        handleSelectionChange(val){
            this.gridData=val
        },
        //排序
        sortMethod ({column,prop,order}){
            this.form.orderDateType = prop=='createTime'?1:prop=='plannedTime'?2:3;
            this.form.orderStatus = order=="ascending"?'asc':'desc';
            this.search();
        },
        //重置
        reset (){
            this.form = this.$options.data().form;
            this.PageNum=1;this.search();
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.$utils.element.setTableHeight().then(res=>{
                this.height = res;
                console.log(this.height,'height');
                
            })
        });
    }
};
</script>
