淘宝 cnpm : https://npm.taobao.org/

## npm 命令

1. npm install jquery@1.12.3
    --save-dev 作为项目的开发依赖（devDependencies）安装
    npm i      直接安装package.json中依赖

2. npm uninstall ...
    --save-dev

3. npm list
    npm list jquery

4. npm info bootstrap
    查看某个包的信息(可安装前查询版本号)

5. npm search ...

6. npm init
    生成package.json

7. npm update jquery

8. npm cache clean
    清理缓存

10. npm run build
    相当于执行了node index.js  (执行package.json中的main文件入口js)

11. npm home [package]
    浏览器中打开 包 的托管地址

12. npm install <git:// url>

13. npm install <github username>/<github project>


## 插件

1. http-server
    *. npm install http-server -g
    *. http-server [path] [options]
        http-server src
    *. -p 8888
