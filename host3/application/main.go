package main

import (
	"fmt"
	"github.com/mpdn99/supply-chain-hyperledger/host1/application/web"
)

const (
	CryptoPath = "../../organizations/peerOrganizations/retailer.example.com"
)

func main() {
	orgConfig := web.OrgSetup{
		OrgName:      "Retailer",
		MSPID:        "RetailerMSP",
		CertPath:     CryptoPath + "/users/User1@retailer.example.com/msp/signcerts/User1@retailer.example.com-cert.pem",
		KeyPath:      CryptoPath + "/users/User1@retailer.example.com/msp/keystore/",
		TLSCertPath:  CryptoPath + "/peers/peer0.retailer.example.com/tls/ca.crt",
		PeerEndpoint: "localhost:9051",
		GatewayPeer:  "peer0.retailer.example.com",
	}

	orgSetup, err := web.Initialize(orgConfig)
	if err != nil {
		fmt.Println("Error initializing setup for Org1: ", err)
	}
	web.Serve(web.OrgSetup(*orgSetup))
}
