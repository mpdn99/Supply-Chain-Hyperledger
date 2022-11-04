docker-compose -f host5.yaml down -v
docker rm $(docker ps -aq)
docker rmi $(docker images dev-* -q)