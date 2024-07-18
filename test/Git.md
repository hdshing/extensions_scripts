## Git知识



**git commit之后，想撤销commit**

```
git reset --soft HEAD^
仅仅撤回commit操作，代码仍然保留
```



```javascript
stash
描述：当您想记录工作目录和索引的当前状态，但又想返回一个干净的工作目录时，请使用git stash。该命令将保存本地修改，并恢复工作目录以匹配头部提交。
// 保存当前未commit的代码
git stash
// 保存当前未commit的代码并添加备注
git stash save "备注的内容"
// 列出stash的所有记录
git stash list
// 删除stash的所有记录
git stash clear
// 应用最近一次的stash
git stash apply
// 应用最近一次的stash，随后删除该记录
git stash pop
// 删除最近的一次stash
git stash drop
// 应用指定记录
git stash apply stash@{1}
```

```
将分支dev合并到当前分支中：git merge dev
```



**项目管理知识**

分支管理（粗略）：

1. master：主分支，负责记录上线版本的迭代，该分支代码与线上项目代码一致
2. dev：开发分支，所有feature和bugfix分支从该分支创建
3. release：发布分支，用于代码上线前准备
