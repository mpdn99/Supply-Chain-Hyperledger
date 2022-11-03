# supplychain-blockchain

# Inspect channel configuration:
osnadmin channel list -o localhost:7053 --ca-file ./organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt --client-cert ./organizations/ordererOrganizations/example.com/users/Admin\@example.com/tls/client.crt --client-key ./organizations/ordererOrganizations/example.com/users/Admin\@example.com/tls/client.key

# Join the order to channel
osnadmin channel join --channelID supplychain --config-block channel-artifacts/genesis.block -o localhost:7053 --ca-file ./organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt --client-cert ./organizations/ordererOrganizations/example.com/users/Admin\@example.com/tls/client.crt --client-key ./organizations/ordererOrganizations/example.com/users/Admin\@example.com/tls/client.key

# Join peer to channel
peer channel join -b channel-artifacts/genesis.block