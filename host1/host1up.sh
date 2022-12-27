echo "====================Initialization===================="
docker-compose -f host1.yaml up -d

cd ..

echo "====================Join order to channel===================="
osnadmin channel join --channelID supplychain --config-block channel-artifacts/genesis.block -o localhost:7053 --ca-file ./organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt --client-cert ./organizations/ordererOrganizations/example.com/users/Admin@example.com/tls/client.crt --client-key ./organizations/ordererOrganizations/example.com/users/Admin@example.com/tls/client.key

osnadmin channel join --channelID supplychain --config-block channel-artifacts/genesis.block -o localhost:11053 --ca-file ./organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt --client-cert ./organizations/ordererOrganizations/example.com/users/Admin@example.com/tls/client.crt --client-key ./organizations/ordererOrganizations/example.com/users/Admin@example.com/tls/client.key


echo "====================Join peer to channel====================="
docker exec cli peer channel join -b channel-artifacts/genesis.block
