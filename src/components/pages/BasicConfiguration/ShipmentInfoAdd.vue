<template>
<div class="addShipment">
    <V-Title title="新添货列信息"></V-Title>

    <div class="p-20 form-cont">
        <el-form :inline="true" :rules="formRules" :model="formInline" ref="formInline" class="demo-form-inline" label-width='170px'>
            <el-form-item label="仓库名称" prop="warehouseCode">
                <el-select v-model="formInline.warehouseCode" placeholder="选择仓库名称" @change="getArea">
                    <el-option v-for="item in warehouseList"
                        :id="item.dataCode"
                        :data-dataName="item.dataName"
                        :key="item.dataCode"
                        :label="item.dataName"
                        :value="item.dataCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="库区名称" prop="areaId">
                <el-select v-model="formInline.areaId" placeholder="选择库区名称" @change="getAll">
                    <el-option v-for="item in areaOptions"
                        :id="'area'+item.dataCode"
                        :data-dataName="item.dataName"
                        :key="item.dataCode"
                        :label="item.dataName"
                        :value="item.dataCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="库区编码" prop="areaCode">
                <el-input disabled clearable v-model="formInline.areaCode" placeholder="库区编码"></el-input>
            </el-form-item>
            <el-form-item label="分区功能" prop="areaFunctionName">
                <el-input disabled clearable v-model="formInline.areaFunctionName" placeholder="分区功能"></el-input>
            </el-form-item>
            <el-form-item label="分区楼层" prop="areaFloor">
                <el-input disabled clearable v-model="formInline.areaFloor" placeholder="分区楼层" maxlength="2"></el-input>
            </el-form-item>
            <el-form-item label="货列编码" class="codeFormitem" prop="hasRowCode">
                <el-select v-model="formInline.hasRowCode" placeholder="连续">
                    <el-option v-for="item in numberType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <div class="codeInput">
                    <el-input min="0" max="99" v-model="start" @keyup.native="changeCode('start')" @change="setIndexs">
                         <template slot="append">至</template>
                    </el-input>
                    <el-input min="0" max="99" v-model="end" @keyup.native="changeCode('end')"  @change="setIndexs"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="货列状态" prop="rowState">
                <el-select v-model="formInline.rowState" placeholder="货列状态">
                    <el-option v-for="item in rowOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="描述">
                <el-input clearable v-model="formInline.rowRemark" type='text' placeholder="描述" maxlength="50"></el-input>
            </el-form-item>
        </el-form>
    </div>

    <!-- <div class="p-20 handle-cont">
        <el-button class="middle-button" @click="$router.push('ShipmentInfo')">返回</el-button>
        <el-button class="middle-button" type="primary" @click="viewRowData">预览新添货列</el-button>
    </div> -->
    <V-BottomBtn :buttonList="buttonList" :noBack="noBack" @toBack="toBack" @view="viewRowData"></V-BottomBtn>

   <!-- 新添货列弹窗 -->
    <el-dialog title="新添货列" :visible.sync="confirmVisible">
        <el-table :data="rowData" class="mt-10 pt-5 tableBox">
            <el-table-column type="index" label="序号">      
            </el-table-column>
            <el-table-column prop="warehouseName" label="仓库名称"></el-table-column>
            <el-table-column prop="areaCode" label="库区编码"></el-table-column>
            <el-table-column prop="areaName" label="库区名称"></el-table-column>
            <el-table-column prop="areaFunctionName" label="分区功能"></el-table-column>
            <el-table-column prop="areaFloor" label="分区楼层"></el-table-column>
            <el-table-column prop="rowCode" label="货列编码"></el-table-column>
            <el-table-column prop="rowState" label="货列状态">
                <template slot-scope="scope">     
                    <span>{{scope.row.rowState === 1 ? '启用' : '禁用'}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="rowRemark" label="描述" show-overflow-tooltip></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button class="middle-button" @click="confirmVisible = false">取消</el-button>
            <el-button class="middle-button" type="primary" @click="addSuccess">确定生成货列</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
export default {
    name: 'BasicConfiguration_ShipmentInfoAdd',
    data () {
        return {
            maxLim: true, // 货列编码数字大小范围控制
            startVSend: true, // 开始值与结束值大小比较符合条件
            buttonList:[
                {
                    name:'返回',    //按钮名称
                    emitType:'toBack'    //方法
                },
                {
                    name:'预览新添货列',    //按钮名称
                    type:true,    //是否为主按钮-可不传
                    emitType:'view'    //方法
                },
            ],
            noBack: true,   // 为true时不需要返回按钮
            areaOptions: [], // 库区名称下拉框数据
            confirmVisible: false, // 新添货列弹框
            start: '', // 货列编码 开始值
            end: '', // 货列编码 结束值
            rowOptions: [
                {
                    value: 0,
                    label: '禁用'
                },
                {
                    value: 1,
                    label: '启用'
                }
            ],
            formInline: {
                warehouseCode: '',
                warehouseName: '',
                areaName: '',
                areaId: '',
                areaCode: '',
                areaFunctionName: '',
                areaFunction: '',
                areaFloor: '',
                rowState: 1,
                rowRemark: '',
                hasRowCode: '0', // 有货列编码类型选择
            },
            options: [
                {
                    value: '0',
                    label: 'SKU'
                },
                {
                    value: '1',
                    label: '产品名称'
                },
                {
                    value: '2',
                    label: '供应商'
                },
                {
                    value: '3',
                    label: '货主'
                },
            ],
            numberType: [
                {
                    value: '0',
                    label: '连续'
                },
                {
                    value: '1',
                    label: '奇数'
                },
                {
                    value: '2',
                    label: '偶数'
                },
            ],
            formRules: {
                warehouseCode: [{ required: true, message: "请选择仓库名称", trigger: "change" }],
                areaId: [{ required: true, message: "请选择库区名称", trigger: "change" }],
                // areaCode: [{ required: true, message: "请输入库区编码", trigger: "change" }],
                // areaFunctionName: [{ required: true, message: "请输入分区功能", trigger: "change" }],
                // areaFloor: [{ required: true, message: "请输入分区楼层", trigger: "change" }],
                hasRowCode: [{ required: true, message: "请选择货列编码", trigger: "change" }],
                rowState: [{ required: true, message: "请选择货列状态", trigger: "change" }],
            },
            rowData: [],
            indexs: [],
        }
    },
    methods: {
        // 返回
        toBack() {
            this.$router.push('/BasicConfiguration/ShipmentInfo')
            // 返回清数据
            Object.assign(this.$data, this.$options.data())
            this.$nextTick( () => {
                this.$refs['formInline'].clearValidate()
            })
            this.getWareHouse()
        },
        // 确定生成货列
        addSuccess() {
            console.log(this.rowData)
            this.$api.BasicConfiguration.addRow(this.rowData).then(res => {
                if(res.errorCode === '100200'){
                    if(res.data.dumpCode) {
                        let codes = res.data.dumpCode.join('、')
                        this.$message.warning(res.data.state + ', 货位编码' + codes + '出现重复！')
                        this.confirmVisible = false
                        return
                    } else {
                        this.$message.success(res.data.state)
                    }
                    Object.assign(this.$data, this.$options.data())
                    this.$nextTick( () => {
                        this.$refs['formInline'].clearValidate()
                    })
                    this.getWareHouse()
                    this.confirmVisible = false
                }else{
                    this.$message.error(res.msg)
                }
            }).catch(error => {

            });
        },
        // 预览货列数据
        async viewRowData(val) {
            console.log(this.formInline)
            this.rowData = []
            await this.setIndexs()
            this.$refs.formInline.validate(valid => {
                if(valid) {
                    if(!this.start || !this.end) {
                        this.$message.error('货列编码未填写完整！')
                        return
                    }
                    if(!this.startVSend) {
                        this.$message.error('开始值不能大于结束值！')
                        return
                    }
                    this.indexs.forEach((item,index) => {
                        this.rowData.push({
                            warehouseName: this.formInline.warehouseName,
                            areaCode: this.formInline.areaCode,
                            areaId: this.formInline.areaId,
                            areaName: this.formInline.areaName,
                            areaFunction: this.formInline.areaFunction,
                            areaFunctionName: this.formInline.areaFunctionName,
                            areaFloor: this.formInline.areaFloor,
                            rowCode: this.formInline.areaCode + (item<10?'0'+item:item),
                            rowState: this.formInline.rowState,
                            rowRemark: this.formInline.rowRemark,
                            warehouseCode: this.formInline.warehouseCode
                        })
                    })
                    this.confirmVisible=true
                } else {
                    this.$utils.commonUtils.tip('必填项未填写完整！','error')
                }
            })
        },
        // 生成货列数据编码
        setIndexs() {
            return new Promise((resolve) => {
                if(this.start && this.end) {
                    this.indexs = []
                    let start = parseInt(this.start)
                    let end = parseInt(this.end)
                    if(start > end) {
                        this.$message.error('开始值不能大于结束值!')
                        this.startVSend = false
                        return
                    }
                    if(start > 99 || start === 0 || end > 99 || end === 0) {
                        this.$message.error('货列编码输入数字大小范围为：1-99')
                        this.maxLim = false
                        return
                    }
                    // 再次修改符合条件 重置为true
                    this.startVSend = true
                    this.maxLim = true
                    if(this.formInline.hasRowCode === '0') {
                        for(let i = start; i <= end ; i ++ ) {
                            this.indexs.push(i)
                        }
                    }
                    if(this.formInline.hasRowCode === '1') {
                        if(this.start % 2 === 1) {
                            for(let i = start; i <= end; i += 2) {
                                this.indexs.push(i)
                            }
                        } else {
                            for (let i = start + 1; i <= end; i += 2) {
                                this.indexs.push(i)
                            }
                        }
                    }
                    if(this.formInline.hasRowCode === '2') {
                        if(this.start % 2 === 1) {
                            for(let i = start + 1; i <= end; i += 2) {
                                this.indexs.push(i)
                            }
                        } else {
                            for (let i = start; i <= end; i += 2) {
                                this.indexs.push(i)
                            }
                        }
                    }
                }
                resolve()
            })
        },
        // 获取库区数据
        getArea(val) {
            this.$set(this.formInline,'areaId','')
            this.$set(this.formInline,'areaCode','')
            this.$set(this.formInline,'areaFunction','')
            this.$set(this.formInline,'areaFunctionName','')
            this.$set(this.formInline,'areaFloor','')
            this.$nextTick(() => {
                this.$refs['formInline'].clearValidate('areaId')
            })
            let name = document.getElementById(val).dataset.dataname
            this.$set(this.formInline,'warehouseName',name)
            this.$api.BasicConfiguration.kvArea({warehouseCode:val}).then(res => {
                if(res.errorCode === '100200'){
                    console.log(res.data)
                    this.areaOptions = res.data
                }else{
                    this.$message.error(res.msg)
                }
            }).catch(error => {

            });
        },
        // 获取对应库区详情
        getAll(val) {
            let name = document.getElementById('area'+val).dataset.dataname
            this.$set(this.formInline,'areaName',name)
            this.$api.BasicConfiguration.infoArea({id:val}).then(res => {
                if(res.errorCode === '100200'){
                    console.log(res.data)
                    let object = res.data
                    this.$set(this.formInline,'areaCode',object.areaCode)
                    this.$set(this.formInline,'areaFunction',object.areaFunction)
                    this.$set(this.formInline,'areaFunctionName',object.areaFunctionName)
                    this.$set(this.formInline,'areaFloor',object.areaFloor)
                }else{
                    this.$message.error(res.msg)
                }
            }).catch(error => {

            });
        },
        // 限制正整数方法
        changeCode(val) {
            this[val] = this[val].replace(/[^\d]/g,'')
        },
    },
    activated() {
        // 已打开新添页面，再次点击新添进来清除数据
        if(this.$store.state.warehouse.isFreshAddS) {
            Object.assign(this.$data, this.$options.data())
            this.$nextTick( () => {
                this.$refs['formInline'].clearValidate()
            })
            this.$store.commit("getFreshAddS", false)
        }
        this.getWareHouse()
    }
}
</script>
