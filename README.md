# Supply Chain Management System using Blockchain

# Object:
Today’s supply chains are global networks that generally include manufacturers, suppliers, logistics companies, and retailers that work together to deliver products to consumers. As modern supply chains continue to expand, they also are becoming more complex and disparate. Typically, traditional supply chains use paper based and disjointed data systems that lead to information silos and make tracking products a time consuming task. Lack of traceability and transparency is an industry-wide challenge that leads to delays, errors, and increased costs. Modern supply chain participants need a unified view of data, while still being able to independently and privately verify transactions such as production and transport updates.

Supply chain solutions built using Blockchain can provide the end-to-end visibility today’s supply chains need to track and trace their entire production process with increased automation efficiency.

# Participant(Organization) in this System:
 - Host 1: Manufacturer
 - Host 2: Distributor
 - Host 3: Retailer
 - Host 4: Customer

# Application Flow:
  - User are enroll into the application by Admin of Organization
  - The goods will be created by the Manufacturer only
  - Manufacturer will create Product
  - Product will be sent from Manufacturer to Distributor
  - Distributor will send it to Retailer
  - Customer trace production

# Network Details:
  - 4 Orgs(Manufacturer/Distributor/Retailer/Customer)
  - 4 Peers
  - RAFT Orderer(5 Orderer)

# Chaincode Functions:
  - signIn (user Login)
  - createProduct(Manufacturer)
  - updateProduct(Manufacturer)
  - sentToDistributor(Distributor)
  - sentToRetailer(Retailer)
  - sellToCustomer(Retailer)
  - QueryProduct(Query by Production ID)
  - QueryAllProducts(All)
