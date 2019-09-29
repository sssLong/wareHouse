<template>
    <div class="container container-info">
       <div class="header-container base-container">
           <V-Title title="容器信息">
                <el-input clearable
                    @clear="PageNum=1;search()"
                    placeholder="请输入查询内容"
                    v-model.trim="inputValue"
                    @keyup.native.enter="PageNum=1;search()"
                    class="input-select">
                    <el-select v-model="selectValue" slot="prepend" placeholder="请选择" @change="PageNum=1;search()">
                        <el-option v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button slot="append" icon="el-icon-search" @click="PageNum=1;search()"></el-button>
                </el-input>
            </V-Title>
           <div class="condition">
                <el-select  v-model="warehouseCode" placeholder="仓库名称" @change="PageNum=1;search()">
                    <el-option v-for="item in warehouseList"
                        :key="item.dataCode"
                        :label="item.dataName"
                        :value="item.dataCode">
                    </el-option>
                </el-select>
                <el-select  v-model="workState" placeholder="工作状态" @change="PageNum=1;search()">
                    <el-option v-for="(item,index) in workOptions" 
                    :key="index" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-select  v-model="usageState" placeholder="使用状态" @change="PageNum=1;search()">
                    <el-option v-for="(item,index) in useOptions" 
                    :key="index" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <span @click='reset' class="resetSpan">重置</span>
           </div>
       </div>
       <div class="table-container">
           <div class="table-operation">
                <div class="title">容器信息列表</div>
                <div class="operation">
                    <div v-show="btnPermission('下载导入模版')">
                       <i class="iconfont iconxiazai"></i>
                       <a style="text-decoration: none;color:#2A8BFF" href="https://testimg.brandslink.com/wms/2019-07-13/4cac0b995a0d4a5.xlsx">下载导入模版</a>
                    </div>
                    <div v-show="btnPermission('导入容器')">
                        <el-upload
                            action=""
                            style="margin-right:-20px"
                            class="upload-demo"
                            ref="upload"
                            :http-request="uploadFile"
                            :file-list="fileList"
                            :show-file-list="false"
                            :auto-upload="true">
                            <i class="iconfont icondaoru"></i>
                            <span>导入</span>
                        </el-upload>
                    </div>   
                    <div @click="outClick" v-show="btnPermission('导出容器')">
                        <i class="iconfont icondaochu"></i>
                        <span>导出</span>
                    </div>
                    <div @click="useClick('1')" v-show="btnPermission('批量启用容器')">
                       <i class="iconfont iconqiyong"></i>
                       <span>批量启用</span>
                   </div>
                   <div @click="useClick('0')" v-show="btnPermission('批量禁用容器')">
                       <i class="iconfont iconjinyong"></i>
                       <span>批量禁用</span>
                   </div>
                   <div @click="printClick" v-show="btnPermission('打印容器编码')">
                       <i class="iconfont icondayinji"></i>
                       <span>打印容器编码</span>
                   </div>
               </div>
           </div>

           <!-- 引入表格公共组件 START -->
          <V-Table 
             :dataSource="dataSource"
              @sort-change="handleSort"
             @selection-change="handleSelectionChange"
          >
            <!-- slot 自定义列的情况 -->
            <template slot-scope="scopes" slot="zip">
                <span>{{scopes.scope.row.length}}/{{scopes.scope.row.width}}/{{scopes.scope.row.height}}</span>
            </template>
            <template slot-scope="scopes" slot="zip1">
                <span>{{scopes.scope.row.workState === 1 ? '闲置' : '占用'}}</span>
            </template>
            <template slot-scope="scopes" slot="zip2">
                <span>{{scopes.scope.row.usageState === 1 ? '启用' : '禁用'}}</span>
            </template>
          </V-Table>
           <!-- 引入表格公共组件 END -->
       </div>
       <div class="block">
            <el-pagination
            class="p-20"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="PageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="PageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
                ></el-pagination>
        </div>
       <!-- 导入导出弹窗 -->
      <el-dialog
        width="464px"
        title="提示"
        :visible.sync="confirmVisible">
          <div class="center-coo">
            <img class="warning" src="../../../assets/img/warning.png">
            <p>数据格式有误，请修改后重新导入</p>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button class="middle-button" @click="confirmVisible = false">取消</el-button>
            <el-button class="middle-button" type="primary">确定</el-button>
          </div>
      </el-dialog>
    </div>
</template>

