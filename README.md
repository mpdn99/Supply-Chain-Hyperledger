# 🚚 Supply Chain Management on Hyperledger Fabric

A blockchain-based supply chain system built on **Hyperledger Fabric** to ensure **transparency**, **traceability**, and **trust** across all supply chain participants.

---

## 🌟 Overview

This project simulates a supply chain network involving:

- 🏭 Manufacturer  
- 🏢 Distributor  
- 🛍️ Retailer  
- 👤 Customer  

All roles interact with a **permissioned blockchain** network powered by **Hyperledger Fabric**.

---

## 🔧 Features

- Asset creation, transfer, and immutable tracking
- Role-based access control (RBAC)
- Modular Node.js chaincode
- Containerized with Docker
- REST API backend & web frontend

---

## 🧱 Tech Stack

| Layer       | Technology                |
|-------------|---------------------------|
| Blockchain  | Hyperledger Fabric v2.x   |
| Chaincode   | Golang                    |
| Backend     | Golang (Fabric SDK)       |
| Frontend    | React                     |
| DevOps      | Docker, Docker Compose    |

---

## 🧭 System Architecture

![System Architecture](https://github.com/mpdn99/Supply-Chain-Hyperledger/assets/17932234/f4187a5d-0d07-45f2-a819-3e5731656c62)

---

## 🧑‍🤝‍🧑 Participants (Organizations)

- Host 1: Manufacturer
- Host 2: Distributor
- Host 3: Retailer
- Host 4: Customer

---

## 🔁 Application Flow

1. Admin enrolls users for each organization.
2. Manufacturer creates products.
3. Products are sent to:
   - Distributor → Retailer → Customer
4. Customer can trace product history.

---

## 🏗️ Network Details

- 4 Organizations (1 peer each)
- 5 RAFT Orderers
- Secure communication with TLS

---

## 🔗 Chaincode Functions

- `signIn`
- `createProduct`
- `updateProduct`
- `sentToDistributor`
- `sentToRetailer`
- `sellToCustomer`
- `QueryProduct`
- `QueryAllProducts`

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mpdn99/Supply-Chain-Hyperledger.git
cd Supply-Chain-Hyperledger
