/*
 * @Author: zhoujianqiang 
 * @Date: 2019-08-02 11:02:44 
 * @Last Modified by: zhoujianqiang
 * @Last Modified time: 2019-08-29 10:15:00
 */
<template>
    <!-- 面单信息 -->
    <div class="order-infomation-box">
        <div class="information-from">
            <el-form :model="infomationForm" class="demo-form-inline" :rules="orderInfoRules" ref="orderInfoRef" label-width="130px" label-position="right">
                <div class="informationItem clearfix">
                    <el-form-item label="面单规格" prop="specification">
                        <el-select :disabled="istype"   v-model="infomationForm.specification" placeholder="请选择面单规格">
                            <!-- 选项暂时写死 -->
                            <el-option label="100*100" value="100mm*100mm"></el-option>
                            <el-option label="100*150" value="100mm*150mm"></el-option>
                            <el-option label="50*50" value="50mm*50mm"></el-option>
                            <el-option label="A4纸" value="A4纸"></el-option>
                            <el-option label="A5纸" value="A5纸"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="面单打印方向" prop="printDirection">
                        <el-select :disabled="istype"   v-model="infomationForm.printDirection" placeholder="请选择面单打印方向">
                            <el-option label="横向" value="1"></el-option>
                            <el-option label="纵向" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="informationItem clearfix">
                    <el-form-item label="面单来源类型" prop="labelFrom">
                        <el-select :disabled="istype"   v-model="infomationForm.labelFrom" placeholder="请选择面单来源类型">
                            <el-option label="物流商API接口获取" value="1"></el-option>
                            <el-option label="自制模版" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否需报关信息" prop="isCustomsDeclaration">
                        <el-select :disabled="istype"   v-model="infomationForm.isCustomsDeclaration" placeholder="请选择是否需报关信息">
                            <el-option label="需要" value='1'></el-option>
                            <el-option label="不需要" value='2'></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="informationItem clearfix">
                    <el-form-item label="面单显示条码" prop="barCodeType">
                        <el-select :disabled="istype"   v-model="infomationForm.barCodeType" placeholder="请选择面单显示条码">
                            <el-option label="跟踪号" value="1"></el-option>
                            <el-option label="包裹号" value="2"></el-option>
                            <el-option label="运单号" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="面单序列号" prop="expressSheetSequence" v-if="this.$route.query.Logistics">
                        <el-input clearable :disabled="true" v-model="infomationForm.expressSheetSequence" ></el-input>
                    </el-form-item>
                </div>
                <div class="informationItem clearfix">
                    <el-form-item label="面单水印坐标" prop="coordinateX">
                        <el-input :disabled="istype"   placeholder="面单水印坐标" v-model="infomationForm.coordinateX" class="mr-5" style="width:115px">
                            <template slot="prepend">X</template>
                        </el-input>
                        <el-input :disabled="istype"   placeholder="面单水印坐标" v-model="infomationForm.coordinateY" style="width:115px">
                            <template slot="prepend">Y</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="面单水印字号" prop="wordSize">
                        <el-input :disabled="istype" placeholder="请输入面单水印字号" v-model.number="infomationForm.wordSize"></el-input>
                    </el-form-item>
                </div>
                <div class="informationItem clearfix">
                    <el-form-item label="下单失效时间" prop="overTime">
                        <el-input :disabled="istype"   placeholder="请输入下单失效时间" v-model="infomationForm.overTime">
                            <template slot="append">天</template>
                        </el-input>
                        <p><span class="star">*</span>0表示不过期，其他数字表示失效天数<span></span></p>
                    </el-form-item>
                </div>
                <!-- <div class="informationItem clearfix"> 这个字段第一版本用不上。以后的版本也不一定，
                    <el-form-item label="允许下单次数" prop="allowTimes">
                        <el-select v-model="infomationForm.allowTimes" placeholder="活动区域">
                            <el-option label="0" value="0"></el-option>
                            <el-option label="1" value="1"></el-option>
                        </el-select>
                        <p><span class="star">*</span> 0表示不限制，1表示一个订单号只能下单一次<span></span></p>
                    </el-form-item>
                </div> -->
            </el-form>
        </div>
        <V-BottomBtn :buttonList="buttonList" @cancel="toBack"  :noBack="noBack" @changeFn='changeFn' @OrderInfoSub="OrderInfoSub"></V-BottomBtn>
    </div>
