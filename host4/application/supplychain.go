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
	mspID		= "CustomerMSP"
cryptoPath	= "../organizations/peerOrganizations/customer.example.com"
	certPath = cryptoPath + "/users/User1@customer.example.com/msp/signcerts/User1@customer.example.com-cert.pem"
	keyPath = cryptoPath + "/users/User1@customer.example.com/msp/keystore/"
	tlsCertPath = cryptoPath + "/peers/peer0.customer.example.com/tls/ca.crt"
	peerEndpoint = "localhost:10051"
	gatewayPeer = "peer0.customer.example.com"
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

	fmt.Println("queryProduct:")
	queryProduct(contract)

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

func queryProduct(contract *client.Contract){
	result, err := contract.EvaluateTransaction("QueryProduct", "Product1")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(result))
}
