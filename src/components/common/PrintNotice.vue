<template>
    <el-dialog
        title="提示"
        :visible.sync="printAlert"
        width="480px"
        class='box-box'
        :before-close="close"
        >
        <div>
            <p>Web打印服务CLodop未安装启动，点击这里<a href='http://www.lodop.net/download/Lodop6.226_Clodop3.083.zip' target='_self' style='color:red;'>下载执行安装</a>"</p>
            <p>如果您已经下载并安装,请刷新页面</p>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="$emit('update:printAlert', false)">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
     props: {
        printAlert: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        close (){
            this.$emit('update:printAlert', false)
        }
    }
}
</script>

<style>

</style>