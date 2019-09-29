echo -e '\n***输入备注信息，不填可按enter***\n'
read msg
if [ $msg ]
then
  message=$msg
else
  message='与上次提交信息相同'
fi
br=`git branch | grep "*"` # 当前分支名称
git add .
echo -e '\n***** 正在执行操作： git add . \n'
git commit -m ${message}
echo -e "\n***** 正在执行操作： git commit -m ${message} \n"
# git push origin ${br/* /}
# echo -e "\n***** 正在执行操作： git push origin ${br/* /} \n"
git checkout V1.0
echo -e "\n***** 正在执行操作： git checkout V1.0 \n"
git pull origin V1.0
echo -e "\n***** 正在执行操作： git pull origin V1.0 \n"
git merge ${br/* /}
echo -e "\n***** 正在执行操作： git merge ${br/* /} \n"
git push origin V1.0
echo -e "\n***** 正在执行操作： git push origin V1.0 \n"
git checkout ${br/* /}
echo -e "\n***** 正在执行操作： git checkout ${br/* /} \n"
git rebase V1.0
echo -e "\n***** 正在执行操作： git rebase V1.0 \n"
# git push origin ${br/* /}
# echo -e "\n***** 正在执行操作： git push origin ${br/* /} \n"
echo -e "\n操作完成！"
