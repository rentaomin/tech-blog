@echo off
setlocal enabledelayedexpansion

REM 设置要查找的文件名开头部分
set "name_start=Minio "

REM 设置要替换的新前缀
set "new_prefix=Minio-"

REM 循环处理当前目录中的所有文件
for %%f in (%name_start%*.md) do (
    REM 获取文件名和扩展名
    set "filename=%%~nf"
    set "extension=%%~xf"
    
    REM 去掉文件名开头的name_start部分
    set "new_name=!filename:%name_start%=!"

    REM 构建新文件名
    set "new_filename=!new_prefix!!new_name!!extension!"
    
    REM 重命名文件
    ren "%%f" "!new_filename!"
)

endlocal
@echo on
