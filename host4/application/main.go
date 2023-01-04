package main

import (
	"fmt"

	"github.com/mpdn99/supply-chain-hyperledger/host1/application/web"
)

const (
	CryptoPath = "../../organizations/peerOrganizations/customer.example.com"
)

func main() {
	orgConfig := web.OrgSetup{
		OrgName:      "Customer",
		MSPID:        "CustomerMSP",
		CertPath:     CryptoPath + "/users/User1@customer.example.com/msp/signcerts/User1@customer.example.com-cert.pem",
		KeyPath:      CryptoPath + "/users/User1@customer.example.com/msp/keystore/",
		TLSCertPath:  CryptoPath + "/peers/peer0.customer.example.com/tls/ca.crt",
		PeerEndpoint: "localhost:10051",
		GatewayPeer:  "peer0.customer.example.com",
	}

	orgSetup, err := web.Initialize(orgConfig)
	if err != nil {
		fmt.Println("Error initializing setup for Org1: ", err)
	}
	web.Serve(web.OrgSetup(*orgSetup))
}
