#!/usr/bin/env bash
for file in `ls | grep .JPG`
do
    newfile=`echo $file |  sed 's/JPG$/jpg/g'`
    mv $file $newfile
done
webpc -q=30 -o ./webp/
