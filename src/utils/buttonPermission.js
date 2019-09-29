export default {
    //获取当前登陆用户所拥有权限
    rouleButtonPermissionFn(params){   //params从页面当中传过来的按钮名字  
        let roulePath = JSON.parse(localStorage.getItem('RoleMenuTree'));   //获取当前登录用户权限菜单
        let thisPagePath = this.$route.path.substr(1, this.$route.path.length);     //去除第一个'/'的path地址
        let comparedResult = {};
        findPath(roulePath)
        function findPath(data){    //从当前登录用户权限菜单找出当前页面的对象
            if(data != undefined){
                data.find(item=>{
                    if(item.url == thisPagePath){
                        comparedResult = item
                        return item
                    }else{
                        if(item.children && item.children.length != 0){
                            findPath(item.children)
                        }
                    }

                })
            }
        }
        let permissionButtonList = [];        
        if(JSON.stringify(comparedResult) != '{}'){
            try {
              comparedResult.children.map((item) => { //取出当前页面button的操作
              permissionButtonList.push(item.name)
              })
            }catch (e) {
              
            }
        }
        
        return permissionButtonList.some(item => { return item == params }) //从当前页面list中匹配名字，有就返回true 没有就false
    }
}
