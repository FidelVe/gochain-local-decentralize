# gochain-local-decentralize

Helper script for decentralizing a gochain local network created following the steps at https://github.com/icon-project/gochain-local

Before running the scripts make sure that the local chain is up and running.
```bash
docker ps
CONTAINER ID   IMAGE                        COMMAND                  CREATED          STATUS          PORTS                                                 NAMES
f6691d1ba80d   goloop/gochain-icon:latest   "/entrypoint /bin/sh…"   18 seconds ago   Up 16 seconds   8080/tcp, 0.0.0.0:9083->9080/tcp, :::9083->9080/tcp   gochain-local-node3-1
1e6a80cb896c   goloop/gochain-icon:latest   "/entrypoint /bin/sh…"   18 seconds ago   Up 16 seconds   8080/tcp, 0.0.0.0:9082->9080/tcp, :::9082->9080/tcp   gochain-local-node2-1
a1bf9f765db9   goloop/gochain-icon:latest   "/entrypoint /bin/sh…"   18 seconds ago   Up 17 seconds   8080/tcp, 0.0.0.0:9081->9080/tcp, :::9081->9080/tcp   gochain-local-node1-1
f55160493783   goloop/gochain-icon:latest   "/entrypoint /bin/sh…"   18 seconds ago   Up 16 seconds   8080/tcp, 0.0.0.0:9080->9080/tcp, :::9080->9080/tcp   gochain-local-node0-1
```
