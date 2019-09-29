<template>
<div class="goods-loc-info-add">
    <V-Title title="新添货位信息"></V-Title>

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
                        :id="item.dataCode+'areaId'"
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
                <el-input disabled clearable v-model="formInline.areaFloor" placeholder="分区楼层"></el-input>
            </el-form-item>
            <el-form-item label="货列编码" prop="rowCodes">
                <el-select multiple v-model="formInline.rowCodes" placeholder="" @change="getRowArr">
                    <el-option v-for="item in rowOptions"
                        :key="item.dataCode"
                        :label="item.dataName"
                        :value="item.dataCode">
                    </el-option>
                </el-select>
                <span class="espShow" v-if="espShow">……</span>
            </el-form-item>
            <el-form-item label="货架编码" class="codeFormitem" prop="numType">
                <el-select v-model="formInline.numType" placeholder="连续" @change="getNum()">
                    <el-option v-for="item in numberTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <div class="codeInput">
                    <el-input min="0" max="99" v-model="start" @keyup.native="changeCode('start')" @change="getNum();maxLimit('start',99)">
                         <template slot="append">至</template>
                    </el-input>
                    <el-input min="0" max="99" v-model="end" @keyup.native="changeCode('end')" @change="getNum();maxLimit('end',99)"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="层" class="codeFormitem" prop="numType1">
                <el-select v-model="formInline.numType1" placeholder="连续" @change="getNum1()">
                    <el-option v-for="item in numberTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <div class="codeInput">
                    <el-input min="0" max="9" v-model="start1" @keyup.native="changeCode('start1')" @change="getNum1();maxLimit('start1',9)">
                         <template slot="append">至</template>
                    </el-input>
                    <el-input min="0" max="9" v-model="end1" @keyup.native="changeCode('end1')" @change="getNum1();maxLimit('end1',9)"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="格" class="codeFormitem" prop="numType2">
                <el-select v-model="formInline.numType2" placeholder="连续" @change="getNum2()">
                    <el-option v-for="item in numberTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <div class="codeInput">
                    <el-input min="0" max="9" v-model="start2" @keyup.native="changeCode('start2')" @change="getNum2();maxLimit('start2',9)">
                         <template slot="append">至</template>
                    </el-input>
                    <el-input min="0" max="9" v-model="end2" @keyup.native="changeCode('end2')" @change="getNum2();maxLimit('end2',9)"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="货位规格" prop="positionSpec">
                <el-select v-model="formInline.positionSpec" placeholder="货位规格" @change="getPositionSpec">
                    <el-option v-for="item in specOptions"
                        :id="item.dataCode+'sp'"
                        :data-dataName="item.dataName"
                        :key="item.dataCode"
                        :label="item.dataName"
                        :value="item.dataCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="货位类型" prop="positionType">
                <el-select v-model="formInline.positionType" placeholder="货位类型" @change="getPositionType">
                    <el-option v-for="item in typeOptions"
                        :id="item.dataCode+'ty'"
                        :data-dataName="item.dataName"
                        :key="item.dataCode"
                        :label="item.dataName"
                        :value="item.dataCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="绑定分类">
                <el-button :title="formInline.categorys?'已选分类：'+formInline.categorys:''" type="text" style="margin-right: 80px;" @click="dialogVisible = true">选择分类>></el-button>
            </el-form-item>
            <el-form-item label="是否锁定" prop="lockState">
                <el-select v-model="formInline.lockState" placeholder="是否锁定">
                    <el-option v-for="item in lockOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="长/宽/高(mm)" prop="lwh">
                <el-input clearable v-model="formInline.lwh" type='text' placeholder="例：10/10/10" @blur="getVolume"></el-input>
            </el-form-item>
        </el-form>
    </div>
    
    <!-- <div class="p-20 handle-cont">
        <el-button class="middle-button" @click="$router.push('/GoodLocInfo')">返回</el-button>
        <el-button class="middle-button" type="primary" @click="viewPositionData">预览新添货列</el-button>
    </div> -->
    <V-BottomBtn :buttonList="buttonList" :noBack="noBack" @toBack="toBack" @view="viewPositionData"></V-BottomBtn>

   <!-- 新添货列弹窗 -->
    <el-dialog width="800px" class="positionDialog" title="新添货位" :visible.sync="confirmVisible">
        <el-table :data="positionData" class="mt-10 pt-5 tableBox">
            <el-table-column type="index" label="序号" width="50"/>
            <el-table-column prop="warehouseName" label="仓库名称"/>
            <el-table-column prop="areaCode" label="库区编码"/>
            <el-table-column prop="areaName" label="库区名称"/>
            <el-table-column prop="areaFunctionName" label="分区功能"/>
            <el-table-column prop="areaFloor" label="分区楼层"/>
            <el-table-column prop="rowCode" label="货列编码"/>
            <el-table-column prop="shelvesCode" label="货架编码" min-width="100px"/>
            <el-table-column prop="positionCode" label="货位编码" min-width="120px"/>
            <el-table-column prop="positionSpecName" label="货位规格"/>
            <el-table-column prop="positionTypeName" label="货位类型"/>
            <el-table-column prop="categorys" label="分类" min-width="160px" show-overflow-tooltip/>
            <el-table-column prop="lockState" label="是否锁定">
                <template slot-scope="scope">     
                    <span>{{scope.row.lockState === '1' ? '锁定' : '不锁定'}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="lwh" label="长/宽/高(mm)" min-width="120px"/>
            <el-table-column prop="volume" label="体积mm³" min-width="100px"/>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button class="middle-button" @click="confirmVisible = false">取消</el-button>
            <el-button class="middle-button" type="primary" @click="addSuccess">确定生成货位</el-button>
        </div>
    </el-dialog>

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
    name: 'BasicConfiguration_GoodLocInfoAdd',
    data () {
        return {
            startVSend: true, // 开始值与结束值大小比较符合条件
            maxLimArr: { // 数字输入大小控制
                start: true,
                end: true,
                start1: true,
                end1: true,
                start2: true,
                end2: true,
            },
            espShow: false, // 货列号多选时显示省略号
            buttonList:[
                {
                    name:'返回',    //按钮名称
                    emitType:'toBack'    //方法
                },
                {
                    name:'预览新添货位',    //按钮名称
                    type:true,    //是否为主按钮-可不传
                    emitType:'view'    //方法
                },
            ],
            noBack: true,   // 为true时不需要返回按钮
            lwhFormat: true, // 长宽高输入格式判断
            rowCodeNames: [], // 货列号id数组
            dialogVisible: false, // 选择分类弹框
            treeData: [], // 分类数据
            cateProps: {
                children: "children",
                label: "name",
            },
            terrCheck:[],// 选中树形数组
            lRowCodeArr: [], // 最终生成的货列号数组
            lShelvesCodeArr: [], // 最终生成的货架号数组
            lCodeArr: [], // 最终生成的货位号数组
            // numType: '0', // 货架编码数据区间类型  连续/奇/偶
            start: '', // 区间开始值
            end: '', // 区间结束值
            numArr: [], // 货架编码数组
            // numType1: '0', // 层编码数据区间类型  连续/奇/偶
            start1: '', // 区间开始值
            end1: '', // 区间结束值
            numArr1: [], // 层数组
            // numType2: '0', // 格编码数据区间类型  连续/奇/偶
            start2: '', // 区间开始值
            end2: '', // 区间结束值
            numArr2: [], // 格数组
            rowArr: [], // 货列号数组
            numberTypes: [
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
            specOptions: [], // 货位规格下拉数据
            typeOptions: [], // 货位类型下拉数据
            areaOptions: [], // 库区下拉数据
            rowOptions: [], // 货列号下拉数据
            confirmVisible: false, // 新添货列弹框
            formInline: {
                areaCode: '', // 库区编码
                areaFloor: '', // 分区楼层
                areaFunction: '', // 分区功能
                areaFunctionName: '',
                areaId: '',
                areaName: '', // 库区名称
                rowCodes: [], 
                categoryList: [],
                height: '',
                length: '',
                width: '',
                lockState: '0', // 是否锁定 0-不锁定 1锁定 ,
                categorys: '', // 分类
                // positionCode: '', // 货位号
                positionSpec: '', // 货位规格
                positionSpecName: '', // 货位规格
                positionState: '', // 货位状态 0-空货位 1-满货位
                positionType: '', // 货位类型
                positionTypeName: '', // 货位类型
                rowCode: [], // 货列号
                rowId: '', // 货列Id
                shelvesCode: '', // 货架号
                warehouseCode: '',
                warehouseName: '', // 仓库名称
                volume: '', // 体积(mm3)
                lwh: '', // 长宽高(mmm)
                updateBy: '',
                numType: '0', // 货架编码数据区间类型  连续/奇/偶
                numType1: '0', // 层编码数据区间类型  连续/奇/偶
                numType2: '0', // 格编码数据区间类型  连续/奇/偶
            },
            lockOptions: [
                {
                    value: '0',
                    label: '不锁定'
                },
                {
                    value: '1',
                    label: '锁定'
                }
            ],
            formRules: {
                warehouseCode: [{ required: true, message: "请选择仓库名称", trigger: "change" }],
                areaId: [{ required: true, message: "请选择库区名称", trigger: "change" }],
                // areaCode: [{ required: true, message: "库区编码为必填项", trigger: "change" }],
                // areaFunctionName: [{ required: true, message: "分区功能为必填项", trigger: "change" }],
                // areaFloor: [{ required: true, message: "分区楼层为必填项", trigger: "change" }],
                rowCodes: [{ required: true, message: "请选择货列编码", trigger: "change" }],
                numType: [{ required: true, message: "请填写货架编码", trigger: "change" }],
                numType1: [{ required: true, message: "请填写层数", trigger: "change" }],
                numType2: [{ required: true, message: "请填写格数", trigger: "change" }],
                positionSpec: [{ required: true, message: "请选择货位规格", trigger: "change" }],
                positionType: [{ required: true, message: "请选择货位类型", trigger: "change" }],
                lockState: [{ required: true, message: "请选择是否锁定", trigger: "change" }],
                lwh: [{ required: true, message: "请填写长/宽/高(mm)", trigger: "change" }]
            },
            positionData: [],
        }
    },
    methods: {
        // 返回
        toBack() {
            this.$router.push('/BasicConfiguration/GoodLocInfo')
            // 返回清数据
            Object.assign(this.$data, this.$options.data())
            this.$nextTick( () => {
                this.$refs['formInline'].clearValidate()
            })
            this.getWareHouse()
            this.getDictCode()
            this.getCatelogy()
        },
        // 获取货位规格
        getPositionSpec(val) {
            let name = document.getElementById(val+'sp').dataset.dataname
            this.$set(this.formInline,'positionSpecName',name)
        },
        // 获取货位规格
        getPositionType(val) {
            let name = document.getElementById(val+'ty').dataset.dataname
            this.$set(this.formInline,'positionTypeName',name)
        },
        // 树形勾选数据
        handleCheckTree(){
            // this.formInline.categoryList = []
            console.log('555555555555555555')
            this.$set(this.formInline,'categoryList',[])
            this.$set(this.formInline,'categorys','')
            this.terrCheck=this.$refs.tree.getCheckedNodes()//获取到勾选中的数组对象
            console.log(this.terrCheck)
            if(this.terrCheck.length) {
                let idArr = []
                this.terrCheck.forEach(item => {
                    idArr.push(item.id)
                    this.formInline.categoryList.push({
                        dataCode:item.id,
                        dataName:item.name
                    })
                })
                // 获取分类级联名称进行展示
                this.$api.BasicConfiguration.goodsPositionInfo(idArr).then((res) => {
                    console.log(res.data)
                    let arr = []
                    res.data.forEach(item => {
                        arr.push(item.dataName)
                    })
                    this.$set(this.formInline,'categorys',arr.join(','))
                }).catch((err) => {
                    console.log(err)
                });
            }
            this.dialogVisible = false
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
        // 预览货列数据
        viewPositionData(val) {
            console.log(this.formInline)
            this.positionData = []
            let categoryList = []
            this.terrCheck.forEach(item => {
                categoryList.push({
                    dataCode:item.id,
                    dataName:item.name
                })
            })
            console.log(categoryList)   
            this.$refs.formInline.validate(valid => {
                if(valid) {
                    // 长宽高格式不对，不能提交
                    if(!this.lwhFormat) {
                        this.$message.error('长/宽/高 输入格式错误！(注：其中长、宽、高为正整数)')
                        return
                    }
                    if(!this.start || !this.end) {
                        this.$message.error('货架编码未填写完整！')
                        return
                    }
                    if(!this.start1 || !this.end1) {
                        this.$message.error('层未填写完整!')
                        return
                    }
                    if(!this.start2 || !this.end2) {
                        this.$message.error('格未填写完整!')
                        return
                    }
                    if(!this.maxLimArr.start || !this.maxLimArr.end || !this.maxLimArr.start1 || !this.maxLimArr.end1 || !this.maxLimArr.start2 || !this.maxLimArr.end2) {
                        this.$message.error('数字大小范围不符合条件!')
                        return
                    }
                    if(!this.startVSend) {
                        this.$message.error('开始值不能大于结束值!')
                        return
                    }
                    this.lCodeArr.forEach((item,index) => {
                        this.positionData.push({
                            areaCode: this.formInline.areaCode,
                            areaFloor: this.formInline.areaFloor, // 分区楼层
                            areaFunction: this.formInline.areaFunction, // 分区功能
                            areaFunctionName: this.formInline.areaFunctionName,
                            areaId: this.formInline.areaId,
                            areaName: this.formInline.areaName, // 库区名称
                            height: this.formInline.height,
                            length: this.formInline.length,
                            width: this.formInline.width,
                            categorys: this.formInline.categorys,
                            categoryList: this.formInline.categoryList,
                            lockState: this.formInline.lockState, // 是否锁定 0-不锁定 1锁定 ,
                            positionCode: item, // 货位号                       
                            positionSpec: this.formInline.positionSpec, // 货位规格
                            positionSpecName: this.formInline.positionSpecName, // 货位规格
                            positionState: this.formInline.positionState, // 货位状态 0-空货位 1-满货位
                            positionType: this.formInline.positionType, // 货位类型
                            positionTypeName: this.formInline.positionTypeName, // 货位类型
                            rowCode: this.lRowCodeArr[index], // 货列号
                            rowId: this.lRowCodeIdArr[index], // 货列Id
                            shelvesCode: this.lShelvesCodeArr[index], // 货架号
                            warehouseCode: this.formInline.warehouseCode,
                            warehouseName: this.formInline.warehouseName, // 仓库名称
                            volume: this.formInline.volume, // 体积(mm3)
                            lwh: this.formInline.lwh, // 长宽高(mmm)
                            updateBy: 'cr'
                        })
                    })
                    this.confirmVisible=true
                } else {
                    this.$utils.commonUtils.tip('必填项未填写完整！','error')
                }
            })
        },
        // 计算体积
        getVolume() {
            if(this.formInline.lwh) {
                let arr = this.formInline.lwh.split('/')
                if(arr.length === 3) {
                    if(arr[0].match(/[^\d]/g) || arr[1].match(/[^\d]/g) || arr[2].match(/[^\d]/g) || Number(arr[0])===0 || Number(arr[1])===0 || Number(arr[2])===0) {
                        this.lwhFormat = false
                        return
                    }
                    let volume = parseInt(arr[0]) * parseInt(arr[1]) * parseInt(arr[2])
                    this.$set(this.formInline, 'length', parseInt(arr[0]))
                    this.$set(this.formInline, 'width', parseInt(arr[1]))
                    this.$set(this.formInline, 'height', parseInt(arr[2]))
                    this.$set(this.formInline, 'volume', volume)
                    this.lwhFormat = true
                } else {
                    this.lwhFormat = false // 长宽高格式不对，不能提交
                }
            } 
        },
        // 生成货位号
        setPositionCode() {
            this.lCodeArr = []
            this.lRowCodeArr = []
            this.lShelvesCodeArr = []
            this.lRowCodeIdArr = []
            if(this.rowCodeNames && this.numArr && this.numArr1 && this.numArr2) {
                this.rowCodeNames.forEach((item,index) => {
                    this.numArr.forEach(item1 => {
                        this.numArr1.forEach(item2 => {
                            this.numArr2.forEach(item3 => {
                                this.lRowCodeIdArr.push(this.rowArr[index])
                                this.lRowCodeArr.push(item)
                                this.lShelvesCodeArr.push(item + '-' + (item1 < 10 ? '0' + item1 : item1))
                                this.lCodeArr.push(item + '-' + (item1 < 10 ? '0' + item1 : item1) + '-' + item2 + item3)
                            })
                        })
                    })
                })
            }
            console.log(this.lCodeArr)
            console.log(this.lRowCodeArr)
            console.log(this.lShelvesCodeArr)
        },
        // 获取货列号
        getRowArr(val) {
            console.log(val)
            this.rowCodeNames = []
            this.rowArr = val
            if(this.rowArr.length > 1) {
                this.espShow = true
            } else {
                this.espShow = false
            }
            this.rowArr.forEach((item,index) => {
                this.rowOptions.forEach((item1,index1) => {
                    if(item === item1.dataCode) {
                        this.rowCodeNames.push(item1.dataName)
                    }
                })
            })
            this.setPositionCode()   
        },
        // 获取货架编码数组
        getNum() {
            this.numArr = this.setIndexs(this.start,this.end,this.formInline.numType)
            console.log(this.numArr)
            this.setPositionCode()
        },
        // 获取层数组
        getNum1() {
            this.numArr1 = this.setIndexs(this.start1,this.end1,this.formInline.numType1)
            console.log(this.numArr1)
            this.setPositionCode()
        },
        // 获取格数组
        getNum2() {
            this.numArr2 = this.setIndexs(this.start2,this.end2,this.formInline.numType2)
            console.log(this.numArr2)
            this.setPositionCode()
        },
        // 设置数字区间
        setIndexs(start,end,type) {
            let indexs = []
            let s = parseInt(start)
            let e = parseInt(end)
            if(start && end) {
                if(parseInt(s) > parseInt(e)) {
                    this.$message.error('开始值不能大于结束值!')
                    this.startVSend = false
                    return
                }
                this.startVSend = true // 再次修改符合条件 重置为true
                if(type === '0') {
                    for(let i = s; i <= end ; i ++ ) {
                        indexs.push(i)
                    }
                }
                if(type === '1') {
                    if(start % 2 === 1) {
                        for(let i = s; i <= e; i += 2) {
                            indexs.push(i)
                        }
                    } else {
                        for (let i = s + 1; i <= e; i += 2) {
                            indexs.push(i)
                        }
                    }
                }
                if(type === '2') {
                    if(start % 2 === 1) {
                        for(let i = s + 1; i <= e; i += 2) {
                            indexs.push(i)
                        }
                    } else {
                        for (let i = s; i <= e; i += 2) {
                            indexs.push(i)
                        }
                    }
                }
                return indexs
            } 
        },
        // 获取下拉框数据  货位规格/货位类型
        getDictCode() {
            // 获取货位规格下拉数据
            this.$api.BasicConfiguration.getDictCode({dictCode:"position_spec"}).then(res => {
                if(res.errorCode === '100200'){
                    console.log(res.data)
                    this.specOptions = res.data
                }else{
                    this.$message.error(res.msg)
                }
            }).catch(error => {

            });
            // 获取货位类型下拉数据
            this.$api.BasicConfiguration.getDictCode({dictCode:"position_type"}).then(res => {
                if(res.errorCode === '100200'){
                    console.log(res.data)
                    this.typeOptions = res.data
                }else{
                    this.$message.error(res.msg)
                }
            }).catch(error => {

            });
        },
        // 获取库区数据
        getArea(val) {
            // 仓库更改，清空数据
            this.$set(this.formInline,'rowCodes',[])
            this.$set(this.formInline,'areaId','')
            this.$set(this.formInline,'areaCode','')
            this.$set(this.formInline,'areaFunction','')
            this.$set(this.formInline,'areaFunctionName','')
            this.$set(this.formInline,'areaFloor','')
            this.$nextTick(() => {
                this.$refs['formInline'].clearValidate("areaId")
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

            })
        },
        // 获取对应库区详情
        getAll(val) {
            // 库区更改，清空货列编码
            this.$set(this.formInline,'rowCodes',[])
            this.rowCodeNames = []
            this.lRowCodeIdArr = []
            this.lRowCodeArr = []
            this.espShow = false // 省略号不显示
            this.$nextTick(() => {
                this.$refs['formInline'].clearValidate("rowCodes")
            })
            // 加 'areaId'避免与 仓库下拉框dataset冲突
            let name = document.getElementById(val+'areaId').dataset.dataname
            this.$set(this.formInline,'areaName',name)
            console.log(this.formInline.areaName)
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

            })
            // 获取货列号
            this.$api.BasicConfiguration.kvRow({areaId:val}).then(res => {
                if(res.errorCode === '100200'){
                    console.log(res.data)
                    this.rowOptions = res.data
                }else{
                    this.$message.error(res.msg)
                }
            }).catch(error => {

            });
        },
        // 确定生成货位
        addSuccess() {
            if(!this.positionData.length) {
                this.$message.error('暂无货位数据无法生成货位！')
                return
            }
            this.$api.BasicConfiguration.addPosition(this.positionData).then(res => {
                if(res.errorCode === '100200'){
                    console.log(res.data)
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
                    this.getDictCode()
                    this.getCatelogy()
                    this.confirmVisible = false
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
        // 大小控制
        maxLimit(val,max) {
            if(parseInt(this[val]) > max || parseInt(this[val]) === 0) {
                this.$message.error('输入数字大小范围为：1-' + max)
                this.$set(this.maxLimArr,val,false)
                return
            }
            this.$set(this.maxLimArr,val,true)
        }
    },
    activated() {
        // 已打开新添页面，再次点击新添进来清除数据
        if(this.$store.state.warehouse.isFreshAddG) {
            Object.assign(this.$data, this.$options.data())
            this.$nextTick( () => {
                this.$refs['formInline'].clearValidate()
            })
            this.$store.commit("getFreshAddG", false)
        }
        this.getWareHouse()
        this.getDictCode()
        this.getCatelogy()
    }
}
</script>
