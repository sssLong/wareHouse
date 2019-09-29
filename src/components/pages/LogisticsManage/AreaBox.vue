<template>
    <el-dialog
        title="添加地区"
        :visible.sync="showArea"
        width="740px"
        class='country-box'
        :show-close='true'
        :before-close="handleClose"
        :close-on-click-modal="false"
        >
        <div>
            <div class="add-box">
                <div class='add-head'>
                    <el-input clearable placeholder="请输入" v-model="area" class="input-with-select" @clear='search'>
                        <div slot="prepend" class='selectScan'>地区名称</div>
                        <el-button slot="append" icon="el-icon-search" class='search-w' @click='search'></el-button>
                    </el-input>
                </div>
                <el-table :data="gridData" class="tableBox pt-10" @selection-change="handleSelectionChange" ref="multipleTable">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column property="zhName" label="中文名"></el-table-column>
                    <el-table-column property="code" label="代码"></el-table-column>
                    <el-table-column property="enName" label="英文名"></el-table-column>
                </el-table>
            </div>
            <div class="show-box">
                <div class="show-head">
                    <p class='show-title'>已选中地区</p>
                    <i @click='removeCountry'>确认移除</i>
                </div>
                <el-table :data="checkedData" class="tableBox pt-10" @selection-change="checkedChange" ref="checdedTable">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column property="zhName" label="中文名"></el-table-column>
                    <el-table-column property="code" label="代码"></el-table-column>
                    <el-table-column property="enName" label="英文名"></el-table-column>
                </el-table>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="sure">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
    props: {
        showArea: {
            type: Boolean,
            default: false
        },
    },
    data (){
        return {
            gridData: [
                {
                    zhName: '中国',
                    code: '1',
                    enName: 'china'
                },
                {
                    zhName: '英国国',
                    code: '2',
                    enName: 'english'
                }
            ],
            checkedData: [],
            removeData: [],
            area: ''
        }
    },
    mounted (){
        this.$nextTick(()=>{
            setTimeout(()=>{    
                this.$refs.multipleTable && this.$refs.multipleTable.toggleRowSelection(this.gridData[0]);
            },0)
             
        })
    },
    methods: {
        search (){

        },
        handleSelectionChange (data){
            this.checkedData = data;
        },
        checkedChange (data){
            this.removeData = data;
        },
        removeCountry (){
            let checkedData = [...this.checkedData];
            this.removeData.forEach(item=>{
                this.$refs.multipleTable.toggleRowSelection(item);
            })  
            this.checkedData = [];
            checkedData.forEach((item,n)=>{
                let flag = true;
                this.removeData.forEach(itemList=>{
                    if (item.code == itemList.code){
                        flag = false
                    }
                })
                flag && this.checkedData.push(item)
            })
            
        },
        handleClose (){
            this.$emit('update:showArea', false);
            
        },
        sure (){
            this.$emit('update:showArea', false);
        }
    }
}
</script>
<style lang='scss' scoped>
.country-box /deep/ .el-dialog__body{
    padding: 20px;
}
.country-box {
    color: #333;
    .add-box {
        float: left;
        width: 340px;
        .add-head {
            width: 340px;
            height: 32px;

            & /deep/.el-input__inner {
            height: 32px;
            line-height: 32px;
            }

            & /deep/.el-input-group__prepend {
            background-color: rgba(0, 0, 0, 0) !important;
            border-radius: 32px 0 0 32px !important;
            }

            & /deep/.el-input-group__append {
            background-color: rgba(0, 0, 0, 0) !important;
            border-radius: 0 32px 32px 0 !important;
            }

            .selectShelf {
                width: 100px;
                position: relative;
                & /deep/.el-select__caret {
                    line-height: 32px;
                }
            
            }
            & /deep/.el-button{
                min-width: 50px;
            }
            .selectScan {
                width: 50px;
            }
            .search-w {
                width: 50px;
            }
        }
    }
    .show-box {
        margin-left: 20px;
        float: left;
        width: 340px;
        .show-head {
            display: flex;
            justify-content : space-between;
            height: 32px;
            .show-title {
                height: 32px;
                line-height: 32px;
            }
            i {
                height: 32px;
                line-height: 32px;
            }
        } 
    }

}
</style>

