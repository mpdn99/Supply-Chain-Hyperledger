# Supply Chain Management System using Blockchain

## Object:
Today’s supply chains are global networks that generally include manufacturers, suppliers, logistics companies, and retailers that work together to deliver products to consumers. As modern supply chains continue to expand, they also are becoming more complex and disparate. Typically, traditional supply chains use paper based and disjointed data systems that lead to information silos and make tracking products a time consuming task. Lack of traceability and transparency is an industry-wide challenge that leads to delays, errors, and increased costs. Modern supply chain participants need a unified view of data, while still being able to independently and privately verify transactions such as production and transport updates.

Supply chain solutions built using Blockchain can provide the end-to-end visibility today’s supply chains need to track and trace their entire production process with increased automation efficiency.

## Participant(Organization) in this System:
 - Host 1: Manufacturer
 - Host 2: Distributor
 - Host 3: Retailer
 - Host 4: Customer

## Application Flow:
  - User are enroll into the application by Admin of Organization
  - The goods will be created by the Manufacturer only
  - Manufacturer will create Product
  - Product will be sent from Manufacturer to Distributor
  - Distributor will send it to Retailer
  - Customer trace production

## Network Details:
  - 4 Orgs(Manufacturer/Distributor/Retailer/Customer)
  - 4 Peers
  - RAFT Orderer(5 Orderer)

## Chaincode Functions:
  - signIn (user Login)
  - createProduct(Manufacturer)
  - updateProduct(Manufacturer)
  - sentToDistributor(Distributor)
  - sentToRetailer(Retailer)
  - sellToCustomer(Retailer)
  - QueryProduct(Query by Production ID)
  - QueryAllProducts(All)

## How to use
### Setting Virtual Machine on Google Cloud
1. Sign up for Google Cloud with a Visa Debit or Visa Credit card
2. Click on the menu in the top left corner of the page, select Compute Engine -> VM instances
4. Click Create Instance, name it vm1, select the e2-medium machine (2vCPU, 4GB memory), in the Firewall section, select Allow HTTP traffic and Allow HTTPS traffic -> Create
5. On the VM instances page, click on the SSH of the vm you just registered, then a new window will appear
5. type sudo su, then su ubuntu to switch to Ubuntu user, then cd to return to the root directory
6. sudo apt-get install git to install git
7. sudo apt-get install curl to install curl
8. Install docker:
   - Install repository:
```bash
sudo apt-get update

sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

sudo mkdir -m 0755 -p /etc/apt/keyrings

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

 - Install Docker engine:
```bash
sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo systemctl start docker

sudo systemctl enable docker
sudo usermod -a -G docker ubuntu
```

9. Install Go:
```bash
curl https://go.dev/dl/go1.20.linux-amd64.tar.gz

rm -rf /usr/local/go

tar -C /usr/local -xzf go1.20.linux-amd64.tar.gz

sudo nano ~/.profile
```

add `export PATH=$PATH:/usr/local/go/bin` to file

Press the combination Ctrl + S then Ctrl + X to close

type `source ~/.profile` to refresh the terminal

check version: `go version`

10. Instal jq:
```bash
sudo apt-get install jq
```

11. Install Hyperledger Bin
```bash
mkdir -p $HOME/go/src/github.com/<your_github_userid>
cd $HOME/go/src/github.com/<your_github_userid>

curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod +x install-fabric.sh

./install-fabric.sh b d s
```

edit file path: sudo nano ~/.profile, add to path :/$HOME/go/src/github.com/<your_github_userid>/fabric-samples/bin

Press the combination Ctrl + S then Ctrl + X to close

12. cd to root folder: `cd ~`
13. `git clone https://github.com/mpdn99/Supply-Chain-Hyperledger.git`
14. Turn off the window, continue working with the Google Cloud page, click Disk on the left side and the list of disks you currently have will appear. Click on the 2 dots in the action column, select Clone Disk, name it VM2, Single Zone, uncheck Enable snapshot schedule, then Create
15. Do the same as above to have 4 disks including vm1, vm2, vm3, vm4
16. Return to the VM instances page, select create instances, do the same as vm 1, however in the Boot disk section, select Change -> Existed Disk, select a drive, then select
17. Do the same to create 4 vm
18. Click on the menu in the top left corner, select VPC network -> Firewall
19. Click create firewall rule, set name, tags and Suorce IPv4 range as 0.0.0.0/0, Protocols and ports section, select allow all -> create
20. Go back to VM instances, click on the name of vm1 -> Edit, in the Network tags section, add a few tags you just created at the firewall -> save
21. Do the same with the remaining 3 machines
### Working with hosts
1. SSH to vm1
2. ```bash
   sudo su
   su ubuntu
   ```
   
