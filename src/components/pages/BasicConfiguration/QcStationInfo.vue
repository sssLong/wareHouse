<template>
    <div class="container qcContainer">
       <div class="header-container base-container">
           <V-Title title="工作台信息">
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
                <el-select  v-model="typeValue" placeholder="类型" @change="PageNum=1;search()">
                     <el-option v-for="(item,index) in inputOptions" 
                     :key="index" :label="item.dataName" :value="item.dataCode">
                     </el-option>
                </el-select>
                <el-select  v-model="statusValue" placeholder="使用状态" @change="PageNum=1;search()">
                     <el-option v-for="(item,index) in statusOptions" 
                     :key="index" :label="item.label" :value="item.value">
                     </el-option>
                </el-select>
                <span @click='reset' class="resetSpan">重置</span>
           </div>
       </div>
       <div class="table-container">
           <div class="table-operation">
               <div class="title">工作台信息列表</div>
               <div class="operation">
                   <div @click="handleAdd" v-show="btnPermission('新增工作台')">
                       <i class="iconfont iconchuangjianqiaban"></i>
                       <span>新添</span>
                   </div>
                   <div @click="outClick" v-show="btnPermission('导出工作台')">
                       <i class="iconfont icondaochu"></i>
                       <span>导出</span>
                   </div>
                   <div @click="printClick" v-show="btnPermission('打印工作台编码')">
                       <i class="iconfont icondayinji"></i>
                       <span>打印工作台编码</span>
                   </div>
               </div>
           </div>

           <!-- 引入表格公共组件 START -->
          <V-Table 
             :dataSource="dataSource"
             @sort-change="handleSort"
             @selection-change="handleSelectionChange"
             @use="handleUse"
             @ban="handleBan"
          >
            <!-- slot 自定义列的情况 -->
            <template slot-scope="scopes" slot="zip">
                <span>{{scopes.scope.row.qcState === 1 ? '启用' : '禁用'}}</span>
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
    </div>
</template>

<script>
    import axios from 'axios'
    import { qcStationCols } from './cols'
    export default {
        name: 'BasicConfiguration_QcStationInfo',
        data() {
            return {
                ids: [], // 多选 选中数据id数组
                handleIds: [], // 启用 禁用ids
                inputValue: '', // 搜索输入
                selectValue: '1', // 搜索下拉选择
                inputOptions: [], // 入库类型下拉框数据
                typeValue: '', // 入库类型选择
                statusValue: '', // 使用状态选择
                warehouseCode: '', // 下拉选中仓库
                options: [ // 搜索下拉框
                    {
                        label: '工作台名称',
                        value: '1'
                    }, 
                    {
                        label: '工作台编码',
                        value: '0'
                    }, 
                ],
                statusOptions: [ // 使用状态下拉框
                    {
                        label: '禁用',
                        value: '0'
                    }, 
                    {
                        label: '启用',
                        value: '1'
                    }, 
                ],
                dataSource: {
                   data: [], // 表格数据
                   cols: qcStationCols, // 表格的列数据
                   isSelection: true, // 表格有多选时设置
                   isOperation: true, // 表格有操作列时设置
                    operation: {
                    // 表格有操作列时设置
                    label: "操作", // 列名
                    width: "100", // 根据实际情况给宽度
                    data: [
                        {
                            label: "", 
                            invisibleKey: 'true', 
                            emitType: '', 
                            permission: "" // 调整样式用
                        },
                        {
                            label: '启用', // 操作名称
                            invisibleKey: 'useDisable', // 隐藏启用按钮
                            emitType: 'use', // 触发父组件
                            permission: '启用工作台', // 后期这个操作的权限，用来控制权限
                        },{
                            label: '禁用', // 操作名称
                            invisibleKey: 'banDisable', // 隐藏禁用按钮
                            emitType: 'ban', // 触发父组件
                            permission: '禁用工作台', // 后期这个操作的权限，用来控制权限
                        }
                    ]
                    }
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
            // 打印工作台编码
            printClick() {
                if(this.ids.length) {
                    this.multipleSelection.forEach(item => {
                        LODOP.SET_PRINT_STYLE("FontSize",14)
                        LODOP.ADD_PRINT_BARCODE('35px', '30px', '225px', '100px', "128B", item.qcCode)
                        LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0)
                        let html = `<div style='width:185px;margin-left:25px;font-size:18px;'>工作台编码：${item.qcCode}</div>`
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
            // 列表时间排序事件  升序-asc,降序-desc 
            handleSort(colData) {
                // 驼峰转下横线
                this.sortField = colData.prop.replace(/([A-Z])/g,"_$1").toLowerCase()
                this.sortType = colData.order==='ascending' ? 'asc' : 'desc'
                this.search()
            },
            // 导出
            outClick() {
                if(this.ids.length) {
                    let param = {
                        pageNum: this.PageNum,
                        pageSize: this.PageSize,
                        qcCode: this.selectValue === '0' ? this.inputValue : null,
                        qcName: this.selectValue === '1' ? this.inputValue : null,
                        putType: this.typeValue !== '' ? this.typeValue : null,
                        qcState: this.statusValue !== '' ? this.statusValue : null,
                        warehouseCode: this.warehouseCode !== '' ? this.warehouseCode : null,
                        ids: this.ids.toString()
                    }
                    let url = '/center/qc/export'
                    this.$utils.commonUtils.export('get',url,param,'工作台信息导出表', '.xls')
                } else {
                    this.$message.error('没有选中项！')
                }
            },
            // 启用
            handleUse() {
                this.handleIds = []
                let data = arguments[1]
                this.handleIds.push(data.id)
                this.handleUseBan('1')
            },
            // 禁用
            handleBan() {
                this.handleIds = []
                let data = arguments[1]  
                this.handleIds.push(data.id)
                this.handleUseBan('0')
            },
            // 启用 禁用
            handleUseBan(val) {
                this.$api.BasicConfiguration.useQc(val,this.handleIds).then(res => {
                    if (res.errorCode === "100200") {
                    this.$message.success("操作成功！");
                    this.search();
                    } else {
                    this.$message.error(res.msg);
                    }
                }).catch(error => {})
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
          //  查询列表数据
          search() {
            let param = {
              pageNum: this.PageNum,
              pageSize: this.PageSize,
              qcCode: this.selectValue === '0' ? this.inputValue : null,
              qcName: this.selectValue === '1' ? this.inputValue : null,
              putType: this.typeValue !== '' ? this.typeValue : null,
              qcState: this.statusValue !== '' ? this.statusValue : null,
              warehouseCode: this.warehouseCode !== '' ? this.warehouseCode : null,
              sortField: this.sortField,
              sortType: this.sortType
            }
            this.$api.BasicConfiguration.listQc(param).then(res => {
                if(res.errorCode === '100200'){
                    console.log(res.data)
                    this.dataSource.data = res.data.list.map(item => {
                        if (item.qcState === 0) {
                            item.banDisable = true // 隐藏禁用按钮
                        }
                        if (item.qcState === 1) {
                            item.useDisable = true // 隐藏启用按钮
                        }
                        return item
                    })
                    this.total = res.data.total
                }else{
                    this.$message.error(res.msg)
                }
              }).catch(error => {

              });
          },
          // 重置
          reset (){
              Object.assign(this.$data, this.$options.data())
              this.search()
              this.getInput()
              this.getWareHouse()
          },
          // 新添
           handleAdd() {
               this.$router.push('/BasicConfiguration/QcStationInfoAdd')
               this.$store.commit("getFreshAddQ", true)
           }
      },
      activated() {
          this.search()
          this.getInput()
          this.getWareHouse()
      },
    }
</script>
