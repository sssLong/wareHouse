<template>
    <div class="tagcontainer">
          <!-- 选项卡 START -->
        <el-tabs  class="tags" v-model="$store.state.tags.tagValue"  @tab-click="handleClick" type="card"  @tab-remove="deleteTag">
            <el-tab-pane
                v-for="(item, index) in tags"
                :key="item.path"
                :label="item.meta.title"
                :name="item.path"
                :closable="index != 0"
            >
            </el-tab-pane>
        </el-tabs>
        <!-- 选项卡 END -->
        <!-- 错误提示框 -->
        <el-dialog title="提示" :visible.sync="beforeLeave" width="480px">
            <div class="fz16 pl-20 pr-20" style="text-align:center">
                卡板号：{{cardBord}}有接收但未绑定的包裹，是否确定退出，退出后包裹需重新进行绑定卡板操作！
            </div>
            <span slot="footer">
                <el-button @click="beforeLeave = false">取 消</el-button>
                <el-button type="primary" @click="sureLeave">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                beforeLeave: false,
                cardBord: '',
                target: ''
            }
        },
        watch: {
            $route(newValue, oldValue) {
                this.addTags()
            },
        },
        computed: {
            // tagValue (){
            //     return this.$store.state.tags.tagValue
            // },
            tags() {
                return this.$store.state.tags.tagsView
            }
        },
        mounted() {
            this.addTags()
        }, 
        methods: {
            // 添加标签
            addTags() {
                const { name, meta } = this.$route;
                if(name) {
                    this.$store.dispatch('addView', this.$route)
                    this.$store.commit('SET_TAGVALUE', this.$route.path)
                    //this.tagValue = this.$route.path
                }
                return false;
            },
            // 点击tab页 跳转对应路由
            handleClick(target) {
                this.$store.commit('SET_TAGVALUE', target.name)
                //this.tagValue = target.name
                this.$router.push({
                    path: this.$store.state.tags.tagValue,
                    query: this.tags[target.index].query
                })
                
            },
            // 删除选中标签
            deleteTag(target) {
                let index = this.findIndex(target)
                if (target == '/WarehousingOperation/FoundCard' && this.$store.state.cardBord != '' && this.$store.state.len != 0){
                    this.cardBord = this.$store.state.cardBord;
                    this.beforeLeave = true;
                    this.target = target;   
                    return;
                }
                if (target == '/WarehousingOperation/ScanSignIn' || target.search('/WarehousingOperation/ArrivalNDetails') != -1 || (target == '/WarehousingOperation/FoundCard' && this.$store.state.cardBord == '' && this.$store.state.len == 0)){
                    
                    this.$store.dispatch('delTagsView',target).then( newTags => {
                        this.$router.push(this.$store.state.tags.arrivalNoticeRoute);
                        this.$store.commit('SET_TAGVALUE', '/WarehousingOperation/ArrivalNotice')
                        //this.tagValue = '/WarehousingOperation/ArrivalNotice';
                    })
                    this.$store.dispatch('delCachedView',target)
                    return;
                }
                if (target == '/WarehousingOperation/ReturnCheck'){
                    this.$store.dispatch('delTagsView',target).then( newTags => {
                        this.$router.push(this.$store.state.tags.returnRoute);
                        this.$store.commit('SET_TAGVALUE', '/WarehousingOperation/ReturnReceipt')
                    })
                    this.$store.dispatch('delCachedView',target)
                    return;
                }
                this.$store.dispatch('delTagsView',target).then( newTags => {
                    index==newTags.length-1?index=index:index=index-1
                    let lastestTag = newTags[index]
                    if(lastestTag){
                        this.$router.push(lastestTag)
                        this.$store.commit('SET_TAGVALUE', lastestTag.path)
                        //this.tagValue = lastestTag.path
                    }
                })
                this.$store.dispatch('delCachedView',target)
            },
           
            // 查找索引
            findIndex(target) {
                let i ;
                this.tags.forEach( (v,index) => {
                    if(v.path == target) {
                        i = index
                    }
                })
                return i
            },
            // 判断是否是空对象
            isEmptyObject(obj){
                for(var key in obj){
                    return false
                };
                return true
            },
            sureLeave (){
                this.beforeLeave = false;
                let index = this.findIndex(this.target)
                this.$store.dispatch('delTagsView',this.target).then( newTags => {
                    this.$store.commit('GET_CARDBORD','');
                    this.$router.push(this.$store.state.tags.arrivalNoticeRoute);
                    this.$store.commit('SET_TAGVALUE', '/WarehousingOperation/ArrivalNotice')
                    //this.tagValue = '/WarehousingOperation/ArrivalNotice';
                })
                this.$store.dispatch('delCachedView',this.target)
            },
            findTag (route){
                return this.tags.find(item=>item.fullPath==route) 
            }
        }
    }
</script>

<style scoped>
    .tagcontainer{
        position: relative;
        height: 36px;
        line-height: 36px;
    }
    .tags{
        background:#fff;
        margin: 0 40px 0 0;

    }
   .tags >>> .el-tabs__item{
        height: 36px !important;
        line-height: 36px !important;
    }
   
</style>
<style>
.tagcontainer .tags .el-tabs__header {
    margin: 0px!important;
}
.tagcontainer .el-tabs--card>.el-tabs__header,
.tagcontainer .el-tabs--card>.el-tabs__header .el-tabs__item,
.tagcontainer .el-tabs--card>.el-tabs__header .el-tabs__nav {
    border: none!important;
}
.tagcontainer .el-tabs--card>.el-tabs__header .el-tabs__item ,
.tagcontainer .el-tabs--card>.el-tabs__header .el-tabs__item.is-active.is-closable{
    padding: 0 40px;
}
.tagcontainer .el-tabs--card>.el-tabs__header .el-tabs__item .el-icon-close{
    right: -30px;
}
.tagcontainer  .el-tabs--card>.el-tabs__header .el-tabs__item.is-active{
  font-size: 14px;
  color: #2A8BFF;
  font-weight: 600;
  background: rgba(25,137,250,.1);
  border-bottom: 2px solid #2A8BFF !important;
}
.tagcontainer  .el-tabs--card>.el-tabs__header .el-tabs__item.is-active .el-icon-close{
    color: #2A8BFF;
}
.tagcontainer  .el-tabs__item .el-icon-close:hover {
    color: #fff !important;
    background: #2A8BFF;
}

.tagcontainer .el-tabs__nav-next, .el-tabs__nav-prev{
    line-height: 36px !important;
}
 .tagcontainer   .el-icon-arrow-left:before{
    content: "\e6dd" ;
}
 .tagcontainer  .el-icon-arrow-right:before{
    content: "\e6dc" ;
}
.tagcontainer .el-tabs__item .el-icon-close:before {
    transform: scale(1.3);
    display: inline-block;
    position: relative;
}

</style>
