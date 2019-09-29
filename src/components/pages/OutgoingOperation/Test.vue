/*
 * @Author: 李步钻 
 * @Date: 2019-06-02 18:00:07 
 * @Last Modified by: 李步钻
 * @Last Modified time: 2019-06-24 18:43:47
 */
<template>
    <div class="container">
       <div class="header-container">
           <V-Title title="Test">
               <el-input ref="input" imeMode="inactive  " v-model="order" @keydown.native="handleClick('input1')"></el-input>
               <el-input ref="input2"  imeMode="active " v-model="inputContent" @keydown.native="handleClick('input2')"></el-input>
               <el-input ref="input3" v-model="order" @keydown.native="handleClick('input3')"></el-input>
                <!-- <div class="title-bar-icon" @click="dialogVisible=true"><i class="iconfont iconcanshupeizhi"></i>&nbsp;参数配置</div> -->
                <div class="search-content">
                    <el-input clearable placeholder="请输入查询内容" v-model="inputContent" class="input-with-select">
                        <el-select
                            v-model="order"
                            placeholder="请选择"
                            class="iconfont icon-xiala selectShelf"
                            slot="prepend"
                        >
                            <el-option label="运单号" value="1"></el-option>
                        </el-select>
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
                </div>
            </V-Title>
           <div class="condition">
                <el-date-picker
                        class="dataTime"
                        v-model="timeValue"
                        type="daterange"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="yyyy-MM-dd" >
                </el-date-picker> 
                <el-select  v-model="selectValue" placeholder="选择仓库" >
                     <el-option v-for="(item,index) in options" 
                     :key="index" :label="item.label" :value="item.value">
                     </el-option>
                </el-select>
                 <el-select  v-model="selectValue" placeholder="选择物流商" >
                     <el-option v-for="(item,index) in options" 
                     :key="index" :label="item.label" :value="item.value">
                     </el-option>
                </el-select>
                 <el-select  v-model="selectValue" placeholder="选择平台" >
                     <el-option v-for="(item,index) in options" 
                     :key="index" :label="item.label" :value="item.value">
                     </el-option>
                </el-select>
                 <el-select  v-model="selectValue" placeholder="选择退货类型" >
                     <el-option label="客户退货" value="1"></el-option>
                     <el-option label="超时退回" value="2"></el-option>
                     <el-option label="机场安检不过" value="3"></el-option>
                     <el-option label="其它" value="4"></el-option>
                </el-select>
                 <el-select  v-model="selectValue" placeholder="选择单据状态" >
                     <el-option label="待收货" value="1"></el-option>
                     <el-option label="收货完成" value="2"></el-option>
                </el-select>
                <span @click='reset'>重置</span>
           </div>
       </div>
       <div class="table-container">
           <div class="table-operation">
               <div class="title">销退收货单列表</div>
               <div class="operation">
                   <div @click="returnShow=true">
                       <i class="iconfont iconxiaotuijieshou"></i>
                       <span>销退接收</span>
                   </div>
                   <div>
                       <i class="iconfont icondaoru"></i>
                       <span>导入</span>
                   </div>
                    <div>
                       <i class="iconfont icondaochu"></i>
                       <span>导出</span>
                   </div>
                    <div @click="goToReturnCheck">
                       <i class="iconfont iconzhijian"></i>
                       <span>质检</span>
                   </div>
               </div>
           </div>

           <!-- 引入表格公共组件 START -->
          <V-Table 
             :dataSource = "dataSource"
             @selection-change = "handleSelectionChange"
             @review = "handleReview"
             @sort-change = "handleSort"
          >
            <!-- slot 自定义列的情况 -->
            <template slot-scope="scopes" slot="zip">
                 <el-input 
                        clearable
                        type="text"
                        placeholder="输入备注"
                        v-model="scopes.scope.row.info"
                        maxlength="20"
                        show-word-limit
                        >
                </el-input>
            </template>

          </V-Table>
           <!-- 引入表格公共组件 END -->
           
             <div class="block">
                <el-pagination
                class="pt-20"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="PageNum"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="PageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                  ></el-pagination>
            </div>
       </div>
         <!--  销退接收弹框  -->
        <el-dialog
            title="销退接收"
            :visible.sync="returnShow"
            width="480px"
            class='return-box'

            >
            <el-form :model="returnForm" :rules="rules" ref="returnForm" label-width="100px" class="return-form">
                <el-form-item label="仓库" prop="warehouse">
                    <el-select v-model="returnForm.warehouse" placeholder="请选择仓库">
                        <el-option label="中山仓" value="1"></el-option>
                        <el-option label="金华仓" value="2"></el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="退货类型" prop="returnType">
                    <el-select v-model="returnForm.returnType" placeholder="请选择退货类型">
                        <el-option label="客户退货" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="运单号" prop="waybillNumber">
                    <el-input clearable v-model="returnForm.waybillNumber" placeholder="请扫描单号" ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="returnShow=false">取 消</el-button>
                <el-button type="primary" @click="sure">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import axios from 'axios'
    import { cols } from '@/columns'
    export default {
        data() {
            return {
                order: '',  //运单号
                inputContent: '', // 输入框的值
                selectValue: '', // 下拉框选中的值
                timeValue: '', // 时间
                returnShow: false, // 销退弹窗
                returnForm: {
                    warehouse: '1',
                    returnType: '1',
                    waybillNumber: ''
                }, // 销退表单
                options: [
                    {
                        label: '运单号',
                        value: '1'
                    },  
                ],
                dataSource: {
                   data: [], // 表格数据
                   cols: cols, // 表格的列数据
                   isSelection: true, // 表格有多选时设置
                   isOperation: true, // 表格有操作列时设置
                   operation: { // 表格有操作列时设置
                       label: '操作', // 列名
                       width: '170', // 根据实际情况给宽度
                       data: [
                           {
                               label: '查看', // 操作名称
                               emitType: 'review', // 触发父组件
                               permission: 'api/getlist', // 后期这个操作的权限，用来控制权限
                           },
                            {
                               label: '编辑', // 操作名称
                               emitType: '****', // 触发父组件
                               permission: 'api/getlist', // 后期这个操作的权限，用来控制权限
                           },
                            {
                               label: '审核', // 操作名称
                               emitType: '****', // 触发父组件
                               permission: 'api/getlist', // 后期这个操作的权限，用来控制权限
                           },
                           {
                               label: '复制', // 操作名称
                               emitType: '****', // 触发父组件
                               permission: 'api/getlist', // 后期这个操作的权限，用来控制权限
                           }
                       ]
                   }
                },
                
                multipleSelection: [],
                PageNum: 1, //页码
                PageSize: 10, //行数
                total: null, //总页数
                rules: {
                    warehouse: [{ required: true, message: '请选择仓库', trigger: 'blur' }],
                    returnType: [{ required: true, message: '请选择退货类型', trigger: 'blur' }],
                    waybillNumber: [{ required: true, message: '请扫描单号', trigger: 'blur' }]
                },
                isFocus: true
            }
        },
        created() {
          this.getList()
        },
        methods: {
            handleClick (e){
                console.log(e,'e')
                let input
                switch (e) {
                case "input1":
                    input = `input2`
                    break
                case "input2":
                    input = `input3`
                    break
                }
                this.$refs[input].$el.getElementsByTagName('input')[0].focus();
            },
            search() {},
            // 获取表格数据
            getList() {
                  axios.get('https://www.easy-mock.com/mock/5cc1d338a292711d4b98d708/example/getList')
                    .then( res => {
                        const { data } = res.data
                        this.dataSource.data = data;
                    })
            },
            // 重置
            reset (){
                Object.assign(this.$data, this.$options.data());
                this.getList()

            },
            // 多选
           handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(val,'val')

            },
           // 去往销退质检页面
           goToReturnCheck() {
               this.$router.push('/ReturnCheck')
           },
           // 查看
           handleReview(index,row) {
               console.log(index,row,'查看')
               this.$router.push('/ReturnDetails')
           },
           // 分页器
            handleSizeChange(val) {//行數
                this.PageSize=val
                this.search()
            },
            handleCurrentChange(val) {//頁碼
                this.PageNum=val
                this.search()
            },
            handleSort(column,prop,order) {
                console.log(column,prop,order)
            },
            sure (){
                this.$refs['returnForm'].validate((valid) => {
                    if (valid) {
                        this.returnShow = false
                    } 
                });
            }
        },
    }
</script>
