# 🚚 Supply Chain Management on Hyperledger Fabric

A blockchain-based supply chain management system built on **Hyperledger Fabric** to provide **transparency**, **traceability**, and **trust** across stakeholders in the supply chain network.

## 🌟 Overview

This project simulates a multi-actor supply chain involving **Manufacturers**, **Distributors**, and **Retailers**, each playing a distinct role on a **permissioned blockchain**. All transactions are recorded immutably, enabling complete tracking of assets across the network.

## 🔧 Features

- ✅ Asset creation, transfer, and tracking
- ✅ Immutable transaction history
- ✅ Role-based access control
- ✅ Modular chaincode written in Node.js
- ✅ Frontend dashboard for interaction
- ✅ Containerized using Docker

## 🧱 Tech Stack

| Layer      | Technology                |
|------------|---------------------------|
| Blockchain | Hyperledger Fabric v2.x   |
| Backend    | Node.js (Fabric SDK)      |
| Chaincode  | Node.js                   |
| Frontend   | React                     |
| DevOps     | Docker, Docker Compose    |

## 🏗️ Architecture

![HL drawio](https://github.com/mpdn99/Supply-Chain-Hyperledger/assets/17932234/f4187a5d-0d07-45f2-a819-3e5731656c62)


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

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mpdn99/Supply-Chain-Hyperledger.git
cd Supply-Chain-Hyperledger
```
