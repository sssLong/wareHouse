<template>
<div class="skuInformation_detail" :style='{height: this.height + "px"}'>
	<V-Title title="详情页"></V-Title>

	<div class="pl-20 pr-20 section-cont">
		<el-form :inline="true" :model="formData" class="demo-form-inline" label-width='150px'>
            <el-form-item label="SKU：">
                <span class="spanWith">{{formData.productSku}}</span>
            </el-form-item>
			<el-form-item label="SKU别名：">
                <span class="spanWith">{{formData.productSkuAlias}}</span>
            </el-form-item>
			<el-form-item label="产品名称：">
                <span class="spanWith">{{formData.productName}}</span>
            </el-form-item>
			<el-form-item label="客户名称：">
                <span class="spanWith">{{formData.customerName}}</span>
            </el-form-item>
			<el-form-item label="属性：">
                <span class="spanWith">{{formData.productAttribute}}</span>
            </el-form-item>
			<el-form-item label="长/宽/高(mm)：">
                <span class="spanWith">{{formData.packageLength}}/{{formData.packageWidth}}/{{formData.packageHeight}}</span>
            </el-form-item>
			<el-form-item label="体积(mm³)：">
                <span class="spanWith">{{formData.packageLength * formData.packageWidth * formData.packageHeight.toFixed(2)}}</span>
            </el-form-item>
			<el-form-item label="重量(g)：">
                <span class="spanWith">{{formData.packageWeight}}</span>
            </el-form-item>
			<el-form-item label="品牌：">
                <span class="spanWith">{{formData.productBrand}}</span>
            </el-form-item>
			<el-form-item label="物流属性：">
                <span class="spanWith">{{formData.logisticsAttribute}}</span>
            </el-form-item>
			<el-form-item label="中文报关名：">
                <span class="spanWith">{{formData.declareCustomsCn}}</span>
            </el-form-item>
			<el-form-item label="英文报关名：">
                <span class="spanWith">{{formData.declareCustomsEn}}</span>
            </el-form-item>
			<el-form-item label="海关编码：">
                <span class="spanWith">{{formData.customsCode}}</span>
            </el-form-item>
			<el-form-item label="包装材料：">
                <span class="spanWith">{{formData.packingMaterial}}</span>
            </el-form-item>
			<el-form-item label="产品单位：">
                <span class="spanWith">{{formData.productUnit}}</span>
            </el-form-item>
			<el-form-item label="所属货主：">
                <span class="spanWith">{{formData.shipperName}}</span>
            </el-form-item>
			<el-form-item label="SPU：">
                <span class="spanWith">{{formData.productSpu}}</span>
            </el-form-item>
			<el-form-item label="本地分类：">
                <span class="spanWith">{{formData.categoryName}}</span>
            </el-form-item>
            <el-form-item label="报关价格(USD)：">
                <span class="spanWith">{{formData.customsPrice}}</span>
            </el-form-item>
            <el-form-item label="商品链接：">
                <a class="spanWith"  target="_blank" :href="formData.productLink">{{formData.productLink}}</a>
            </el-form-item>
        </el-form>
	</div>
    <V-BottomBtn></V-BottomBtn>
</div>
</template>

<script>


export default {
    name: 'BasicConfiguration_SKUInfoDetail',
	data () {
		return {
            height: '',
            formData: {},
            id: ''
		}
    },
    activated() {
        this.id = this.$route.query.id
        this.getSkuInfo(this.id)
    },
    methods: {
        // 查询SKU详情
        getSkuInfo(id) {
            console.log('333333333333333333333')
            this.$api.BasicConfiguration.getSkuInfo({id:id}).then(res => {
                if(res.errorCode === '100200'){
                    console.log(res)
                    this.formData = res.data
                    // this.total = res.data.total
                }else{
                    this.$message.error(res.msg)
                }
            }).catch(error => {

            })
        },
    },
	mounted() {
		let clientHeight = document.documentElement.clientHeight
        console.log(clientHeight,'lo')
        this.height = clientHeight - 146
	}
}
</script>
