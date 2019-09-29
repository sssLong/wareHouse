br=`git branch | grep "*"` # 当前分支名称
git stash
echo -e '\n***** 正在执行操作： git stash \n'
git checkout V1.0
echo -e '\n***** 正在执行操作： git checkout V1.0 \n'
git pull origin V1.0
echo -e "\n***** 正在执行操作： git pull origin V1.0 \n"
git checkout ${br/* /}
echo -e "\n***** 正在执行操作： git checkout ${br/* /} \n"
git rebase V1.0
echo -e "\n***** 正在执行操作： git rebase V1.0 \n"
git stash pop
echo -e "\n***** 正在执行操作： git stash pop \n"
git status
echo -e "\n***** 正在执行操作： git status \n"
# echo -e "\n操作完成！"
