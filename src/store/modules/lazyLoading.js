// 懒加载组件
function lazy(name) {
  if (name != '') {
    let file = name.split('/')[0]
    let fileName = name.split('/')[1]
    return () => import(`pages/${file}/${fileName}`)
  } 
  // else {
  //   return () => import(`pages/UserManage/home.vue`)
  // }
}
export {lazy}

