set rootpath=F:\webs\.githubProjects\koishi-app\

set _cd=%cd%
cd %rootpath%

call yarn build

cd %rootpath%external\milk-ikun

git push https://github.com/zhuhansan666/koishi-plugin-milk-ikun.git master --force
call npm publish

cd %_cd%