3. `docker swarm init --advertise-addr <ip của node>`
4. `docker swarm join-token worker`
5. Copy the command according to the instructions
6. SSH into other machines
```bash
sudo su
su ubuntu
cd
```

Paste the code I just copied, adding --advertise-addr <your device's ip> at the end
7. `docker node ls` to check if all machines have joined
8. `docker network create --attachable --driver overlay`
9. `docker network ls` to check
10. Each machine runs one by one
```bash
cd Supply-Chain-Hyperledger
cd host1 (vm1 is host1, vm2 is host2, ...)
./host1up.sh
```

If there is an error, `./host1down.sh` and run again `./host1up.sh`
### Instal chaincode
1. Install chaincode
All machine:
```bash
docker exec -ti cli bash

peer lifecycle chaincode package supplychain.tar.gz --path ./chaincode/ --lang golang --label supplychain_1.0

peer lifecycle chaincode install supplychain.tar.gz

export CC_PACKAGE_ID=<package id returned when I installed the chaincode above>
```

2. Machines approve chaincode to blockchain:
   
machine 1:
`peer lifecycle chaincode approveformyorg -o orderer.example.com:7050 --ordererTLSHostnameOverride orderer.example.com --channelID supplychain --name supplychain --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile "${PWD}/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"`

machine 2:
`peer lifecycle chaincode approveformyorg -o orderer2.example.com:8050 --ordererTLSHostnameOverride orderer2.example.com --channelID supplychain --name supplychain --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile "${PWD}/crypto/ordererOrganizations/example.com/orderers/orderer2.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"`

machine 3:
`peer lifecycle chaincode approveformyorg -o orderer3.example.com:9050 --ordererTLSHostnameOverride orderer3.example.com --channelID supplychain --name supplychain --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile "${PWD}/crypto/ordererOrganizations/example.com/orderers/orderer3.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"`

machine 4:
`peer lifecycle chaincode approveformyorg -o orderer4.example.com:10050 --ordererTLSHostnameOverride orderer4.example.com --channelID supplychain --name supplychain --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile "${PWD}/crypto/ordererOrganizations/example.com/orderers/orderer4.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"`

3. Machine 1 checks the status:
`peer lifecycle chaincode checkcommitreadiness --channelID supplychain --name supplychain --version 1.0 --sequence 1 --tls --cafile "${PWD}/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/ tlscacerts/tlsca.example.com-cert.pem" --output json`

5. machine 1 commit chaincode:
`peer lifecycle chaincode commit -o orderer.example.com:7050 --ordererTLSHostnameOverride orderer.example.com --channelID supplychain --name supplychain --version 1.0 --sequence 1 --tls --cafile "${PWD}/crypto /ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --peerAddresses peer0.manufacturer.example.com:7051 --tlsRootCertFiles "${PWD}/ crypto/peerOrganizations/manufacturer.example.com/peers/peer0.manufacturer.example.com/tls/ca.crt" --peerAddresses peer0.distributor.example.com:8051 --tlsRootCertFiles "${PWD}/crypto/peerOrganizations /distributor.example.com/peers/peer0.distributor.example.com/tls/ca.crt" --peerAddresses peer0.retailer.example.com:9051 --tlsRootCertFiles "${PWD}/crypto/peerOrganizations/retailer. example.com/peers/peer0.retailer.example.com/tls/ca.crt" --peerAddresses peer0.customer.example.com:10051 --tlsRootCertFiles "${PWD}/crypto/peerOrganizations/customer.example.com /peers/peer0.customer.example.com/tls/ca.crt"`

7. Machine 1: initialize Ledger
`peer chaincode invoke -o orderer.example.com:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/ tlscacerts/tlsca.example.com-cert.pem" -C supplychain -n supplychain --peerAddresses peer0.manufacturer.example.com:7051 --tlsRootCertFiles "${PWD}/crypto/peerOrganizations/manufacturer.example.com/peers /peer0.manufacturer.example.com/tls/ca.crt" --peerAddresses peer0.distributor.example.com:8051 --tlsRootCertFiles "${PWD}/crypto/peerOrganizations/distributor.example.com/peers/peer0. distributor.example.com/tls/ca.crt" --peerAddresses peer0.retailer.example.com:9051 --tlsRootCertFiles "${PWD}/crypto/peerOrganizations/retailer.example.com/peers/peer0.retailer.example .com/tls/ca.crt" --peerAddresses peer0.customer.example.com:10051 --tlsRootCertFiles "${PWD}/crypto/peerOrganizations/customer.example.com/peers/peer0.customer.example.com/ tls/ca.crt" -c '{"function":"InitLedger","Args":[]}'`

9. All machines:
`exit`

### Run back-end
```bash
All machines:
cd application
tmux new -l <task name> to create a background task
go run main.go
```

Press the key combination Ctrl + b + d to exit the task (Every time you want to enter the task: tmux a -t <task name>)
