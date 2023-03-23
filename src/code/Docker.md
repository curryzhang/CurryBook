---
title: Docker使用
icon: page
order: 5
author: curryzhang
date: 2023-02-22
category:
  - Docker
tag:
  - Docker
# 是否置顶
# sticky: true
# 是否收藏
star: true
---

安装参考：[基于docker安装ELK](https://www.jianshu.com/p/a0bd70301eec)

删除image`docker rmi elasticsearch`时异常：Error response from daemon: conflict: unable to remove repository reference "elasticsearch" (must force) - container c0078051c350 is using its referenced image 5acf0e8da90b

根据ID删除`docker rm c0ed080d8d5f`异常：Error response from daemon: You cannot remove a running container c0ed080d8d5f4e94df3fd92e7379bb22d2294a61a9147878897b48d708cb18eb. Stop the container before attempting removal or force remove
处理：先停用`docker stop c0ed080d8d5f`在执行删除`docker rm c0ed080d8d5f` 

docker run --name es_logstash docker.elastic.co/logstash/logstash:6.2.4

命令|解释
--|--
docker ps |查看容器运行情况
docker ps -a|查看所有容器情况
docker exec -it logstash /bin/bash|进入容器内部
docker logs <logstash容器名> | 查看容器日志
docker network ls|命令查看所有的 Docker 网络名称
docker network inspect <网络名称> |检查的 Docker 网络
curl -XGET http://<elasticsearch_host>:<端口号>/_mapping | 获取mapping信息，可以得到index_name和type_name
curl -XGET http://<elasticsearch_host>:<端口号>/<index_name>/<type_name>|elasticsearch_host 为 Elasticsearch 容器的 IP 地址，index_name 为索引名称，type_name 为类型名称
telnet 172.17.0.5 9300|测试 Elasticsearch 和 Logstash 的通信情况
docker images|查看所有的image
docker image inspect 01979bbd06c9|查看image的详细信息

 Elasticsearch 默认端口9300，Logstash 默认端口一般为 9600。 

curl -XGET http://172.17.0.2:9600
logstash -e'input {stdin {}} output {stdout {}}'



