package main

import (
	"fmt"
	"github.com/mpdn99/supply-chain-hyperledger/host1/application/web"
)

const (
	CryptoPath = "../../organizations/peerOrganizations/manufacturer.example.com"
)

func main() {
	orgConfig := web.OrgSetup{
		OrgName:      "Manufacturer",
		MSPID:        "ManufacturerMSP",
		CertPath:     CryptoPath + "/users/User1@manufacturer.example.com/msp/signcerts/User1@manufacturer.example.com-cert.pem",
		KeyPath:      CryptoPath + "/users/User1@manufacturer.example.com/msp/keystore/",
		TLSCertPath:  CryptoPath + "/peers/peer0.manufacturer.example.com/tls/ca.crt",
		PeerEndpoint: "localhost:7051",
		GatewayPeer:  "peer0.manufacturer.example.com",
	}

	orgSetup, err := web.Initialize(orgConfig)
	if err != nil {
		fmt.Println("Error initializing setup for Org1: ", err)
	}
	web.Serve(web.OrgSetup(*orgSetup))
}
