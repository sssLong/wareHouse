<template>
    <div>
        <template v-for="(item,index) in this.menuItems">
            <el-submenu :key="index" v-if="item.children!=undefined" :index="item.id+`_`+index"> 
                <template slot="title">
                    <i :class="`iconfont ${item.icon}`"></i>
                    <span slot="title">{{ item.name}}</span>
                </template>
                <menuDom :menuItems="item.children"></menuDom> 
            </el-submenu>
            <el-menu-item v-else :index="`/`+item.url"  :key="item.id">
                <i class="iconfont" :class="item.icon?item.icon:'iconwenjianguanbi'"></i>
                <span slot="title">{{ item.name}}</span>
            </el-menu-item>
        </template>
    </div>
</template>
<script>
    export default{
        name:'menuDom',//模板名称
        data(){
            return {}
        },
        beforeMount(){},
        props:['menuItems']
    }
</script>
<style lang="scss" scoped>
.el-menu.el-menu--inline .el-menu.el-menu--inline .el-menu-item i:before{content: ""}
.el-menu.el-menu--inline .el-submenu__title i:before{content: "\E61F"}
.el-menu.el-menu--inline .el-submenu.is-opened .el-submenu__title i:before,
.el-menu.el-menu--inline .el-menu-item.is-active i:before{content: "\e61d"}
</style>
