<template>
    <div :style='{height: height + "px"}' class="tactics-config">
        <V-Title title="上架策略配置"></V-Title>
        <div class="con-head">
            <div class="h-item">
                <span class="lable">策略名称:</span>
                <span class="value">名称1</span>
            </div>
            <div class="h-item">
                <span class="lable">策略规则:</span>
                <span class="value">按商品分类</span>
            </div>
            <div class="h-item">
                <span class="lable">适用仓库:</span>
                <span class="value">中山仓</span>
            </div>
        </div>
        <div class="tactics-main-box">
            <div class="kind-name">
                <p>分类名称</p>
                <div class="center-cont" :style='{height: height -250 + "px"}'>
                    <el-tree
                        class="yy-tree"
                        :data="data"
                        ref="tree"
                        show-checkbox
                        node-key="id"
                        :default-expand-all='true'
                        :props="defaultProps">
                    </el-tree>
                </div>
                <div class="tree-btn">
                    <el-button @click='reset' class='reset'>重置</el-button>
                    <el-button @click='getNode' type='primary'>确定</el-button>
                </div>
            </div>
            <div class="kind-list">
                <p>分类列表</p>
                <el-table
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                        prop="label"
                        label="分类名称"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="id"
                        label="分类code"
                        width="180">
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-dialog
            title="箱号"
            :visible.sync="errorShow"
            width="480px"
            class='error-box'
            >
            <div class="content"><i class='iconguanbi1 iconfont error-icon'></i>&nbsp;请优先给库区或货位划定分类属性!</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="errorShow=false">取 消</el-button>
                <el-button type="primary" @click="errorSure">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data (){
        return {
            height: '',
            data: [{
                id: 1,
                label: '男装',
                children: [{
                id: 8,
                label: 'T恤'
                }, {
                id: 4,
                label: '卫衣',
                children: [{
                    id: 9,
                    label: '印花'
                }, {
                    id: 10,
                    label: '条纹'
                }]
                }, {
                id: 11,
                label: 'T恤'
                }]
            }, {
                id: 2,
                label: '女装'
            }, {
                id: 3,
                label: '鞋子'
            }, {
                id: 5,
                label: '箱包'
            }],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            tableData: [
                
            ],
            errorShow: false
        }
    },
    created (){
        this.getCategory().then(res=>{
            console.log(res)
        })
    },
    mounted (){
        let clientHeight = document.documentElement.clientHeight;
        this.height = clientHeight - 126;
        this.$refs.tree.setCheckedNodes([
            {
                id: 2,
                label: '女装'
            },
            {
                id: 9,
                label: '印花'
            },
            {
                id: 11,
                label: 'T恤'
            }
        ])
        this.getNode()
    },
    methods: {
        getNode (data){
            let tableData = this.$refs.tree.getCheckedNodes();
            this.tableData = [];
            tableData.forEach(item => {
                if (!item.children){
                    this.tableData.push(item)
                }
            })
        },
        errorSure (){
            this.errorShow = true;
        },
        reset (){
            this.$refs.tree.setCheckedNodes([])
        }
    }
}
</script>
