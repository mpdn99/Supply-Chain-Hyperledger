package application

import (
	"fmt"
	"./web"
)

const (
	CryptoPath = "../../organizations/peerOrganizations/manufacturer.example.com"
)

func main() {
	orgConfig := web.OrgSetup{
		mspID:        "ManufacturerMSP",
		certPath:     CryptoPath + "/users/User1@manufacturer.example.com/msp/signcerts/User1@manufacturer.example.com-cert.pem",
		keyPath:      CryptoPath + "/users/User1@manufacturer.example.com/msp/keystore/",
		tlsCertPath:  CryptoPath + "/peers/peer0.manufacturer.example.com/tls/ca.crt",
		peerEndpoint: "localhost:7051",
		gatewayPeer:  "peer0.manufacturer.example.com",
	}

	orgSetup, err := web.Initialize(orgConfig)
	if err != nil {
		fmt.Println("Error initializing setup for Org1: ", err)
	}
	web.Serve(web.OrgSetup(*orgSetup))
}
