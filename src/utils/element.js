export default {
    // 找出相邻元素
    _siblings(element) {
        let arr = [];
        // 找出父节点 然后找到父节点的所有子节点 遍历
        let p = element.parentNode.children;
        for(let i =0; i< p.length; i++) {
        if(p[i] !== element) arr.push(p[i]);
        }
        return arr;
    },
      // 取元素的属性 宽/高/margin/padding
     _getStyle(obj, attr) {
        if (obj.currentStyle) {
            return obj.currentStyle[attr];
        } else {
            return document.defaultView.getComputedStyle(obj, null)[attr];
        }
    },
    // 获取元素的margin-top
    _getMarginTop(ele, attr) {
        let domMargin = this._getStyle(ele, attr)
        return Number(domMargin.substr(0,(domMargin.length-2)))
    },
    // 求和 元素之间的高度
    _getSum(arr) {
        let sum = 0
        arr.forEach(item => {
            item.marginTop = this._getMarginTop(item,'marginTop')
            item.marginBottom = this._getMarginTop(item,'marginBottom')
            sum += item.offsetHeight+item.marginTop+item.marginBottom
        })
        return sum;
    },
    async setTableHeight (...rest){
        // let mainDom = document.getElementsByClassName('main')[0]
        // let elTableDom= document.getElementsByClassName('el-table')[0]
        // // let tableDom = document.getElementsByClassName('table-container')[0]
        // let tableDom = elTableDom.parentNode // 去掉上面必须加入table-container类
        // let elTableDomMarginTop = await this._getMarginTop(tableDom,'marginTop')
        // let arr = await this._siblings(tableDom)
        // let elArr = await this._siblings(elTableDom)
        // let outSum = await this._getSum(arr)
        // let innerSum = await this._getSum(elArr)
        // let height = mainDom.offsetHeight-outSum-innerSum-elTableDomMarginTop;
        // // console.log(outSum,innerSum,height,elTableDomMarginTop,'long')
        // return [...rest].reduce( (acc, cur)=>acc + cur,height)

        let mainDom = document.getElementsByClassName('main')[0]
        let elTableDom= document.getElementsByClassName('el-table')[0]
        let tableContainerDom = document.getElementsByClassName('table-container')[0]
        let tableDom = elTableDom.parentNode // 去掉上面必须加入table-container类
        let elTableDomMarginTop = await this._getMarginTop(tableDom,'marginTop')
        let tableContainerArr = await this._siblings(tableContainerDom)
        let arr = await this._siblings(tableDom)
        let elArr = await this._siblings(elTableDom)
        let tableContainerSum = await this._getSum(tableContainerArr)
        let outSum = await this._getSum(arr)
        let innerSum = await this._getSum(elArr)
        let height = mainDom.offsetHeight-tableContainerSum-outSum-innerSum-elTableDomMarginTop;
        console.log(tableContainerSum,outSum,innerSum,height,elTableDomMarginTop,'long')
        return [...rest].reduce( (acc, cur)=>acc + cur,height)
       
    }
}