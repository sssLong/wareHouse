<template>
    <div class='logistics-freight'>
        <!-- <div class="platform">
            <div class="title">可发货平台</div>
            <el-checkbox-group v-model="checkedPlatform" class='select-box'>
                <el-checkbox v-for='platform in platformList' :label="platform.platformCn" :key='platform.platformCode'></el-checkbox>
            </el-checkbox-group>
        </div> -->
        <div class="area-infor">
            <div class="title">分区信息</div>
            <div class="area-btn">
                <el-button type="primary" @click='addArea'>添加分区</el-button>
                <!-- <el-button @click='areaInfor=[];showIndex=[];'>清空分区</el-button> -->
            </div>
            <div class="area-list">
                <div class="area" v-for='(item,i) in areaInfor' :key='i'>
                    <div class="area-head">
                        <div class="area-title">分区{{i+1}}</div>
                        <div class="area-made">
                            <i class="add-con iconfont iconchuangjianqiaban" @click='addCountry(i,item.zoneCountryList)' v-if='!disabled[i]'>添加目的地国家</i>
                            <i class='iconfont iconyichu' @click='removeArea(i)'>删除分区</i>
                        </div>
                    </div>
                    <div class="area-country">
                        
                        <div class="far-area" v-for='(item,k) in areaInfor[i].zoneCountryList' :key='item.country' @mousemove="!disabled[i]&&(conIndex=[i,k])" @mouseleave="conIndex=[-1,-1]" :class='[(conIndex[1]==k&&conIndex[0]==i)?"far-active":""]'>
                            <span>{{item.countryName}}</span>
                            <i class='iconfont iconguanbi' :style='{color:(conIndex[1]==k&&conIndex[0]==i)?"#fff":"#B5B9C9"}' @click='removeCountry(i,k)' v-if='!disabled[i]'></i>
                        </div>
                       
                        <!-- <el-button type="primary" v-for='(item,k) in countryList' :key='k' class='country-box'>{{item}}<i class='el-icon-delete el-icon--right'></i></el-button> -->
                    </div>
                    <div class="area-detail" v-if='showIndex[i]==2'>
                        <el-form :model="item" ref="configForm" label-width="130px" class="areaInfor" label-position='left'>
                            <!-- 基本数据  -->
                            <el-form-item label="可用物流属性" class='attr-list'>
                                <el-checkbox-group v-model="item.propSelectList" :disabled="disabled[i]">
                                    <el-checkbox v-for='(attr,j) in attrList' :label="attr.cargoName" :key='attr.id' :value='attr.id'></el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-form-item label='时效天数' required class="inlneBlock">
                                <el-form-item prop='promiseDays.min'>
                                    <el-input  :disabled="disabled[i]" v-model='item.promiseDays.min' @keyup.native='limitData' class='day-ipt'><span slot="suffix">天</span></el-input>
                                </el-form-item>
                                &nbsp;&nbsp;~&nbsp;&nbsp;
                                <el-form-item prop='promiseDays.max'>
                                    <el-input v-model='item.promiseDays.max' @keyup.native='limitData' class='day-ipt' :disabled="disabled[i]"><span slot="suffix">天</span></el-input>
                                </el-form-item>
                            </el-form-item>
                            <el-form-item label='重量范围' required class="inlneBlock">
                                <el-form-item prop='weightRange.min'>
                                    <el-input v-model='item.weightRange.min' @keyup.native='limitData' :disabled="disabled[i]" class='day-ipt'><span slot="suffix">g</span></el-input>
                                </el-form-item>
                                &nbsp;&nbsp;~&nbsp;&nbsp;
                                <el-form-item prop='weightRange.max'>
                                    <el-input v-model='item.weightRange.max' @keyup.native='limitData' :disabled="disabled[i]" class='day-ipt'><span slot="suffix">g</span></el-input>
                                </el-form-item>
                            </el-form-item>
                            <el-form-item label='长度限制' required class="inlneBlock">
                                <el-form-item prop='limitLength.length'>
                                    <el-input v-model='item.limitLength.length' @keyup.native='lenChange($event,i)' :disabled="disabled[i]" class='len-ipt'><template slot="prepend">长</template><span slot="suffix">mm</span></el-input>
                                </el-form-item>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <el-form-item prop='limitLength.wide'>
                                    <el-input v-model='item.limitLength.wide' @keyup.native='wideChange($event,i)' :disabled="disabled[i] || item.limitLength.length==0" class='len-ipt'><template slot="prepend">宽</template><span slot="suffix">mm</span></el-input>
                                </el-form-item>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <el-form-item prop='limitLength.high'>
                                    <el-input v-model='item.limitLength.high' @keyup.native='limitData' :disabled="disabled[i] || item.limitLength.wide==0" class='len-ipt'><template slot="prepend">高</template><span slot="suffix">mm</span></el-input>
                                </el-form-item>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <el-form-item prop='limitLength.threeLength'>
                                    <el-input v-model='item.limitLength.threeLength' @keyup.native='limitData' :disabled="disabled[i]" class='len-ipt'><template slot="prepend">三边和</template><span slot="suffix">mm</span></el-input>
                                </el-form-item>
                                <span class='notice'><font>*</font>长(mm)>宽(mm)>高(mm)</span>
                            </el-form-item>
                            <el-form-item label='附加费率' prop="afterCharge" class="inlneBlock" required>
                                <el-form-item prop='limitLength.afterCharge'>
                                    <el-input v-model='item.afterCharge' :disabled="disabled[i]" @keyup.native='limitData' class='b-ipt'><span slot="suffix">%</span></el-input>
                                </el-form-item>
                                <span class='notice'><font>*</font>附加费=（运费+处理费）*附加费率</span>
                            </el-form-item>
                            <el-form-item label='计抛' prop="isCountBulk" required>
                                <el-radio v-model="item.isCountBulk" :label="1" :disabled="disabled[i]">是</el-radio>
                                <el-radio v-model="item.isCountBulk" :label="2" :disabled="disabled[i]">否</el-radio>
                            </el-form-item>
                            <!-- 计抛  -->
                            <div class="jipao-box" v-if='item.isCountBulk==1'>
                                <el-form-item required class="inlneBlock">
                                    <span class='ji-title'>计抛方式</span>
                                    <el-form-item prop='countBulkRule.meterBehindWay'>
                                        <el-select v-model="item.countBulkRule.meterBehindWay" :disabled="disabled[i]" placeholder="请选择计抛方式" class='ji-kind'>
                                            <el-option label='计材积' key='0' :value='1'></el-option>
                                            <el-option label='计半抛' key='1' :value='2'></el-option>
                                            <el-option label='免3分之1抛' key='2' :value='3'></el-option>
                                            <el-option label='超过实重的30%' key='3' :value='4'></el-option>
                                        </el-select>
                                    </el-form-item>       
                                    <el-tooltip class="item" effect="dark" :content="content" placement="right">
                                        <i class='icon-why iconfont iconshuoming'></i>
                                    </el-tooltip>                     
                                    <span class='w-title qi'>起重</span>
                                    <el-form-item prop='countBulkRule.initWeight'>
                                        <el-input v-model='item.countBulkRule.initWeight' @keyup.native='limitData' :disabled="disabled[i]" class='b-ipt'><span slot="suffix" :disabled="disabled[i]">g</span></el-input>
                                    </el-form-item>
                                </el-form-item>
                                <el-form-item required class="inlneBlock">
                                    <span class='ji-title'>体积重与实重倍数</span>
                                    <el-form-item prop='countBulkRule.volumeWeightTimes'>
                                        <el-input v-model='item.countBulkRule.volumeWeightTimes' @keyup.native='limitData' :disabled="disabled[i]" class='b-ipt'></el-input>
                                    </el-form-item>
                                    <span class='w-title dan'>单边长</span>
                                    <el-form-item prop='countBulkRule.unilateralLong'>
                                        <el-input v-model='item.countBulkRule.unilateralLong' @keyup.native='limitData' :disabled="disabled[i]" class='b-ipt'><span slot="suffix">mm</span></el-input>
                                    </el-form-item>
                                </el-form-item>
                                <el-form-item prop="countBulkRule.throwDepartment" class='inlneBlock w-h'>
                                    <span class='ji-title'>计抛系数</span>
                                    <el-input v-model='item.countBulkRule.throwDepartment' @keyup.native='limitData' :disabled="disabled[i]" class='b-ipt'></el-input>
                                    <span class='notice'><font>*</font>材积(kg) = 长(mm)*宽(mm)*高(mm)/计抛系数</span>
                                </el-form-item>
                            </div>
                            <el-form-item label='计费方式' prop="chargeMode" required>
                                <el-radio v-model="item.chargeMode" :label="1" :disabled="disabled[i]">首重+续重</el-radio>
                                <el-radio v-model="item.chargeMode" :label="2" :disabled="disabled[i]">分段收费</el-radio>
                            </el-form-item>
                            <!-- 首重+续重 -->
                            <div class="jifei-box" v-if='item.chargeMode==1'>
                                <el-form-item required class="inlneBlock">
                                    <span class='ji-title'>首重</span>
                                    <el-form-item prop='ruleFirstRenew.firstWeight'>
                                        <el-input v-model='item.ruleFirstRenew.firstWeight' @keyup.native='limitData' :disabled="disabled[i]" class='b-ipt'><span slot="suffix">g</span></el-input>
                                    </el-form-item>
                                    <span class='w-title'>收取</span>
                                    <el-form-item prop='ruleFirstRenew.firstWeightCharge'>
                                        <el-input v-model='item.ruleFirstRenew.firstWeightCharge' @keyup.native='limitData' :disabled="disabled[i]" class='b-ipt'><span slot="suffix">元</span></el-input>
                                    </el-form-item>
                                </el-form-item>
                                <el-form-item required class="inlneBlock">
                                    <span class='ji-title'>续重</span>
                                    <el-form-item prop='ruleFirstRenew.renewWeight'>
                                        <el-input v-model='item.ruleFirstRenew.renewWeight' @keyup.native='limitData' :disabled="disabled[i]" class='b-ipt'><span slot="suffix">g</span></el-input>
                                    </el-form-item>
                                    <span class='w-title'>收取</span>
                                    <el-form-item prop='ruleFirstRenew.renewWeightCharge'>
                                        <el-input v-model='item.ruleFirstRenew.renewWeightCharge' @keyup.native='limitData' :disabled="disabled[i]" class='b-ipt'><span slot="suffix">元</span></el-input>
                                    </el-form-item>
                                </el-form-item>
                                <el-form-item label='' prop="ruleFirstRenew.handlingCharge">
                                    <span class='ji-title'>处理费</span>
                                    <el-input v-model='item.ruleFirstRenew.handlingCharge' @keyup.native='limitData' :disabled="disabled[i]" class='b-ipt'><span slot="suffix">元</span></el-input>
                                </el-form-item>
                                <el-form-item label='' prop="ruleFirstRenew.freightRebateType">
                                    <span class='ji-title'>折扣类型</span>
                                    <el-select v-model="item.ruleFirstRenew.freightRebateType" :disabled="disabled[i]" placeholder="请选择折扣类型" class='ji-kind'>
                                        <el-option label='全部打折' key='1' :value='1'></el-option>
                                        <el-option label='部分打折' key='2' :value='2'></el-option>
                                    </el-select>
                                    <span class='notice'><font>*</font>全部打折：“运费+处理费”打折；部分打折：“运费”打折</span>
                                </el-form-item>
                                <el-form-item label='' prop="ruleFirstRenew.freightRebate">
                                    <span class='ji-title'>折扣系数</span>
                                    <el-input v-model='item.ruleFirstRenew.freightRebate' @keyup.native='limitData' :disabled="disabled[i]" class='b-ipt'><span slot="suffix"></span></el-input>
                                    <span class='notice'><font>*</font>无折扣时请输入1；8折时,请输入0.8</span>
                                </el-form-item>
                            </div>
                            <!-- 分段 -->
                            <div class="jifei-box" v-if='item.chargeMode==2'>
                                <el-form-item label='' prop="jipaoKind">
                                    <el-button type="primary" @click='addDuan(i)' v-if='!disabled[i]'>添加分段</el-button>
                                    <el-button @click='item.ruleSubsection=[]' v-if='!disabled[i]'>清空分段</el-button>
                                </el-form-item>
                                <div class="fen-duan" v-for='(duan,x) in item.ruleSubsection' :key='x'>
                                    <el-form-item required class="inlneBlock remove-btn">
                                        <span class='ji-title'>分段{{x + 1}}</span>
                                        <el-form-item prop='beginWeight'>
                                            <el-input v-model='duan.beginWeight' @keyup.native='limitData' :disabled="disabled[i]" class='day-ipt'><span slot="suffix">g</span></el-input>
                                        </el-form-item>
                                        <span class='zhong'>﹤重量≤</span>
                                        <el-form-item prop='endWeight'>
                                            <el-input v-model='duan.endWeight' @keyup.native='limitData' :disabled="disabled[i]" class='day-ipt'><span slot="suffix">g</span></el-input>
                                        </el-form-item>
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        <el-form-item prop='segmentFeeType'>
                                            <el-select v-model="duan.segmentFeeType" :disabled="disabled[i]" placeholder="请选择分段收费方式" class='ji-kind'>
                                                <el-option label='分段内按单位重量收费' key='0' :value='0'></el-option>
                                                <el-option label='分段内首重加续重' key='1' :value='1'></el-option>
                                                <el-option label='分段内固定收费' key='2' :value='2'></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <i class='d-icon iconfont iconyichu' @click='item.ruleSubsection.splice(x,1)' v-if='!disabled[i]'>删除分段</i>
                                    </el-form-item>
                                    <el-form-item required class="inlneBlock" v-if='duan.segmentFeeType==0'>
                                        <span style='margin-left:100px'>每&nbsp;&nbsp;</span> 
                                        <el-form-item prop='perGram'>
                                            <el-input v-model='duan.yuanPerGram.perGram' @keyup.native='limitData' :disabled="disabled[i]" class='day-ipt'><span slot="suffix">g</span></el-input>
                                        </el-form-item>
                                        &nbsp;&nbsp;
                                        <span>收取</span>
                                        &nbsp;&nbsp;
                                        <el-form-item prop='yuan'>
                                            <el-input v-model='duan.yuanPerGram.yuan' @keyup.native='limitData' :disabled="disabled[i]" class='day-ipt'><span slot="suffix">元</span></el-input>
                                        </el-form-item>
                                    </el-form-item>
                                    <el-form-item required class="inlneBlock" v-if='duan.segmentFeeType==1'>
                                        <span style='margin-left:100px'>首重</span>&nbsp;&nbsp;
                                        <el-form-item prop='firstWeight'>
                                            <el-input v-model='duan.remoteFee.firstWeight' @keyup.native='limitData' :disabled="disabled[i]" class='day-ipt'><span slot="suffix">g</span></el-input>
                                        </el-form-item>
                                        <span>&nbsp;&nbsp;收取</span>&nbsp;&nbsp;
                                        <el-form-item prop='firstWeightFee'>
                                            <el-input v-model='duan.remoteFee.firstWeightFee' @keyup.native='limitData' :disabled="disabled[i]" class='day-ipt'><span slot="suffix">元</span></el-input>
                                        </el-form-item>
                                        &nbsp;&nbsp;<span>续重</span>&nbsp;&nbsp;
                                        <el-form-item prop='renewWeight'>
                                            <el-input v-model='duan.remoteFee.renewWeight' @keyup.native='limitData' :disabled="disabled[i]"  class='day-ipt'><span slot="suffix">g</span></el-input>
                                        </el-form-item>
                                        <span>&nbsp;&nbsp;收取</span>&nbsp;&nbsp;
                                        <el-form-item prop='renewWeightFee'>
                                            <el-input v-model='duan.remoteFee.renewWeightFee' @keyup.native='limitData' :disabled="disabled[i]" class='day-ipt'><span slot="suffix">元</span></el-input>
                                        </el-form-item>
                                    </el-form-item>
                                    <el-form-item prop='fixedMoney' class="inlneBlock" v-if='duan.segmentFeeType==2'>
                                        <span style='margin-left:118px'></span>
                                        <el-form-item prop='fixedCharge'>
                                           <el-input v-model='duan.fixedCharge' :disabled="disabled[i]" @keyup.native='limitData' class='day-ipt'><span slot="suffix">元</span></el-input>
                                        </el-form-item>
                                    </el-form-item>
                                    <el-form-item label='' prop="jipaoXi" class="inlneBlock">
                                        <span class='ji-title'>折扣类型</span>
                                        <el-select v-model="duan.freightRebateType" :disabled="disabled[i]" placeholder="请选择计抛方式" class='ji-kind'>
                                            <el-option label='全部打折' key='1' :value='1'></el-option>
                                            <el-option label='部分打折' key='2' :value='2'></el-option>
                                        </el-select>
                                        <span class='notice'><font>*</font>全部打折：“运费+处理费”打折；部分打折：“运费”打折</span>
                                    </el-form-item>
                                    <el-form-item label='' prop="freightRebate" class="inlneBlock">
                                        <span class='ji-title'>折扣系数</span>
                                        <el-input v-model='duan.freightRebate' @keyup.native='limitData' :disabled="disabled[i]" class='b-ipt'></el-input>
                                        <span class='notice'><font>*</font>无折扣时请输入1；8折时,请输入0.8</span>
                                    </el-form-item>
                                    <el-form-item label='' prop="handlingCharge" class='w-h inlneBlock'>
                                        <span class='ji-title'>处理费</span>
                                        <el-input v-model='duan.handlingCharge' @keyup.native='limitData' :disabled="disabled[i]" class='b-ipt'><span slot="suffix">元</span></el-input>
                                    </el-form-item>
                                </div>
                            </div>
                            <!-- 偏远费用  -->
                            <el-form-item label='是否收取偏远费' required>
                                <el-radio v-model="item.isRemoteFee" :label="1" :disabled="disabled[i]">是</el-radio>
                                <el-radio v-model="item.isRemoteFee" :label="2" :disabled="disabled[i]">否</el-radio>
                            </el-form-item>
                            <div v-if='item.isRemoteFee==1'>                                                          
                                <el-form-item label='' class='w-h'>
                                    <el-checkbox-group v-model="item.checkedCountry" class='select-box' :disabled="disabled[i]">
                                        <el-checkbox v-for='(item,m) in areaInfor[i].zoneCountryList' :label="item.countryName" :key='item.country' @change='conChange(arguments,i,m)'></el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                                <div v-for='(farCon,v) in item.zoneCountryList' :key='v'>   
                                    <template v-if='farCon.isRemoteFee==1'>
                                        <el-form-item label='' prop="jipaoKind">
                                            <span>{{farCon.countryName}}</span>
                                        </el-form-item>
                                        <el-form-item label='' prop="jipaoKind">
                                            <el-button type="primary" @click='addZonArea(i,v,farCon.countryName)' v-if='!disabled[i]'>添加分区</el-button>
                                            <el-button @click='farCon.remoteList=[]' v-if='!disabled[i]'>清空分区</el-button>
                                        </el-form-item>
                                        <div v-for='(farArea,h) in farCon.remoteList' :key='h'>
                                            <el-form-item label='' prop="jipaoKind">
                                                <div class="far-fen">
                                                    <div class="far-title">偏远区{{h+1}}</div>
                                                    <div class="far-made">
                                                        <i class="add-con iconfont iconchuangjianqiaban" @click='addFarArea(farCon.countryName,farArea.city,i,v,h)' v-if='!disabled[i]'>选择偏远地区</i>
                                                        <i class='iconfont iconyichu' @click='farCon.remoteList.splice(h,1)' v-if='!disabled[i]'>删除分区</i>
                                                    </div>
                                                </div>
                                                <div class="far-cont">
                                                    <div class="far-line1">
                                                        <div class='far-title far-title1'>偏远地区</div>
                                                        <div class="far-area-box">
                                                            <!-- <div class="far-area" v-for='(city,n) in farArea.city' :key='n' @mousemove="farAreaIndex=[i,v,h,n]" @mouseleave="farAreaIndex=[-1,-1,-1,-1]" :class='[farAreaIndex[0]==i&&farAreaIndex[1]==v&&farAreaIndex[2]==h&&farAreaIndex[3]==n?"area-active":""]'>
                                                                <span>{{city.countryName}}</span>
                                                                <i class='iconfont iconguanbi' :style='{color:farAreaIndex[0]==i&&farAreaIndex[1]==v&&farAreaIndex[2]==h&&farAreaIndex[3]==n?"#fff":"#B5B9C9"}' @click='farArea.city.splice(n,1)'></i>
                                                            </div> -->
                                                            <div class="far-area" v-if='farArea.city'>
                                                                <span>{{farArea.city}}</span>
                                                               
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="far-line2">
                                                        <el-form-item required class="inlneBlock">
                                                            <div class='far-title far-title2'>计费方式</div>
                                                            <span class='zhong'>首重</span>
                                                            <el-form-item prop='firstWeight'>
                                                                <el-input v-model='farArea.firstWeight' @keyup.native='limitData' :disabled="disabled[i]" class='f-ipt'><span slot="suffix">g</span></el-input>
                                                            </el-form-item>
                                                            <span class='zhong'>收取</span>
                                                            <el-form-item prop='firstWeightFee'>
                                                                <el-input v-model='farArea.firstWeightFee' @keyup.native='limitData' :disabled="disabled[i]" class='f-ipt'><span slot="suffix">元</span></el-input>
                                                            </el-form-item>
                                                            <span class='zhong'>续重</span>
                                                            <el-form-item prop='renewWeight'>
                                                                <el-input v-model='farArea.renewWeight' @keyup.native='limitData' :disabled="disabled[i]" class='f-ipt'><span slot="suffix">g</span></el-input>
                                                            </el-form-item>
                                                            <span class='zhong'>收取</span>
                                                            <el-form-item prop='renewWeightFee'>
                                                                <el-input v-model='farArea.renewWeightFee' @keyup.native='limitData' :disabled="disabled[i]" class='f-ipt'><span slot="suffix">元</span></el-input>
                                                            </el-form-item>
                                                        </el-form-item>
                                                    </div>
                                                </div>
                                            </el-form-item>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </el-form>
                        <div class="bt-save">
                            <el-button @click='toBack' >返回</el-button>
                            <el-button @click='edit(i)' type="primary"  v-if='disabled[i]'>修改</el-button>
                            <el-button @click='save(i)' type="primary" v-else>保存</el-button>
                        </div>
                    </div>
                    <div class="area-end" @click='showInfor(i)' v-if='showIndex[i]==1'><i class='iconfont iconxiajiantou'>&nbsp;&nbsp;显示分区信息</i></div>
                    <div class="area-end" @click='closeInfor(i)' v-else><i class='iconfont iconshangjiantou'>&nbsp;&nbsp;收起</i></div>
                </div>
            </div>
        </div>
        <el-dialog
            title="添加目的地国家"
            :visible.sync="showCountry"
            width="690px"
            class='country-box'
            :show-close='true'
            :before-close="beforeClose"
            :close-on-click-modal="false"
            >
            
            <div class='add-head'>
                <div class='add-title'>选择国家</div>
                <el-select v-model="checkedCountry" placeholder="请选择国家" class='add-s' filterable multiple value-key='country'>
                    <el-option :label='item.countryName' :key='item.country' :value='item' v-for='item in allCountryList'></el-option>
                </el-select>
            </div>
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="showCountry=false">取 消</el-button>
                <el-button type="primary" @click="sureCountry">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="添加地区"
            :visible.sync="showArea"
            width="690px"
            class='country-box'
            :show-close='true'
            :before-close="beforeCloseArea"
            :close-on-click-modal="false"
            >
            
            <div class='add-head'>
                <div class='add-title'>选择地区</div>
                <!-- <el-select v-model="checkedArea" placeholder="请选择地区" class='add-s' filterable multiple value-key='country'>
                    <el-option :label='item.countryName' :key='item.country' :value='item' v-for='item in allAreaList'></el-option>
                </el-select> -->
                <el-select v-model="checkedArea" placeholder="请选择地区" class='add-s' filterable value-key='id'>
                    <el-option :label='item.countryName' :key='item.id' :value='item' v-for='item in allAreaList'></el-option>
                </el-select>
            </div>
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="showArea=false">取 消</el-button>
                <el-button type="primary" @click="sureArea">确 定</el-button>
            </span>
        </el-dialog>
        <!-- <country-box :showCountry.sync="showCountry" @sureCountry='sureCountry' :countryList='countryList'></country-box>
        <area-box :showArea.sync="showArea"></area-box> -->
        <!-- <V-BottomBtn :buttonList="buttonList" :noBack="false" @confirm="save"></V-BottomBtn>  -->
    </div>
