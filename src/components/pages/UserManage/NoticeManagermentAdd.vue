<!--  -->
<template>
  <div class="WarehouseInside">
    <div class="NoticeManagerment">
        <V-Title :title="titles"></V-Title>
        <el-form :model="form" ref="form" label-width="80px" class="p-20" style="max-width:650px;">
            <el-form-item label="公告标题">
                <el-input v-model="form.title" maxlength="50" :disabled="disabState"></el-input>
            </el-form-item>
            <el-form-item label="公告正文">
                <V-Editor
                 :content="form.content" 
                 @on-change="changeValue"
                 :disabledEdit="disabState"></V-Editor>
            </el-form-item>
        </el-form>
        
        <V-BottomBtn v-if="disab===2" routerTO="/UserManage/NoticeManagerment" @confirm="confirmIssue"></V-BottomBtn> 
        <V-BottomBtn v-else routerTO="/UserManage/NoticeManagerment" :buttonList="buttonList" @confirm="confirmIssue"></V-BottomBtn> 
    </div>
</div>
</template>

<script>
export default {
  name: "UserManage_NoticeManagermentAdd",
  data () {
    return {
        form:{
            title:"",//标题
            content:""//内容
        },
        content:"",
        
        disab:null,
        id:"",
        titles:"",
        disabState:false,
        buttonList:[
            {
                name:'发布',    //按钮名称
                type:true,    //是否为主按钮-可不传
                emitType:'confirm',    //方法
                disabState:false //禁用状态 -可不传
            },
        ]
    };
  },

  methods: {
    //   接收富文本的值，实时
      changeValue(val){
          this.content = val //用值暂存，实时更新会导致重复创建富文本，会卡顿
          //暂存值必须清除缓存，否则会把暂存的值赋值到别的公告去
      },
    //   发布或者修改接口
      confirmIssue(){
          const that = this
          if(that.content){//必须改变时触发changeValue事件再赋值，否则刷新就会变成空值
            that.form.content = that.content //提交时再接收 富文本的值
          }
          if(that.disab===2){//查看时
            that.$router.push({path: '/UserManage/NoticeManagermentEdit',
            query: { id: this.id, state: 3 }})
          }else{
              if(!that.form.title||!that.form.content){
                  that.$message.error('标题与内容不能为空！')
                  return
              }
              that.buttonList[0].disabState = true //按钮禁用
              if(that.disab===1){//新添时
                that.$api.UserManage.addMessage(that.form).then((res) => {
                    if(res.errorCode==='100200'){
                        that.$message.success('公告发布成功！')
                        that.toNM() 
                    }
                    that.buttonList[0].disabState = false //按钮解禁
                }).catch((err) => {
                    that.buttonList[0].disabState = false //按钮解禁
                });
              }else if(that.disab===3){//修改时
                let params = {
                    title: that.form.title,
                    content: that.form.content,
                    id: that.id
                }
                that.$api.UserManage.putMessage(params).then((res) => {
                    if(res.errorCode==='100200'){
                        that.$message.success('公告发布成功！')
                        that.toNM()
                    }
                    that.buttonList[0].disabState = false //按钮解禁
                }).catch((err) => {
                    that.buttonList[0].disabState = false //按钮解禁
                });
              }
          }
      },
    //   判断状态
      stateIf(){
          const that = this
          that.disab = Number(this.$route.query.state)
          that.content = "" //清除暂存值
          if(that.disab===1){//新添时
            this.titles = "新添公告"
            Object.assign(this.form, this.$options.data().form) //新增时重置数据
          }else{
            this.id = this.$route.query.id
            this.getMessageDetail()
            
            if(that.disab===2){//查看时
                this.disabState = true
                this.titles = "公告详情页"
            }else if(that.disab===3){//修改时
                this.disabState = false
                this.titles = "修改公告"
            }
          }  
      },
    //   查询公告详情
      getMessageDetail(){
          const that = this
          that.$api.UserManage.getMessageDetail(that.id).then((res) => {
            that.form.title = res.data.title
            that.form.content = res.data.content
          }).catch((err) => {console.log(err)});
      },
    
    toNM(){
        this.$router.push({path: '/UserManage/NoticeManagerment'})
    }
  },
  activated(){
      this.stateIf()
  },
  created(){},

}

</script>