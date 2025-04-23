# 📦 Deployment Guide for Supply Chain on Hyperledger Fabric

This guide walks you through setting up and deploying the supply chain management system across multiple virtual machines (VMs) on Google Cloud Platform (GCP) using Docker Swarm and Hyperledger Fabric.

---

## 📁 Prerequisites

- A Google Cloud account with billing enabled
- Basic knowledge of Linux commands and Docker

---

## 🖥️ 1. Set Up the First Virtual Machine (VM)

### Create VM Instance

1. Go to **Compute Engine > VM Instances**
2. Click **Create Instance**:
   - Name: `vm1`
   - Machine type: `e2-medium`
   - Allow HTTP/HTTPS traffic
3. SSH into the instance once it's created

### Install Dependencies

```bash
sudo su
su ubuntu
cd ~
sudo apt-get update
sudo apt-get install git curl jq
```

### Install Docker

```bash
sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

sudo mkdir -m 0755 -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
    sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io \
    docker-buildx-plugin docker-compose-plugin

sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
```

### Install Go

```bash
curl -O https://go.dev/dl/go1.20.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.20.linux-amd64.tar.gz

echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.profile
source ~/.profile
```

### Install Hyperledger Fabric Binaries

```bash
mkdir -p $HOME/go/src/github.com/<your_github_userid>
cd $HOME/go/src/github.com/<your_github_userid>
curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh
chmod +x install-fabric.sh
./install-fabric.sh b d s
```

Add binaries to path:
```bash
echo 'export PATH=$PATH:$HOME/go/src/github.com/<your_github_userid>/fabric-samples/bin' >> ~/.profile
source ~/.profile
```

Clone the project:
```bash
cd ~
git clone https://github.com/mpdn99/Supply-Chain-Hyperledger.git
```

---

## 🧱 2. Clone the Disk for Additional Nodes

1. Go to **Compute Engine > Disks**
2. Click on the disk for `vm1` → More actions → **Clone Disk**
3. Create `vm2`, `vm3`, and `vm4` from the cloned disk
4. Launch VM instances from these cloned disks

---

## 🌐 3. Configure Network & Firewall

1. Go to **VPC Network > Firewall Rules**
2. Create rule to allow all TCP/UDP/ICMP from all sources (`0.0.0.0/0`)
3. Apply the rule to each VM using **Network Tags**

---

## 🐳 4. Docker Swarm Setup

### On `vm1`
```bash
docker swarm init --advertise-addr <vm1-ip>
docker swarm join-token worker
```

### On `vm2`, `vm3`, `vm4`
Run the `docker swarm join` command copied from `vm1`, adding `--advertise-addr <vm-ip>`.

### Create Overlay Network
```bash
docker network create --attachable --driver overlay supplychain-net
```

---

## 🚀 5. Launch Supply Chain Hosts

On each VM:
```bash
cd ~/Supply-Chain-Hyperledger/hostX   # where X = 1, 2, 3, or 4
./hostXup.sh
```
To stop:
```bash
./hostXdown.sh
```

---

## 🔗 6. Deploy Chaincode

### Step 1: Package and Install
On all machines (inside CLI container):
```bash
docker exec -ti cli bash
peer lifecycle chaincode package supplychain.tar.gz \
  --path ./chaincode/ --lang golang --label supplychain_1.0
peer lifecycle chaincode install supplychain.tar.gz
```

### Step 2: Approve Chaincode
Run appropriate approve command from each org (see README).

### Step 3: Commit Chaincode (From `vm1`)
Use the commit command as detailed in README.

### Step 4: Initialize Ledger (From `vm1`)
```bash
peer chaincode invoke -o orderer.example.com:7050 ... -c '{"function":"InitLedger","Args":[]}'
```

---

## 🖥️ 7. Run Backend on Each VM

```bash
cd ~/Supply-Chain-Hyperledger/application
tmux new -s backend
npm install
go run main.go
```

Use `Ctrl + b + d` to detach and `tmux a -t backend` to reattach.

---

## ✅ Done!
You now have a multi-node supply chain system running on Hyperledger Fabric with role-based nodes and traceable product flows.
