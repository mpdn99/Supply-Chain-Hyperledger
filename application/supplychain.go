package main

import(
	"bytes"
	"context"
	"crypto/x509"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"os"
	"path"
	"time"


	"github.com/hyperledger/fabric-gateway/pkg/client"
	"github.com/hyperledger/fabric-gateway/pkg/identity"
	"github.com/hyperledger/fabric-protos-go-apiv2/gateway"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/status"
)

const (
	mspID		= "ManufacturerMSP"
	cryptoPath	= "../organizations/peerOrganizations/manufacturer.example.com"
	certPath = path.Join(cryptoPath, "/users/User1@manufacturer.example.com/msp/signcerts/certificate.pem")
	keyPath = path.Join(cryptoPath, "/user/User1@manufacturer.example.com/msp/keystore/priv_sk")
	tlsCertPath = path.Join(cryptoPath, "/peers/peer0.manufacturer.example.com/tls/ca.crt")
	peerEndpoint = "localhost:7051"
	gatewayPeer = "peer0.manufacturer.example.com"
	channelName = "supplychain"
	chaincodeName = "supplychain"
)

func main(){
	log.Println("Starting application...")
	clientCoonection := newGrpcConnection()
	defer clientCoonection.Close()

	id := newIdentity()
	sign := newSign()

	gw, err := client.Connect(
		id,
		client.WithSign(sign),
		client.WithClientConnection(clientCoonection),
		client.WithEvaluateTimeout(5*time.Second),
		client.WithEndorseTimeout(15*time.Second),
		client.WithSubmitTimeout(5*time.Second),
		client.WithCommitStatusTimeout(1*time.Minute),
	)
	if err != nil {
		panic(err)
	}
	defer gw.Close()

	network := gw.GetNetwork(channelName)
	contract := network.GetContract(chaincodeName)

	fmt.Println("initLedger:")
	initLedger(contract)

	fmt.Println("signIn:")
	signIn(contract)

	fmt.Println("createUser:")
	createUser(contract)

	fmt.Println("createProduct:")
	createProduct(contract)

	fmt.Println("updateProduct:")
	updateProduct(contract)

	fmt.Println("sentToDistributor:")
	sentToDistributor(contract)

	fmt.Println("sentToRetailer:")
	sentToRetailer(contract)

	fmt.Println("sellToConsumer:")
	sellToConsumer(contract)

	fmt.Println("queryProduct:")
	queryProduct(contract)

	fmt.Println("queryAllProducts:")
	queryAllProducts(contract)

	log.Println("Application finished.")
}

func newGrpcConnection() *grpc.ClientConn {
	certificate, err := os.loadCertificate(tlsCertPath)
	if err != nil {
		panic(err)
	}

	certPool := x509.NewCertPool()

	certPool.AddCert(certificate)

	creds := credentials.NewClientTLSFromCert(certPool, "")

	connection, err := grpc.Dial(peerEndpoint, grpc.WithTransportCredentials(creds))
	if err != nil {
		panic(err)
	}

	return connection
}

func newIdentity() identity.SigningIdentity {
	certificate, err := os.ReadFile(certPath)
	if err != nil {
		panic(err)
	}

	id, err := identity.NewX509Identity(mspID, certificate)
	if err != nil {
		panic(err)
	}

	return id
}

func loadCertificate(filename string) (*x509.Certificate, error) {
	certificatePEM, err := os.ReadFile(filename)
	if err != nil {
		return nil, fmt.Errorf("failed to read certificate file: %w", err)
	}
	return identity.CertificateFromPEM(certificatePEM)
}

func newSign() identity.Sign {
	files, err := os.ReadDir(keyPath)
	if err != nil {
		panic(fmt.Errorf("failed to read private key directory: %w", err))
	}
	privateKeyPEM, err := os.ReadFile(path.Join(keyPath, files[0].Name()))

	if err != nil {
		panic(fmt.Errorf("failed to read private key file: %w", err))
	}

	privateKey, err := identity.PrivateKeyFromPEM(privateKeyPEM)
	if err != nil {
		panic(err)
	}

	sign, err := identity.NewPrivateKeySign(privateKey)
	if err != nil {
		panic(err)
	}
	return sign
}

funtion initLedger(contract *client.Contract){
	result, err := contract.SubmitTransaction("InitLedger")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(result))
}

funtion signIn(contract *client.Contract){
	result, err := contract.SubmitTransaction("SignIn")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(result))
}

funtion createUser(contract *client.Contract){
	result, err := contract.SubmitTransaction("CreateUser")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(result))
}

funtion createProduct(contract *client.Contract){
	result, err := contract.SubmitTransaction("CreateProduct")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(result))
}

funtion updateProduct(contract *client.Contract){
	result, err := contract.SubmitTransaction("UpdateProduct")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(result))
}

funtion sentToDistributor(contract *client.Contract){
	result, err := contract.SubmitTransaction("SentToDistributor")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(result))
}

funtion sentToRetailer(contract *client.Contract){
	result, err := contract.SubmitTransaction("SentToRetailer")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(result))
}

funtion sellToConsumer(contract *client.Contract){
	result, err := contract.SubmitTransaction("SellToConsumer")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(result))
}

funtion queryProduct(contract *client.Contract){
	result, err := contract.EvaluateTransaction("QueryProduct")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(result))
}

funtion queryAllProducts(contract *client.Contract){
	result, err := contract.EvaluateTransaction("QueryAllProducts")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(result))
}

func formatJSON(data []byte) string {
	var prettyJSON bytes.Buffer
	err := json.Indent(&prettyJSON, data, "", ""); if err != nil {
		panic(err)
	}
	return prettyJSON.String()
}