<script>
    import axios from 'axios'
    import { containerCols } from './cols'
    export default {
        name: 'BasicConfiguration_ContainerInfo',
        data() {
            return {            
                fileList: [],
                ids: [], // 多选 选中数据id数组
                workOptions: [ // 工作状态下拉数据
                    {
                        label: '闲置',
                        value: '1'
                    },
                    {
                        label: '占用',
                        value: '0'
                    }
                ], 
                useOptions: [ // 使用状态下拉数据
                    {
                        label: '启用',
                        value: '1'
                    },
                    {
                        label: '禁用',
                        value: '0'
                    }
                ], 
                options: [ // 搜索框下拉数据
                    {
                        label: '容器名称',
                        value: '0'
                    },
                    {
                        label: '容器编码',
                        value: '2'
                    },
                    {
                        label: '容器用途',
                        value: '1'
                    }
                ], 
                confirmVisible: false, // 导入导出弹框
                inputValue: '', // 输入框的值
                selectValue: '2', // 下拉框选中的值
                warehouseCode: '', // 下拉选中仓库
                workState: '', // 下拉选中工作状态
                usageState: '', // 下拉选中使用状态
                dataSource: {
                   data: [], // 表格数据
                   cols: containerCols, // 表格的列数据
                   isSelection: true, // 表格有多选时设置
                   isOperation: false, // 表格有操作列时设置
                },           
                multipleSelection: [],
                PageNum: 1, //页码
                PageSize: 10, //行数
                total: null, //总页数
                sortField: null, // 排序字段
                sortType: null // 排序类型
            }
        },
        methods: {
            // 列表时间排序事件  升序-asc,降序-desc 
            handleSort(colData) {
                // 驼峰转下横线
                this.sortField = colData.prop.replace(/([A-Z])/g,"_$1").toLowerCase()
                this.sortType = colData.order==='ascending' ? 'asc' : 'desc'
                this.search()
            },
            // 导入容器信息
            uploadFile(params) {
                const _file = params.file
                const _name = params.file.name
                let config = {
                    //添加请求头
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                };
                var formData = new FormData()
                formData.append("file", _file, _name)
                this.$api.BasicConfiguration.importContainer(formData,config).then(res => {
                    if(res.errorCode === '100200'){
                        console.log(res.data)
                        if(res.data.dumpCode && res.data.dumpCode.length) {
                            // dumpCode和failCode同时存在时情况
                            if(res.data.failCode.length) {
                                let codes = res.data.dumpCode.join('、')
                                let codes2 = res.data.failCode.join('、')
                                this.$message.warning('容器编码为' + codes + '的记录未成功导入,编码已存在！'+ '容器编码为' + codes + '的记录未成功导入,编码不正确或信息不完整！')
                                this.reset() // 刷新列表
                                return
                            }
                            let codes = res.data.dumpCode.join('、')
                            this.$message.warning('容器编码为' + codes + '的记录未成功导入,编码已存在！')
                            this.reset()
                        } else if(res.data.failCode  && res.data.failCode.length) {
                            let codes = res.data.failCode.join('、')
                            this.$message.warning('容器编码为' + codes + '的记录未成功导入,编码不正确或信息不完整！')
                            this.reset()
                        } else {
                            this.$message.success(res.data.state)
                            this.reset()
                        }
                    }else{
                        this.$message.error(res.msg)
                    }
                }).catch(error => {

                });
            },
            // 导出
            outClick() {
                if(this.ids.length) {
                    let param = {
                        pageNum: this.PageNum,
                        pageSize: this.PageSize,
                        containerName: this.selectValue === '0' ? this.inputValue : null,
                        containerPurpose: this.selectValue === '1' ? this.inputValue : null,
                        containerCode: this.selectValue === '2' ? this.inputValue : null,
                        warehouseCode: this.warehouseCode ? this.warehouseCode : null,
                        workState: this.workState ? this.workState : null,
                        usageState: this.usageState ? this.usageState : null,
                        ids: this.ids ? this.ids.toString() : null
                    }
                    let url = '/center/container/export'
                    this.$utils.commonUtils.export('get',url,param,'容器信息导出表', '.xls')
                } else {
                    this.$message.error('没有选中项！')
                }
            },
            // 批量启用 禁用
            useClick(val) {
                if(this.ids.length) {
                    let params =this.ids
                    this.$api.BasicConfiguration.useContainer(val,params).then(res => {
                        if(res.errorCode === '100200'){
                            if(val === '0') {
                              this.$message.success(res.data)
                            } else {
                              this.$message.success('操作成功！')
                            }
                            this.search()
                        }else{
                            this.$message.error(res.msg)
                        }
                    }).catch(error => {

                    });
                } else {
                    this.$message.error('没有选中项！')
                }
            },
            // 打印容器编码
            printClick() {
                console.log('111111');
                
                if(this.ids.length) {
                    console.log('222222')
                    this.multipleSelection.forEach(item => {
                    LODOP.SET_PRINT_STYLE("FontSize",14)
                    LODOP.ADD_PRINT_BARCODE('35px', '30px', '225px', '100px', "128B", item.containerCode)
                    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0)
                    let html = `<div style='width:185px;margin-left:25px;font-size:18px;'>容器编码：${item.containerCode}</div>`
                    LODOP.ADD_PRINT_HTM('146px', '20px', '225px', '40px', html)
                    LODOP.SET_PRINT_PAGESIZE(0, 700, 500,"")
                    LODOP.NEWPAGE()
                    })
                    // LODOP.PREVIEW()
                    LODOP.PRINT()
                } else {
                    this.$message.error('没有选中项！')
                }
            },
            // 查列表数据
            search() {
              console.log(this.PageNum)
              
              let param = {
                pageNum: this.PageNum,
                pageSize: this.PageSize,
                containerName: this.selectValue === '0' ? this.inputValue : null,
                containerPurpose: this.selectValue === '1' ? this.inputValue : null,
                containerCode: this.selectValue === '2' ? this.inputValue : null,
                warehouseCode: this.warehouseCode ? this.warehouseCode : null,
                workState: this.workState ? this.workState : null,
                usageState: this.usageState ? this.usageState : null,
                sortField: this.sortField,
                sortType: this.sortType
              }
              this.$api.BasicConfiguration.listContainer(param).then(res => {
                  if(res.errorCode === '100200'){
                      console.log(res.data)
                      // let {data} = res.data.list
                      this.dataSource.data = res.data.list
                      this.total = res.data.total
                  }else{
                      this.$message.error(res.msg)
                  }
                }).catch(error => {

                });
            },
            // 重置
            reset (){
                Object.assign(this.$data, this.$options.data());
                this.PageNum = 1
                this.search()
                this.getWareHouse()
            },
            // 多选
            handleSelectionChange(val) {
                console.log(val)
                this.ids = []
                this.multipleSelection = val
                this.multipleSelection.forEach(item => {
                    this.ids.push(item.id)
                })
                console.log(val,'val')
            }
        },
        activated() {
            this.search()
            this.getWareHouse()
        },
    }
</script>
