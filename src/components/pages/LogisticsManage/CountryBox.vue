<template>
    <el-dialog
        title="添加目的地国家"
        :visible.sync="showCountry"
        width="740px"
        class='country-box'
        :show-close='true'
        :before-close="handleClose"
        :close-on-click-modal="false"
        >
        <div>
            <div class="add-box">
                <div class='add-head'>
                    <div class='add-title'>按区域搜索</div>
                    <el-select v-model="area" placeholder="请选择区域" class='add-s'>
                        <el-option label='亚洲' key='1' value='1'></el-option>
                        <el-option label='东欧' key='2' value='2'></el-option>
                        <el-option label='北美' key='3' value='3'></el-option>
                    </el-select>
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
                    <p class='show-title'>已选中国家</p>
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
        showCountry: {
            type: Boolean,
            default: false
        },
        countryList: {
            type: Array,
            default: []
        }
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
    watch: {
        'countryList' (list){
            console.log(list,'dfd')
           // this.$refs.multipleTable && this.$refs.multipleTable.toggleRowSelection(list);
        }
    },
    methods: {
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
            this.$emit('update:showCountry', false);
            
        },
        sure (){
            this.$emit('sureCountry',[...this.checkedData])
            this.$emit('update:showCountry', false);
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
            height: 32px;
            .add-title {
                height: 32px;
                line-height: 32px;
                width: 100px;
                float:left;
            }
            .add-s {
                width: 240px;
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

