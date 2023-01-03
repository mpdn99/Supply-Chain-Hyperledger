package main

import(
	"crypto/x509"
	"fmt"
	"log"
	"os"
	"path"
	"time"


	"github.com/hyperledger/fabric-gateway/pkg/client"
	"github.com/hyperledger/fabric-gateway/pkg/identity"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
)

const (
	mspID		= "ManufacturerMSP"
	cryptoPath	= "../organizations/peerOrganizations/manufacturer.example.com"
	certPath = cryptoPath + "/users/User1@manufacturer.example.com/msp/signcerts/User1@manufacturer.example.com-cert.pem"
	keyPath = cryptoPath + "/users/User1@manufacturer.example.com/msp/keystore/"
	tlsCertPath = cryptoPath + "/peers/peer0.manufacturer.example.com/tls/ca.crt"
	peerEndpoint = "localhost:7051"
	gatewayPeer = "peer0.manufacturer.example.com"
	channelName = "supplychain"
	chaincodeName = "supplychain"
)

func main(){
	log.Println("Starting application...")
	newGrpcConnection()
	clientConection := newGrpcConnection()
	defer clientConection.Close()

	id := newIdentity()
	sign := newSign()

	gw, err := client.Connect(
		id,
		client.WithSign(sign),
		client.WithClientConnection(clientConection),
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
	certificate, err := loadCertificate(tlsCertPath)
	if err != nil {
		panic(err)
	}

	certPool := x509.NewCertPool()

	certPool.AddCert(certificate)

	transportCredentials := credentials.NewClientTLSFromCert(certPool, gatewayPeer)

	connection, err := grpc.Dial(peerEndpoint, grpc.WithTransportCredentials(transportCredentials))
	if err != nil {
		panic(fmt.Errorf("failed to create gRPC connection: %w", err))
	}

	return connection
}

func newIdentity() *identity.X509Identity {
	certificate, err := loadCertificate(certPath)
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

func initLedger(contract *client.Contract){
	fmt.Printf("Submit Transaction: InitLedger, function creates the initial set of assets on the ledger \n")

	_, err := contract.SubmitTransaction("InitLedger")
	if err != nil {
		panic(fmt.Errorf("failed to submit transaction: %w", err))
	}

	fmt.Printf("*** Transaction committed successfully\n")
}

func signIn(contract *client.Contract){
	result, err := contract.SubmitTransaction("SignIn", "manufacturer-admin", "admin@123")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(result))
}

func createProduct(contract *client.Contract){
	result, err := contract.SubmitTransaction("CreateProduct", "Bia Saigon", "Sabeco", "121", "122", "12000")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(result))
}

func updateProduct(contract *client.Contract){
	result, err := contract.SubmitTransaction("UpdateProduct", "Product1", "Bia 333", "12000")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(result))
}

func sentToDistributor(contract *client.Contract){
	result, err := contract.SubmitTransaction("SentToDistributor", "Product1", "Shoppe", "125", "125")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(result))
}

func sentToRetailer(contract *client.Contract){
	result, err := contract.SubmitTransaction("SentToRetailer", "Product1", "CircleK", "128", "128")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(result))
}

func sellToConsumer(contract *client.Contract){
	result, err := contract.SubmitTransaction("SellToConsumer", "Product1", "0971026710", "130", "130")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(result))
}

func queryProduct(contract *client.Contract){
	result, err := contract.EvaluateTransaction("QueryProduct", "Product1")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(result))
}

func queryAllProducts(contract *client.Contract){
	result, err := contract.EvaluateTransaction("QueryAllProducts")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(result))
}