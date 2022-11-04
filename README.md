# supplychain-blockchain

# Inspect channel configuration:
osnadmin channel list -o localhost:8053 --ca-file ./organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt --client-cert ./organizations/ordererOrganizations/example.com/users/Admin\@example.com/tls/client.crt --client-key ./organizations/ordererOrganizations/example.com/users/Admin\@example.com/tls/client.key

# Join the order to channel
osnadmin channel join --channelID supplychain --config-block channel-artifacts/genesis.block -o localhost:8053 --ca-file ./organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt --client-cert ./organizations/ordererOrganizations/example.com/users/Admin\@example.com/tls/client.crt --client-key ./organizations/ordererOrganizations/example.com/users/Admin\@example.com/tls/client.key

# Join peer to channel
docker exec cli peer channel join -b channel-artifacts/genesis.block

export CORE_PEER_ADDRESS=peer0.manufacturer.example.com:8051
export CORE_PEER_LOCALMSPID=ManufacturerMSP
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_CERT_FILE=organizations/peerOrganizations/manufacturer.example.com/peers/peer0.manufacturer.example.com/tls/server.crt
export CORE_PEER_TLS_KEY_FILE=organizations/peerOrganizations/manufacturer.example.com/peers/peer0.manufacturer.example.com/tls/server.key
export CORE_PEER_TLS_ROOTCERT_FILE=organizations/peerOrganizations/manufacturer.example.com/peers/peer0.manufacturer.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=organizations/peerOrganizations/manufacturer.example.com/users/Admin@manufacturer.example.com/msp