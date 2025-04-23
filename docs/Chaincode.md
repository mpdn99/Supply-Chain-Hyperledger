
# 🛠️ Chaincode Deployment Guide

This guide provides steps to deploy the chaincode for the **Supply Chain Management** system using **Hyperledger Fabric**.

## 📝 Chaincode Overview

The chaincode is the business logic of the supply chain, defining functions like asset creation, transfer, and querying product data. This logic runs on the blockchain network and interacts with peers to ensure secure and immutable transactions.

### Chaincode Functions:

- `signIn`: User login
- `createProduct`: Create a new product (Manufacturer)
- `updateProduct`: Update product details (Manufacturer)
- `sentToDistributor`: Transfer product from Manufacturer to Distributor
- `sentToRetailer`: Transfer product from Distributor to Retailer
- `sellToCustomer`: Transfer product from Retailer to Customer
- `QueryProduct`: Query product details by Production ID
- `QueryAllProducts`: Query all products in the system

---

## 🖥️ Setup Chaincode

1. Clone the repository on each VM:

    ```bash
    git clone https://github.com/mpdn99/Supply-Chain-Hyperledger.git
    cd Supply-Chain-Hyperledger
    ```

2. **Package the Chaincode**: On each machine, inside the Docker CLI container, package the chaincode:

    ```bash
    docker exec -ti cli bash
    peer lifecycle chaincode package supplychain.tar.gz --path ./chaincode/ --lang golang --label supplychain_1.0
    ```

3. **Install Chaincode**: Install the packaged chaincode on all nodes:

    ```bash
    peer lifecycle chaincode install supplychain.tar.gz
    ```

---

## 🔐 Approve the Chaincode

On each machine, approve the chaincode using the following command (adjust the package ID for each machine):

```bash
peer lifecycle chaincode approveformyorg -o orderer.example.com:7050 --ordererTLSHostnameOverride orderer.example.com --channelID supplychain --name supplychain --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile "${PWD}/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"
```

---

## ✅ Commit the Chaincode

From `vm1`, commit the chaincode:

```bash
peer lifecycle chaincode commit -o orderer.example.com:7050 --ordererTLSHostnameOverride orderer.example.com --channelID supplychain --name supplychain --version 1.0 --sequence 1 --tls --cafile "${PWD}/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --peerAddresses peer0.manufacturer.example.com:7051 --tlsRootCertFiles "${PWD}/crypto/peerOrganizations/manufacturer.example.com/peers/peer0.manufacturer.example.com/tls/ca.crt" --peerAddresses peer0.distributor.example.com:8051 --tlsRootCertFiles "${PWD}/crypto/peerOrganizations/distributor.example.com/peers/peer0.distributor.example.com/tls/ca.crt" --peerAddresses peer0.retailer.example.com:9051 --tlsRootCertFiles "${PWD}/crypto/peerOrganizations/retailer.example.com/peers/peer0.retailer.example.com/tls/ca.crt" --peerAddresses peer0.customer.example.com:10051 --tlsRootCertFiles "${PWD}/crypto/peerOrganizations/customer.example.com/peers/peer0.customer.example.com/tls/ca.crt"
```

---

## 🔄 Initialize Ledger

From `vm1`, initialize the ledger with the following command:

```bash
peer chaincode invoke -o orderer.example.com:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C supplychain -n supplychain --peerAddresses peer0.manufacturer.example.com:7051 --tlsRootCertFiles "${PWD}/crypto/peerOrganizations/manufacturer.example.com/peers/peer0.manufacturer.example.com/tls/ca.crt" --peerAddresses peer0.distributor.example.com:8051 --tlsRootCertFiles "${PWD}/crypto/peerOrganizations/distributor.example.com/peers/peer0.distributor.example.com/tls/ca.crt" --peerAddresses peer0.retailer.example.com:9051 --tlsRootCertFiles "${PWD}/crypto/peerOrganizations/retailer.example.com/peers/peer0.retailer.example.com/tls/ca.crt" --peerAddresses peer0.customer.example.com:10051 --tlsRootCertFiles "${PWD}/crypto/peerOrganizations/customer.example.com/peers/peer0.customer.example.com/tls/ca.crt" -c '{"function":"InitLedger","Args":[]}'
```

---

## 📡 Interact with Chaincode

Once the chaincode is committed and the ledger is initialized, the system is ready to interact with the chaincode functions through the application backend or directly using the Fabric CLI.