</template>
<script>
export default {
    data(){
        return{
            infomationForm:{},
            noBack:true,
            buttonList:[
                    {
                    name:'返回',    //按钮名称
                    emitType:'cancel'    //方法
                    },{
                        name:'修改',    //按钮名称
                        type:true,    //是否为主按钮-可不传
                        emitType:'changeFn'    //方法
                    },
                ],
            orderInfoRules:{
                specification:[ { required: true, message: '请选择面单规格', trigger: 'change' },],
                isCustomsDeclaration:[ { required: true, message: '请选择是否需要报关信息', trigger: 'change' },],
                overTime:[ { required: true, message: '请填写失效时间', trigger: 'blur' },],
                wordSize:[{ type: 'number', message: '面单水印字号必须为数字值',trigger: 'blur' },
                    {validator:(rule,val,fn)=>{
                            if(!/^(\d{1,2}|100|NA)$/.test(val)){
                                fn(new Error('只能输入0-100之内的数字'))
                            }
                            else{
                                fn()
                            }
                        } 
                    }
                ]
                // allowTimes:[ { required: true, message: '请选择允许下单次数', trigger: 'change' },],
            },
            istype:true,
            methodId:'' //运输方式id

        }
    },
    activated(){
        this.getselectInvoiceSpecification()
    },
    methods:{
        changeFn(){
            this.istype = false
            this.buttonList = [
                {
                    name:'返回',    //按钮名称
                    emitType:'cancel'    //方法
                },
                {
                    name:'保存',    //按钮名称
                    type:true,    //是否为主按钮-可不传
                    emitType:'OrderInfoSub',    //方法
                    disabState:false
                },
            ]
        },
        OrderInfoSub(){   //新增&修改面单数据
            var params = this.infomationForm
            params.id = this.$route.query.Logistics
            params.providerId = this.$route.query.id
            // params.allowTimes = 1  //这个字段是用作面单->下单次数  第一版本用不上，给一个默认值保留用作下版本使用
            if(this.$route.query.Logistics){
                 params.methodId = this.$route.query.Logistics
            }else{
                params.methodId = this.$parent.methodId
            }
            for(let item in params){
                if(item != 'specification' && item !='expressSheetSequence' && item != 'wordSize'){
                    params[item] = parseInt(params[item])
                }
            }
            this.$refs.orderInfoRef.validate((vaild)=>{
                if(vaild){
                    this.$api.LogisticsManage.operatingOrder(params).then(res=>{
                        if(res.errorCode == '100200'){
                            this.$utils.commonUtils.tip(res.msg,'success')
                        }else{
                            this.$utils.commonUtils.tip(res.msg,'error')
                        }
                        for(let item in params){
                            if(item != 'specification' && item !='expressSheetSequence' && item != 'wordSize'){
                                params[item] = JSON.stringify(params[item])
                            }
                        }
                        this.istype=true
                        this.buttonList=[
                            {
                            name:'返回',    //按钮名称
                            emitType:'cancel'    //方法
                            },{
                                name:'修改',    //按钮名称
                                type:true,    //是否为主按钮-可不传
                                emitType:'changeFn'    //方法
                            },
                        ]
                    })
                }else{
                    for(let item in params){
                        if(item != 'specification' && item !='expressSheetSequence' && item != 'wordSize'){
                            params[item] = JSON.stringify(params[item])
                        }
                    }
                }
            })
        },
        getselectInvoiceSpecification(){    //回显运输方式面单信息
            if (this.$route.query.Logistics != undefined){
                let params = {
                    page : 1,
                    row : 10,
                    id : this.$route.query.Logistics
                }
                this.istype=true
                this.buttonList=[
                    {
                    name:'返回',    //按钮名称
                    emitType:'cancel'    //方法
                    },{
                        name:'修改',    //按钮名称
                        type:true,    //是否为主按钮-可不传
                        emitType:'changeFn'    //方法
                    },
                ]
                this.$api.LogisticsManage.selectInvoiceSpecification(params).then(res=>{
                    if(res.errorCode == '100200'){
                        let resData = res.data.pageInfo.list[0]
                        if(resData.length != 0){
                            for(let item in resData){
                                if(item != 'specification' && item != 'expressSheetSequence' && item != 'wordSize'){
                                    resData[item] = JSON.stringify(resData[item])
                                }
                            }
                        }
                        this.infomationForm = resData
                    }
                })
            }
        },
        // 返回列表页
        toBack() {
            this.$router.push({path:'/LogisticsManage/LogisticsManManageDetail',query:{activeName:'second',id:this.$route.query.id}})
        },
    }
}
</script>

<style lang="scss" scoped>
.order-infomation-box{
    .information-from{
        .informationItem{
            position: relative;
            margin-bottom: 20px;
            .el-form-item{
                float: left;margin-right: 100px;margin-bottom: 0;width: 380px;
                position: relative;
                    p{position: absolute;
                        width: 300px;
                        top: 0;
                        left: 250px;
                        color: #999999 ;
                        white-space : normal nowrap ;
                        .star{color: #FF0000;margin-right: 3px;}
                    }
                }
        }
        .el-input,.el-select{width: 240px;}
    }   
    
}
</style>

