<!-- 标题组件  页面标题/弹窗标题  组件开发：高友谊 -->
<template>
<div class="ml-20 mr-20 title-cont">
	<div class="title">{{ displayTitle }}</div>
	<slot></slot>
</div>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			required: false
		}
	},
	computed: {
		displayTitle () { // 如果没有传入title，则使用meta下的title
			return this.title || this.$route.meta.title
		}
	}
}
</script>

<style lang="scss" scoped>
.title-cont {
	display: flex;
	justify-content: space-between;
	padding-top: 14px;
	padding-bottom: 14px;
	border-bottom: 1px solid #DCDFE6;
	.title {
		position: relative;
		height: 32px;
		padding-left: 20px;
		margin-left: -20px;
		line-height: 32px;
		font-size: 16px;
		color: #333;
		font-weight: bold;
		&:after {
			content: '';
			position: absolute;
			left: 0;
			top: 50%;
			margin-top: -8px;
			width: 4px;
			height: 16px;
			background-color: #2A8BFF;
		}
	}
}
</style>
