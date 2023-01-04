package main

import (
	"fmt"
	"github.com/mpdn99/supply-chain-hyperledger/host1/application/web"
)

const (
	CryptoPath = "../../organizations/peerOrganizations/distributor.example.com"
)

func main() {
	orgConfig := web.OrgSetup{
		OrgName:      "Distributor",
		MSPID:        "DistributorMSP",
		CertPath:     CryptoPath + "/users/User1@distributor.example.com/msp/signcerts/User1@distributor.example.com-cert.pem",
		KeyPath:      CryptoPath + "/users/User1@distributor.example.com/msp/keystore/",
		TLSCertPath:  CryptoPath + "/peers/peer0.distributor.example.com/tls/ca.crt",
		PeerEndpoint: "localhost:8051",
		GatewayPeer:  "peer0.distributor.example.com",
	}

	orgSetup, err := web.Initialize(orgConfig)
	if err != nil {
		fmt.Println("Error initializing setup for Org1: ", err)
	}
	web.Serve(web.OrgSetup(*orgSetup))
}