</template>
<script>
// import countryBox from './CountryBox'
// import areaBox from './AreaBox'
import {JSON_TYPE} from "../../../common/config"
export default {
    name: 'logisticsFreight',
    props: {
        Logistics: {
            required: true
        },
        id: {
            required: true
        },
        logisticsMethodCode: {
            required: true
        },
        logisticsMethodName: {
            required: true
        },
    },
    data (){
        return {
            type: 0,
            checkedPlatform: [],
            addConBtn: true,
            saveBtn: true,
            platformList: [],
            attrList: [],         //物流属性列表
            checkedCountry: '',  //选中国家
            checkedArea: '',    //选中地区
            countryList: [],   //当前分区国家
            allCountryList: [],   //国家列表
            allAreaList: [],    //地区列表
            areaIndex: -1,
            areaInfor: [
                
            ],
            buttonList:[
                {
                    name:'保存',    //按钮名称
                    type:true,    //是否为主按钮-可不传
                    emitType:'confirm'    //方法
                },
            ],  
            disabled: [],
            showCountry: false,  //添加国家
            showArea: false,  //添加地区
            farAreaIndex: [-1,-1,-1,-1],    //记录鼠标滑过偏远地区城市序号
            conIndex: [-1,-1],  //记录鼠标滑过哪个国家
            showIndex: [],   //记录分区序号
            flagArr: [],   //记录偏远地区的序号
            type: 0,
            methodId: '',
            idList: [],   //国家id列表
            content: '计抛方式的公式:实际重量a,体积重量b;   计半抛:(a+b)/2;  免三分之一抛:(b-a)/3*2+a;  超过实重30%的:b-a*30%'
        }
    },
    created (){
        this.type = typeof this.Logistics!='undefined'?0:1;  //0代表查看，1代表新增
        this.init();
    },
    activated (){
        if (this.$store.state.warehouse.isFreshAddL){
            this.type = typeof this.Logistics!='undefined'?0:1;
            this.areaInfor = [];
            this.disabled = [];
            if (this.type == 0){
                this.methodId = this.Logistics;
                this.getList();
            } else{
                this.methodId = this.id;
            }
            
        }
    },
    deactivated (){
        this.showCountry && (this.showCountry=false);
        this.showArea && (this.showArea=false);
    },
    methods: {
        async init (){
           
            await this.getCargoPropList();
            await this.getAllCountryList();
            if (this.type == 0){
                this.methodId = this.Logistics;
                this.getList();
            }else{
                this.methodId = this.id;
            }
        },
        async getList (){      //获取列表
            let params = {
                methodId: this.methodId,
                page: 1,
                row: 1000
            }
            let res = await this.$api.LogisticsManage.basemethodIdList(params);
            let areaInforList = res.data.pageInfo.list;
            this.areaInfor = areaInforList;
            this.disabled = new Array(this.areaInfor.length).fill(true);
            this.showIndex = new Array(this.areaInfor.length).fill(1);
        },
        toBack() {
            this.$router.push({path:'/LogisticsManage/LogisticsManManageDetail',query:{activeName:'second',id:this.$route.query.id}})
        },
        showInfor (i){
            if (typeof this.areaInfor[i].id == 'number'){
                this.changeInfor(i,1)
            } else{
                this.showIndex.fill(1);
                this.$set(this.showIndex,i,2);
            }
        },
        closeInfor (i){
            this.$set(this.showIndex,i,1);
        },
        // async getPlathformList (){    //获取平台列表
        //     let params = {
        //         page: 1,
        //         row: 1000
        //     }
        //     let res = await this.$api.Warehousing.getplathformList(params);
        //     this.platformList = res.data.pageInfo.list;
        // },
        async getAllCountryList (){    //获取国家列表
            let params = {
               id: ''
            }
            let res = await this.$api.LogisticsManage.getAllCountry(params);
            
            res.data.forEach(item=>{
                this.idList.push(item.id);
                this.allCountryList.push({
                    country: item.country,
                    countryName: item.countryName
                })
            })
        },
        async getAllAreaList (countryCode,areaList){    //获取地区列表
            let params = {
               id: countryCode
            }
            let res = await this.$api.LogisticsManage.getAllCountry(params);
            this.allAreaList = res.data;
            this.checkedArea = res.data.find(item=>item.countryName==areaList);           //已选择的城市
        },
        async getCargoPropList (){    //可发物流属性列表
            let params = {
                page: 1,
                row: 1000
            }
            let res = await this.$api.LogisticsManage.getCargoPropList(params);
            this.attrList = res.data.pageInfo.list;
        },
        async removeArea (i){
            if (typeof this.areaInfor[i].id == 'number'){
                let params = this.areaInfor[i].id
                this.$api.LogisticsManage.remArea(params,JSON_TYPE).then(res=>{
                    if (res.errorCode == '100200'){
                        this.areaInfor.splice(i,1);
                        this.showIndex.splice(i,1);
                        this.disabled.splice(i,1);
                    }
                });
            } else{
                this.areaInfor.splice(i,1);
                this.showIndex.splice(i,1);
                this.disabled.splice(i,1);
            }   
        },
        addDuan (i){   //添加分段
            let len = this.areaInfor[i].ruleSubsection.length + 1;
            this.areaInfor[i].ruleSubsection.push({
                "beginWeight": '',     //起重
                "endWeight": '',       //尾重
                "fixedCharge": '',      // 固定费用
                "freightRebate": '',    //折扣系数
                "freightRebateType": 1,  //折扣类型
                "handlingCharge": '',   //处理费   
                "remoteFee": {      //分段内按单位重量收费
                    "firstWeight": '',
                    "firstWeightFee": '',
                    "renewWeight": '',
                    "renewWeightFee": ''
                },
                "sectionNumber": len,    //分段序号
                "segmentFeeType": 0,    //分段收费类型
                "yuanPerGram": {      //分段内按单位重量收费
                    "perGram": '',   
                    "yuan": ''
                }
            })
        },
        addArea (){    //添加分区
            let areaInfor = {
                supportCargoList:[],  //禁用物流属性列表
                propSelectList: [],  //已选择物流属性
                zoneCountryList: [],
                checkedCountry: [],
                afterCharge : '',  //附加费率
                promiseDays: { //时效
                    
                    min: '',
                    max: ''
                },
                weightRange: {  //重量范围
                    
                    min: '',
                    max: '',
                },
                limitLength: {   //长度限制
                    "high": '',
                    "length": '',
                    "threeLength": '',
                    "wide": ''
                },
                isCountBulk: 1,  //是否计抛
                countBulkRule: {
                    "initWeight": '',  //起重
                    "meterBehindWay": 1,   //计抛方式
                    "throwDepartment": '',   //计抛系数
                    "unilateralLong": '',   //单边长
                    "volumeWeightTimes": ''   //材积与实重倍数
                },
                chargeMode: 1,  //计费方式 
                ruleFirstRenew: {     //首重+续重计费方式
                    "firstWeight": '',
                    "firstWeightCharge": '',
                    "freightRebate": '',
                    "freightRebateType": 1,
                    "handlingCharge": '',
                    "meterBehindWay": '',
                    "renewWeight": '',
                    "renewWeightCharge": '',
                    "ruleFirstRenew": ''  //折扣系数
                },
                ruleSubsection: [],
                isRemoteFee : 2,  //是否收取偏远费用
            };
            this.areaInfor.push(areaInfor);
            this.showIndex.push(1);
            this.disabled.push(false);
        },
        lenChange (e,i){   //长度改变
            e.target.value = e.target.value.replace(/\s/g,'')
            if (e.target.value == 0){
                this.areaInfor[i].limitLength.wide = 0;
                this.areaInfor[i].limitLength.high = 0;
            }
        },
        wideChange (e,i){  //宽改变
            e.target.value = e.target.value.replace(/\s/g,'')
            if (e.target.value == 0){
                this.areaInfor[i].limitLength.high = 0;
            }
        },
        addCountry (i,countryList){      //添加国家
            
            this.showCountry = true;
            this.checkedCountry = [];
            this.areaIndex = i; 
        },
        async sureCountry (){    
            if (!this.addConBtn)return;
            let countryList = []
            let checkedCountry = this.checkedCountry;
            if (!checkedCountry.length){         //没有选择国家
                this.$utils.commonUtils.tip(`请先选择国家`,'error');
                return;
            }
            let areaInfor = this.areaInfor[this.areaIndex];
            let arr = [];
            checkedCountry.forEach(item=>{
                countryList.push(item.country)
                
                let flag = areaInfor.zoneCountryList.find(list=>list.country==item.country);
                if (flag){
                    arr.push(flag)
                }
            })
            if (arr.length){
                console.log(this.addConBtn,'longyuan')
                this.$utils.commonUtils.tip(`${arr[0].countryName}已存在于该分区`,'error');
                return;
            }
            let params = {
                methodId: this.$parent.methodId,
                countryList: countryList.toString()
            }
            this.addConBtn = false;
            let res = await this.$api.LogisticsManage.addCountryBefore(params);
            this.addConBtn = true;
            if (res.data.length){
                this.$utils.commonUtils.tip(`${res.data[0].countryName}已存在于其它分区`,'error');
            } else{
                this.changeFarCountry();
                this.showCountry = false;
            }
        },
        changeFarCountry (){      //选择国家之后对应偏远地区国家也发生改变
            let checkedCountry = this.checkedCountry;
            checkedCountry.forEach(item=>{
                this.areaInfor[this.areaIndex].zoneCountryList.push({
                    countryName: item.countryName,
                    country: item.country,
                    isRemoteFee: 0,
                    remoteList: []
                })
            })
        },
        async removeCountry (i,k){
            let params = this.areaInfor[i].zoneCountryList[k].id;
            if (typeof params == 'number'){
                this.$api.LogisticsManage.remCountryBefore(params,JSON_TYPE).then(res=>{
                    if (res.errorCode == '100200'){
                        if (this.areaInfor[i].zoneCountryList.length == 1){   //如果是最后一个国家,则删除分区id
                            this.areaInfor[i].id = null;
                        }
                        let checkedCountry = this.areaInfor[i].checkedCountry.filter(item=>item!=this.areaInfor[i].zoneCountryList[k].countryName);
                        this.areaInfor[i].checkedCountry = checkedCountry;
                        this.areaInfor[i].zoneCountryList.splice(k,1);
                    }
                });
            } else{
                let checkedCountry = this.areaInfor[i].checkedCountry.filter(item=>item!=this.areaInfor[i].zoneCountryList[k].countryName);
                this.areaInfor[i].checkedCountry = checkedCountry;
                this.areaInfor[i].zoneCountryList.splice(k,1);
            } 
        },
        addZonArea(i,v,countryName){
            this.areaInfor[i].zoneCountryList[v].remoteList.push({
                "city": "",
                "country": countryName,
                "firstWeight": "",
                "firstWeightFee": "",
                "renewWeight": "",
                "renewWeightFee": ""
            })
        },
        addFarArea (countryName,areaList,i,v,h){     //添加地区
            let n;
            for (let i = 0; i < this.allCountryList.length; i ++){
                if (this.allCountryList[i].countryName == countryName){
                    n = i;
                }
            }
            let country = this.idList[n];
            this.getAllAreaList(country,areaList);
            this.flagArr = [i,v,h];
            this.showArea = true;
        },  
        sureArea (){
            if (!this.checkedArea){
                this.$utils.commonUtils.tip('您还没选择任何城市','error');
                return
            }
            let flagArr = this.flagArr;
            let farCon = this.areaInfor[flagArr[0]].zoneCountryList[flagArr[1]]
            farCon.remoteList[flagArr[2]].city = this.checkedArea.countryName;
            this.showArea = false;
        },
        beforeClose (){
            this.showCountry = false;
        },
        beforeCloseArea (){
            this.showArea = false;
        },
        conChange (data,i,m){
            let areaInfor = this.areaInfor[i];
            let checkedCountry = areaInfor.checkedCountry;
            let value = data[1].target.value;
            if (data[0]){         //添加该国家的偏远分区
                areaInfor.zoneCountryList[m].isRemoteFee = 1
            } else{
                areaInfor.zoneCountryList[m].isRemoteFee = 0
            }
        },
        edit (i){
            this.changeInfor(i)
        },
        changeInfor (i,type){
            let params = {
                zoneId:this.areaInfor[i].id
            }
            this.$api.LogisticsManage.basemethodId(params).then(res=>{
                if (res.errorCode == '100200'){
                    let data = res.data;
                    let supportCargoList = data.supportCargoList;
                    let attrList = [];
                    if (!data.countBulkRule){
                        data.countBulkRule = {
                            "initWeight": '',  //起重
                            "meterBehindWay": 1,   //计抛方式
                            "throwDepartment": '',   //计抛系数
                            "unilateralLong": '',   //单边长
                            "volumeWeightTimes": ''   //材积与实重倍数
                        }
                    }
                    if (!data.ruleFirstRenew){
                        data.ruleFirstRenew = {
                            "firstWeight": '',
                            "firstWeightCharge": '',
                            "freightRebate": '',
                            "freightRebateType": 1,
                            "handlingCharge": '',
                            "meterBehindWay": '',
                            "renewWeight": '',
                            "renewWeightCharge": '',
                            "ruleFirstRenew": ''  //折扣系数
                        }
                    }
                    if (!data.ruleSubsection){
                        data.ruleSubsection = [];
                    }
                    supportCargoList.forEach(val=>{
                        // let attr = this.attrList.find(attr=>attr.cargoCode==val.cargoCode);
                        // if (attr){
                        //     attrList.push(attr.cargoName);
                        // }
                        if (val.isValid == 1){
                            attrList.push(val.cargoName);
                        }
                        //attrList.push(this.attrList.find(attr=>attr.cargoCode==val.cargoCode).cargoName)
                    })
                    data.propSelectList = attrList;
                    let checkedCountry = [];
                    data.zoneCountryList.forEach(val=>{
                        if (val.isRemoteFee == 1){
                            checkedCountry.push(val.countryName)
                        }
                    })
                    data.checkedCountry = checkedCountry;
                   
                    data.afterCharge = this.$utils.commonUtils.numMulti(data.afterCharge,100);
                    
                    this.areaInfor.splice(i,1,data);
                    if (type){
                        this.showIndex.fill(1);
                        this.$set(this.showIndex,i,2);
                    } else{
                        this.disabled.splice(i,1,false)
                    }
                }
            });   
        },
        async save (i){
            if (!this.saveBtn)return;
            let data = this.areaInfor[i];
            let _data = JSON.parse(JSON.stringify(data));
            //提交前的判断
             if (!_data.propSelectList.length){
                this.$utils.commonUtils.tip('你还没选择可用物流属性','error')
                return;
            }
            if (!_data.zoneCountryList.length){
                this.$utils.commonUtils.tip('你还没选择任何国家','error');
                return;
            }
            if (!this.judeNumber(_data.promiseDays.min,-3,'时效天数'))return;
            if (!this.judeNumber(_data.promiseDays.max,-3,'时效天数'))return;
            if (+_data.promiseDays.max > 50){
                this.$utils.commonUtils.tip('时效结尾天数不能大于50','error')
                return;
            }
            if (+_data.promiseDays.min >= +_data.promiseDays.max){
                this.$utils.commonUtils.tip('时效结尾天数应该大于时效开始天数','error')
                return;
            }
            if (!this.judeNumber(_data.weightRange.min,-3,'重量范围'))return;
            if (!this.judeNumber(_data.weightRange.max,-3,'重量范围'))return;
            if (+_data.weightRange.min >= +_data.weightRange.max){
                this.$utils.commonUtils.tip('重量范围结束值就该大于重量范围起始值','error')
                return;
            }
            if (!this.judeNumber(_data.limitLength.length,-3,'长度'))return;
            if (!this.judeNumber(_data.limitLength.wide,-3,'宽度'))return;
            if (!this.judeNumber(_data.limitLength.high,-3,'高度'))return;
            if (!this.judeNumber(_data.limitLength.threeLength,-3,'三边长'))return;
            if (!this.judeNumber(_data.afterCharge ,-5,'附加费率'))return;
            let limitVO = _data.limitLength
            if (+limitVO.length < +limitVO.wide || +limitVO.wide < +limitVO.high){
                this.$utils.commonUtils.tip('必须遵守长>=宽>=高的规则','error')
                return;
            }
            if (_data.isCountBulk==1){   //如果计抛
                if (String(_data.countBulkRule.initWeight) == '' && String(_data.countBulkRule.volumeWeightTimes) == '' && String(_data.countBulkRule.unilateralLong) == ''){
                    this.$utils.commonUtils.tip('计抛初始重量,材积与实重倍数,单边长至少填一项','error');
                    return;
                }
                if (_data.countBulkRule.initWeight != ''){
                    if (!this.judeNumber(_data.countBulkRule.initWeight,-3,'计抛初始重量',10,1))return;
                }
                if (_data.countBulkRule.volumeWeightTimes != ''){
                    if (!this.judeNumber(_data.countBulkRule.volumeWeightTimes,-6,'材积与实重倍数',1))return;
                }
                if (_data.countBulkRule.unilateralLong != ''){
                    if (!this.judeNumber(_data.countBulkRule.unilateralLong ,-3,'单边长',1))return;
                }
                if (!this.judeNumber(_data.countBulkRule.throwDepartment,0,'计抛系数'))return;
            }
            if (_data.chargeMode == 1){   //首重加续重
                if (!this.judeNumber(_data.ruleFirstRenew.firstWeight,0,'首重'))return;
                if (!this.judeNumber(_data.ruleFirstRenew.firstWeightCharge,3,'首重收取费用'))return;
                if (!this.judeNumber(_data.ruleFirstRenew.renewWeight,0,'续重'))return;
                if (!this.judeNumber(_data.ruleFirstRenew.renewWeightCharge ,3,'续重收取费用'))return;
                if (!this.judeNumber(_data.ruleFirstRenew.handlingCharge,-2,'处理费用'))return;
                if (!this.judeNumber(_data.ruleFirstRenew.freightRebate,99,'折扣系数'))return;
            } else{
                if (!_data.ruleSubsection.length){
                    this.$utils.commonUtils.tip('你还没添加任何分段','error');
                    return;
                }
                for (let j = 0; j < _data.ruleSubsection.length; j ++){
                    let ruleSub = _data.ruleSubsection[j];
                    if (!this.judeNumber(ruleSub.beginWeight ,-3,`分段${j+1}初始重量`))return;
                    if (!this.judeNumber(ruleSub.endWeight ,0,`分段${j+1}结束重量`))return;
                    if (+ruleSub.endWeight <= +ruleSub.beginWeight){
                        this.$utils.commonUtils.tip(`分段${j+1}的结束重量应该大于起始重量`,'error');
                        return;
                    }
                    if (j==0 && ruleSub.beginWeight != _data.weightRange.min){
                        this.$utils.commonUtils.tip(`分段1的起始重量应该等于重量范围的初始值`,'error');
                        return;
                    }
                    if (j == _data.ruleSubsection.length-1 && ruleSub.endWeight != _data.weightRange.max){
                        this.$utils.commonUtils.tip(`分段${_data.ruleSubsection.length}的结束重量应该等于重量范围的结束值`,'error');
                        return;
                    }
                    if (j != 0){
                        if (ruleSub.beginWeight!=_data.ruleSubsection[j-1].endWeight){
                            this.$utils.commonUtils.tip(`分段${j+1}的起始重量应该等于分段${j}结束重量`,'error');
                            return;
                        }
                    }
                    if (ruleSub.segmentFeeType == 0){
                        if (!this.judeNumber(ruleSub.yuanPerGram.perGram ,0,`分段${j+1}单位重量`))return;
                        if (!this.judeNumber(ruleSub.yuanPerGram.yuan ,3,`分段${j+1}单位重量收费`))return;
                    } else if (ruleSub.segmentFeeType == 1){
                        if (!this.judeNumber(ruleSub.remoteFee.firstWeight ,0,`分段${j+1}首重`))return;
                        if (!this.judeNumber(ruleSub.remoteFee.firstWeightFee ,3,`分段${j+1}重量费用`))return;
                        if (!this.judeNumber(ruleSub.remoteFee.renewWeight ,0,`分段${j+1}续重`))return;
                        if (!this.judeNumber(ruleSub.remoteFee.renewWeightFee ,3,`分段${j+1}续量费用`))return;
                    } else{
                        if (!this.judeNumber(ruleSub.fixedCharge ,3,`分段${j+1}固定费用`))return;
                    }
                    if (!this.judeNumber(ruleSub.freightRebate ,99,`分段${j+1}折扣系数`))return;
                    if (!this.judeNumber(ruleSub.handlingCharge ,-2,`分段${j+1}处理费`))return;
                }
            }
            if (_data.isRemoteFee == 1){
                let isRemoteFeeCoun = 0
                for (let j = 0; j < _data.zoneCountryList.length; j ++){
                    let zoneCountry = _data.zoneCountryList[j];
                    let countryName = zoneCountry.countryName;
                    if (zoneCountry.isRemoteFee == 1){
                        isRemoteFeeCoun ++;
                        if (!zoneCountry.remoteList.length){
                            this.$utils.commonUtils.tip(`${countryName}还没添加偏远区`,'error')
                            return;
                        }
                        for (let k = 0; k < zoneCountry.remoteList.length; k ++){
                            let remote = zoneCountry.remoteList[k];
                            if (!remote.city){
                                this.$utils.commonUtils.tip(`${countryName}偏远区${k+1}还没选择偏远地区`,'error')
                                return;
                            }
                            if (!this.judeNumber(remote.firstWeight ,0,`${countryName}偏远区${k+1}首重`))return;
                            if (!this.judeNumber(remote.firstWeightFee ,3,`${countryName}偏远区${k+1}首重费用`))return;
                            if (!this.judeNumber(remote.renewWeight ,0,`${countryName}偏远区${k+1}续重`))return;
                            if (!this.judeNumber(remote.renewWeightFee ,3,`${countryName}偏远区${k+1}续重费用`))return;
                        }
                    }
                }
                if (!isRemoteFeeCoun){
                    this.$utils.commonUtils.tip('你还没选择收取偏远费用的国家','error')
                    return;
                }
            }
            _data.afterCharge = this.$utils.commonUtils.numMulti(+_data.afterCharge,0.01);
            
            if (_data.isRemoteFee != 1){
                let zoneCountryList = [];
                _data.zoneCountryList.forEach((item,i)=>{
                    let zoneCountry = item;
                    zoneCountry.isRemoteFee = 2;
                    zoneCountry.remoteList = [];
                    zoneCountryList.push(zoneCountry)
                })
                _data.zoneCountryList = zoneCountryList;
            }
            let areaInfor = null;
            let supportCargoList = [];
            let isEdit = typeof data.id === "number";
            let list = isEdit?data.supportCargoList:this.attrList
            list.forEach(item=>{
                let flag = false;
                for (let j = 0; j < data.propSelectList.length; j ++){
                    let cargo = data.propSelectList[j];
                    if (cargo == item.cargoName){
                        flag = true;
                    }
                }
                supportCargoList.push({
                    cargoPropId: isEdit?item.cargoPropId:item.id,
                    isValid: flag?1:2,
                })
            })
            _data.supportCargoList = supportCargoList;
            delete _data.checkedCountry;
            delete _data.propSelectList;
            // for (let j = 0; j < data.zoneCountryList.length; j ++){
            //     let zoneCountry = data.zoneCountryList[j];
            //     let countryName = zoneCountry.countryName;
            //     let list = [];
                
            //     for (let k = 0; k < zoneCountry.remoteList.length; k ++){
            //         let remote = zoneCountry.remoteList[k];                       
            //         for (let h = 0; h < remote.city.length; h ++){
            //             let city = remote.city[h];
            //             list.push({                               
            //                 "city": city.countryName,
            //                 "country": countryName,
            //                 "firstWeight": remote.firstWeight,
            //                 "firstWeightFee": remote.firstWeightFee,
            //                 "renewWeight": remote.renewWeight,
            //                 "renewWeightFee": remote.renewWeightFee                            
            //             })
            //         }
            //     }
            //     _data.zoneCountryList[j].remoteList = list;
            // }
            _data.logisticsMethodCode = this.logisticsMethodCode;
            _data.logisticsMethodName = this.logisticsMethodName;
           
            _data.methodId = this.$parent.methodId;
            areaInfor = _data;
            this.saveBtn = false;
            let params = areaInfor;
            this.$api.LogisticsManage.addShiXiaoData(params).then(res=>{
                this.saveBtn = true;
                if (res.errorCode == '100200'){
                    this.$utils.commonUtils.tip(`${typeof areaInfor.id=="undefined"?"添加成功":"修改成功"}`,'success')
                    this.$set(this.areaInfor[i],'id',res.data);
                    this.disabled.splice(i,1,true);
                }
            });
        },
        judeNumber (val,len,str,jude){
            let flag = true;
            val = (val + '').replace(/\s/g,'');
            if (val.trim() == ''&& !jude){
                this.$utils.commonUtils.tip(`${str}不能为空`,'error')
                return false;
            }
            if (len == -1){     //0
                flag = /^0$/.test(val);
                if (!flag){
                    this.$utils.commonUtils.tip(`${str}只能为0`,'error')
                    return false;
                }
            } 
            if (len == -2){   //整数或最多带3位小数的数字
                flag = /(^[1-9][0-9]*([.][0-9]{1,3})?$)|(^0[.][1-9]{1,3}$)|(^0$)/.test(val);
                if (!flag){
                    this.$utils.commonUtils.tip(`${str}只能是整数或最多带3位小数的数字`,'error')
                    return false;
                }
            }
            if (len == -3){   //整数
                flag = /(^[1-9][0-9]*$)|(^0$)/.test(val);
                if (!flag){
                    this.$utils.commonUtils.tip(`${str}只能是整数`,'error')
                    return false;
                }
            }
            if (len == -4){   //整数或最多带1位小数的数字
                flag = /(^[1-9][0-9]*([.][0-9]{1})?$)|(^0$)/.test(val);
                if (!flag){
                    this.$utils.commonUtils.tip(`${str}只能是整数或最多带1位小数的数字`,'error')
                    return false;
                }
            }
            if (len == -5){   //小于100的整数
                flag = /(^[1-9][0-9]{0,1}$)|(^0$)|(^100$)/.test(val);
                if (!flag){
                    this.$utils.commonUtils.tip(`${str}只能是小于或等于100的整数`,'error')
                    return false;
                }
            }
            if (len == -6){   //大于1且最多带1位小数的数字
                flag = /(^[1-9][0-9]*([.][0-9]{1})?$)/.test(val);
                if (!flag){
                    this.$utils.commonUtils.tip(`${str}只能是大于1且最多带1位小数的数字`,'error')
                    return false;
                }
            }
            if (len == 0){   //不为0的整数
                flag = /^[1-9][0-9]*$/.test(val);
                if (!flag){
                    this.$utils.commonUtils.tip(`${str}只能是不为0的整数`,'error')
                    return false;
                }
            }
            if (len == 1){   //不为0的整数或最多带1位小数的数字
                flag = /(^[1-9][0-9]*([.][0-9]{1})?$)|(^0[.][1-9]{1}$)/.test(val);
                if (!flag){
                    this.$utils.commonUtils.tip(`${str}只能是不为0的整数或最多带1位小数的数字`,'error')
                    return false;
                }
            }
            if (len == 2){   //不为0的整数或最多带2位小数的数字
                flag = /(^[1-9][0-9]*([.][0-9]{1,2})?$)|(^0[.][1-9]{1,2}$)/.test(val)
                if (!flag){
                    this.$utils.commonUtils.tip(`${str}只能是不为0的整数或最多带2位小数的数字`,'error')
                    return false;
                }
            } 
            if (len == 3){   //不为0的整数或最多带3位小数的数字
                flag = /(^[1-9][0-9]*([.][0-9]{1,3})?$)|(^0[.][1-9]{1,3}$)/.test(val)
                if (!flag){
                    this.$utils.commonUtils.tip(`${str}只能是不为0的整数或最多带3位小数的数字`,'error')
                    return false;
                }
            }
            if (len == 99){  //小于1且最多带3位小数的数字
                flag = /(^[0][.][0-9]{1,3}$)|(^1$)/.test(val);
                if (!flag){
                    this.$utils.commonUtils.tip(`${str}只能是小于或等于1且最多带3位小数的数字`,'error')
                    return false;
                }
            }
            return true
        },
        limitData (e){
            e.target.value = e.target.value.replace(/\s/g,'')
        },
        addArr (arr){     //数组分组
            let val = [];
            arr.forEach(i=>{
                let flag = false;
                let k = 0;
                val.forEach((n,m)=>{
                    for (let j = 0; j < n.length; j ++){
                        if (i == n[j]){
                            flag = true
                            k = m;
                        }
                    }
                })
                if (flag){
                    val[k].push(i)
                } else{
                    val.push([i])
                }
            })
            return val
        }
    },
    components: {
        // countryBox,
        // areaBox
    }
}
</script>

