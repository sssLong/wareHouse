<template>
<div class="supplier-detail" :style='{height: this.height + "px"}'>
    <V-Title title="详情页"></V-Title>
	<div class="pl-20 pr-20 section-cont">
		<el-form :inline="true" class="demo-form-inline" label-width='150px'>
            <el-form-item label="供应商名称：" >
                <span class="spanWith">{{formData.supplierName}}</span>
            </el-form-item>
			<el-form-item label="供应商等级：">
				<span class="spanWith">{{formData.supplierLevel}}</span>
            </el-form-item>
			<el-form-item label="采购员：">
				<span class="spanWith">{{formData.buyer}}</span>
            </el-form-item>
			<el-form-item label="供应链专员：">
				<span class="spanWith">{{formData.supplyChainCoordinator}}</span>
            </el-form-item>
			<el-form-item label="联系人1：">
				<span class="spanWith">{{formData.contactsFirst}}</span>
            </el-form-item>
			<el-form-item label="职务：">
				<span class="spanWith">{{formData.contactsFirstDuties}}</span>
            </el-form-item>
			<el-form-item label="联系电话：">
				<span class="spanWith">{{formData.contactsFirstPhone}}</span>
            </el-form-item>
			<el-form-item label="交货期限：">
				<span class="spanWith">{{formData.deliveryDeadline}}</span>
            </el-form-item>
			<el-form-item label="联系人2：">
				<span class="spanWith">{{formData.contactsSecond}}</span>
            </el-form-item>
			<el-form-item label="职务：">
				<span class="spanWith">{{formData.contactsSecondDuties}}</span>
            </el-form-item>
			<el-form-item label="联系电话：">
				<span class="spanWith">{{formData.contactsSecondPhone}}</span>
            </el-form-item>
			<el-form-item label="是否能退货：">
				<span class="spanWith">{{formData.couldReturnPurchase == 1 ? '是' : '否'}}</span>
            </el-form-item>
			<el-form-item label="省份：" prop="user">
				<span class="spanWith">{{formData.province}}</span>
            </el-form-item>
			<el-form-item label="城市：">
				<span class="spanWith">{{formData.city}}</span>
            </el-form-item>
			<el-form-item label="区/县：">
				<span class="spanWith">{{formData.county}}</span>
            </el-form-item>
			<el-form-item label="是否贴签、套袋：">
				<span class="spanWith">{{formData.attachLabel == 1 ? '是' : '否'}}</span>
            </el-form-item>
			<el-form-item label="详细地址：">
				<span class="spanWith">{{formData.address}}</span>
            </el-form-item>
			<el-form-item label="所属货主：">
				<span class="spanWith">{{formData.ownerOfCargo}}</span>
            </el-form-item>
		</el-form>
	</div>
    <V-BottomBtn routerTO="/BasicConfiguration/SupplierInfo"></V-BottomBtn>
</div>
</template>

<script>

export default {
	name: 'BasicConfiguration_SupplierInfoDetail',
	data () {
		return {
			height: '',
			formData: [],
		}
	},
	activated() {
        this.id = this.$route.query.id
        this.getSupplierInfo(this.id)
    },
	methods: {
        // 查询SKU详情
        getSupplierInfo(id) {
            console.log('333333333333333333333')
            this.$api.BasicConfiguration.getSupplierInfo({id:id}).then(res => {
                if(res.errorCode === '100200'){
					console.log(res)
					this.formData = res.data
                    // this.tableData = res.data.list
                    // this.total = res.data.total
                }else{
                    this.$message.error(res.msg)
                }
            }).catch(error => {

            });
        },
	},
    mounted (){
        let clientHeight = document.documentElement.clientHeight
        this.height = clientHeight - 146
    },
	components: {
		
	}
}
</script>
