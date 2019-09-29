/*
 * @Author: 李步钻 
 * @Date: 2019-07-10 16:04:53 
 * @Last Modified by: 李步钻
 * @Last Modified time: 2019-08-20 11:13:15
 */

// ==================   模块共用方法   =======================
import _ from 'lodash';
/**
 * 出库作业模块 
 */  

export default {
    //  * 拣货 仓库编码+PL+年[后两位]+月+日+6位流水 
    /**
     * 
     * @param {*} str 输入框的值
     * @param {*} arr 仓库数据
     */
    isPickingNum(str,arr) {
      if(!_.isArray(arr)) return
      let index = str.indexOf('PL')
      let code = str.substring(0,index)
      let flag = false;
      arr.forEach( item => {
        if(code == item.dataCode) {
          flag = true
        }
      })
      return flag;
    },
    /**
     * 找出数组对象中重复的项 放在一个新数组中
     * @param {*} data 要找的数组
     */
    getRepeatData(data) {
      let result=[];
      let obj = {};
        for (let i = 0; i < data.length; i++) {
          const el = data[i];
          for (let y = i+1; y < data.length; y++) {
            const val = data[y];
            if(el.packageNum == val.packageNum && el.sku == val.sku ) {
              if(!obj[el.id]){
                result.push(el)
                obj[el.id] = true
              }
              if(!obj[val.id]){
                result.push(val)
                obj[val.id] = true
              }
            }
          }
        }
      return result
  },
  /**
    * 把数组对象中的重复项合并成一个数组 不重复的一个数组
    * @param {*} arr 要分组的数组
    */
   mergeArr (arr){     
    let val = [];
    arr.forEach(i=>{
        let flag = false;
        let k = 0;
        val.forEach((n,m)=>{
            for (let j = 0; j < n.length; j ++){
                if (i.packageNum == n[j].packageNum && i.sku == n[j].sku){
                    flag = true
                    k = m;
                }
            }
        })
        if (flag){
            val[k].push(i)
        } else{
            val.push([i])
        }
    })
    return val
  },
}



