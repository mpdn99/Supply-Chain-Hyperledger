package main

import (
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/hyperledger/fabric-chaincode-go/pkg/cid"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type Supplychain struct {
	contractapi.Contract
}

type CounterNO struct {
	Counter int `json:"counter"`
}

type User struct {
	Name         string `json:"Name`
	User_ID      string `json:"UserId"`
	Email        string `json:"Email"`
	UserType     string `json:"UserType"`
	Organization string `json:"Organization"`
	Address      string `json:"Address"`
	Password     string `json:"Password"`
}

type Location struct {
	Longtitude float64 `json:"Longtitude"`
	Latitude   float64 `json:"Latitude"`
}

type ProductPosition struct {
	Date            string   `json:"Date"`
	ProductLocation Location `json:"Location"`
	Organization    string   `json:"Organization"`
}

type Product struct {
	Product_ID      string            `json:"ProductId"`
	Name            string            `json:"Name"`
	Manufacturer_ID string            `json:"Manufacturer"`
	Distributor_ID  string            `json:"Distributor"`
	Retailer_ID     string            `json:"Retailer"`
	Consumer_ID     string            `json:"Consumer"`
	Status          string            `json:"Status"`
	Positions       []ProductPosition `json:"Position"`
	Price           float64           `json:"Price"`
}

func getCounter(ctx contractapi.TransactionContextInterface, AssetType string) int {
	counterAsBytes, _ := ctx.GetStub().GetState(AssetType)
	counterAsset := CounterNO{}

	json.Unmarshal(counterAsBytes, &counterAsset)
	return counterAsset.Counter
}

func incrementCounter(ctx contractapi.TransactionContextInterface, AssetType string) int {
	counterAsBytes, _ := ctx.GetStub().GetState(AssetType)
	counterAsset := CounterNO{}

	json.Unmarshal(counterAsBytes, &counterAsset)
	counterAsset.Counter++
	counterAsBytes, _ = json.Marshal(counterAsset)

	err := ctx.GetStub().PutState(AssetType, counterAsBytes)
	if err != nil {
		fmt.Sprintf("Failed to Increment Counter")
	}
	return counterAsset.Counter
}

func (t *Supplychain) GetTxTimestampChannel(ctx contractapi.TransactionContextInterface) (string, error) {
	txTimeAsPtr, err := ctx.GetStub().GetTxTimestamp()
	if err != nil {
		return "Error", err
	}
	timeStr := time.Unix(txTimeAsPtr.Seconds, int64(txTimeAsPtr.Nanos)).String()

	return timeStr, nil
}

func (t *Supplychain) InitLedger(ctx contractapi.TransactionContextInterface) error {

	//Init Manufacturer Admin Account
	entityUserManufacturer := User{
		Name:         "Manufacturer Admin",
		User_ID:      "manufacturer-admin",
		UserType:     "admin",
		Organization: "ManufacturerOrg",
		Address:      "Hanoi",
		Password:     "admin@123",
	}
	entityUserAsBytesManufacturer, _ := json.Marshal(entityUserManufacturer)
	errManufacturer := ctx.GetStub().PutState(entityUserManufacturer.User_ID, entityUserAsBytesManufacturer)
	if errManufacturer != nil {
		return errManufacturer
	}

	//Init Distributor Admin Account
	entityUserDistributor := User{
		Name:         "Distributor Admin",
		User_ID:      "distributor-admin",
		UserType:     "admin",
		Organization: "DistributorOrg",
		Address:      "Hanoi",
		Password:     "admin@123",
	}
	entityUserAsBytesDistributor, _ := json.Marshal(entityUserDistributor)
	errDistributor := ctx.GetStub().PutState(entityUserDistributor.User_ID, entityUserAsBytesDistributor)
	if errDistributor != nil {
		return errDistributor
	}

	//Init Retailer Admin Account
	entityUserRetailer := User{
		Name:         "Retailer Admin",
		User_ID:      "retailer-admin",
		UserType:     "admin",
		Organization: "RetailerOrg",
		Address:      "Hanoi",
		Password:     "admin@123",
	}
	entityUserAsBytesRetailer, _ := json.Marshal(entityUserRetailer)
	errRetailer := ctx.GetStub().PutState(entityUserRetailer.User_ID, entityUserAsBytesRetailer)
	if errRetailer != nil {
		return errRetailer
	}

	return nil
}

func (t *Supplychain) SignIn(ctx contractapi.TransactionContextInterface, userID string, password string) error {
	entityUserBytes, _ := ctx.GetStub().GetState(userID)
	if entityUserBytes == nil {
		return fmt.Errorf("Cannot find User %s", userID)
	}
	entityUser := User{}

	json.Unmarshal(entityUserBytes, &entityUser)

	if entityUser.Password != password {
		return fmt.Errorf("Password is wrong")
	}
	return nil
}

func (t *Supplychain) createUser(ctx contractapi.TransactionContextInterface, name string, userID string, organization string, email string, address string, password string) error {
	entityUser := User{
		Name:         name,
		User_ID:      userID,
		UserType:     "client",
		Organization: "customer",
		Email:        email,
		Password:     password,
	}
	entityUserAsBytes, _ := json.Marshal(entityUser)

	ctx.GetStub().PutState(entityUser.User_ID, entityUserAsBytes)

	return nil
}

func (t *Supplychain) CreateProduct(ctx contractapi.TransactionContextInterface, userID string, productID string, name string, manufacturerID string, location Location, price string) error {
	//Authentication
	id, err := cid.GetMSPID(ctx.GetStub())
	if err != nil {
		return err
	}
	if id != "ManufacturerMSP" {
		return fmt.Errorf("User must be Manufacturer")
	}

	//Add product
	priceAsFloat, errPrice := strconv.ParseFloat(price, 64)
	if errPrice != nil {
		return fmt.Errorf("Failed to convert price: %s", errPrice.Error())
	}

	productCounter := getCounter(ctx, "ProductCounterNO")
	productCounter++

	txTimeAsPtr, errTx := t.GetTxTimestampChannel(ctx)
	if errTx != nil {
		return fmt.Errorf("Error in Transaction Timestamp")
	}
	postion := ProductPosition{}
	postion.Date = txTimeAsPtr
	postion.ProductLocation = location
	postion.Organization = "Manufacturer"

	entityProduct := Product{
		Product_ID:      "Product" + strconv.Itoa(productCounter),
		Name:            name,
		Manufacturer_ID: manufacturerID,
		Distributor_ID:  "",
		Retailer_ID:     "",
		Consumer_ID:     "",
		Status:          "Available",
		Positions:       []ProductPosition{postion},
		Price:           priceAsFloat,
	}
	entityProductAsBytes, _ := json.Marshal(entityProduct)
	ctx.GetStub().PutState(entityProduct.Product_ID, entityProductAsBytes)
	incrementCounter(ctx, "ProductCounterNO")

	return nil
}

func (t *Supplychain) updateProduct(ctx contractapi.TransactionContextInterface, userID string, productID string, name string, price string) error {
	//Authentication
	id, err := cid.GetMSPID(ctx.GetStub())
	if err != nil {
		return err
	}
	if id != "ManufacturerMSP" {
		return fmt.Errorf("User must be Manufacturer")
	}

	entityProductAsBytes, _ := ctx.GetStub().GetState(productID)
	if entityProductAsBytes == nil {
		fmt.Errorf("Cannot find product %s", productID)
	}

	entityProduct := Product{}
	json.Unmarshal(entityProductAsBytes, &entityProduct)

	if entityProduct.Distributor_ID != "" {
		return fmt.Errorf("Product has sent to Distributor. Cannot update")
	}

	//Update product
	priceAsFloat, errPrice := strconv.ParseFloat(price, 64)
	if errPrice != nil {
		return fmt.Errorf("Failed to convert price: %s", errPrice.Error())
	}
	entityProduct.Name = name
	entityProduct.Price = priceAsFloat

	updatedProductAsBytes, _ := json.Marshal(entityProduct)
	ctx.GetStub().PutState(entityProduct.Product_ID, updatedProductAsBytes)

	return nil
}

func (t *Supplychain) sentToDistributor(ctx contractapi.TransactionContextInterface, productID string, distributorID string, location Location) error {
	//Authentication
	id, err := cid.GetMSPID(ctx.GetStub())
	if err != nil {
		return err
	}
	if id == "DistributorMSP" {
		return fmt.Errorf("User must be Distributor")
	}

	entityProductAsBytes, _ := ctx.GetStub().GetState(productID)
	if entityProductAsBytes == nil {
		fmt.Errorf("Cannot find product %s", productID)
	}

	entityProduct := Product{}
	json.Unmarshal(entityProductAsBytes, &entityProduct)

	if entityProduct.Retailer_ID != "" {
		return fmt.Errorf("Product has sent to Retailer. Cannot update")
	}

	//Update product
	txTimeAsPtr, errTx := t.GetTxTimestampChannel(ctx)
	if errTx != nil {
		return fmt.Errorf("Error in Transaction Timestamp")
	}

	entityProduct.Distributor_ID = distributorID
	entityProduct.Positions = append(entityProduct.Positions, ProductPosition{Date: txTimeAsPtr, ProductLocation: location, Organization: "Distributor"})

	updatedProductAsBytes, _ := json.Marshal(entityProduct)
	ctx.GetStub().PutState(entityProduct.Product_ID, updatedProductAsBytes)

	return nil
}

func (t *Supplychain) sentToRetailer(ctx contractapi.TransactionContextInterface, productID string, retailerID string, location Location) error {
	//Authentication
	id, err := cid.GetMSPID(ctx.GetStub())
	if err != nil {
		return err
	}
	if id == "RetailerMSP" {
		return fmt.Errorf("User must be Retailer")
	}
	entityProductAsBytes, _ := ctx.GetStub().GetState(productID)
	if entityProductAsBytes == nil {
		fmt.Errorf("Cannot find product %s", productID)
	}

	entityProduct := Product{}
	json.Unmarshal(entityProductAsBytes, &entityProduct)

	if entityProduct.Consumer_ID != "" {
		return fmt.Errorf("Product has sent to Consumer. Cannot update")
	}

	//Update product
	txTimeAsPtr, errTx := t.GetTxTimestampChannel(ctx)
	if errTx != nil {
		return fmt.Errorf("Error in Transaction Timestamp")
	}

	entityProduct.Retailer_ID = retailerID
	entityProduct.Positions = append(entityProduct.Positions, ProductPosition{Date: txTimeAsPtr, ProductLocation: location, Organization: "Retailer"})

	updatedProductAsBytes, _ := json.Marshal(entityProduct)
	ctx.GetStub().PutState(entityProduct.Product_ID, updatedProductAsBytes)

	return nil
}

func (t *Supplychain) sellToConsumer(ctx contractapi.TransactionContextInterface, productID string, consumerID string, location Location) error {
	//Authentication
	id, err := cid.GetMSPID(ctx.GetStub())
	if err != nil {
		return err
	}
	if id == "RetailerMSP" {
		return fmt.Errorf("User must be Retailer")
	}

	//Update product
	entityProductAsBytes, _ := ctx.GetStub().GetState(productID)
	if entityProductAsBytes == nil {
		fmt.Errorf("Cannot find product %s", productID)
	}

	entityProduct := Product{}
	json.Unmarshal(entityProductAsBytes, &entityProduct)

	txTimeAsPtr, errTx := t.GetTxTimestampChannel(ctx)
	if errTx != nil {
		return fmt.Errorf("Error in Transaction Timestamp")
	}

	entityProduct.Consumer_ID = consumerID
	entityProduct.Positions = append(entityProduct.Positions, ProductPosition{Date: txTimeAsPtr, ProductLocation: location, Organization: "Consumer"})
	entityProduct.Status = "Sold"

	updatedProductAsBytes, _ := json.Marshal(entityProduct)
	ctx.GetStub().PutState(entityProduct.Product_ID, updatedProductAsBytes)

	return nil
}

func (t *Supplychain) QueryProduct(ctx contractapi.TransactionContextInterface, productID string) (*Product, error) {
	entityProductAsBytes, err := ctx.GetStub().GetState(productID)
	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if entityProductAsBytes == nil {
		return nil, fmt.Errorf("%s does not exist", productID)
	}

	entityProduct := new(Product)
	_ = json.Unmarshal(entityProductAsBytes, entityProduct)
	return entityProduct, nil
}

func (t *Supplychain) QueryAllProducts(ctx contractapi.TransactionContextInterface) ([]*Product, error) {
	startKey := "PRODUCT0"
	endKey := "PRODUCT999"

	resultsIterator, err := ctx.GetStub().GetStateByRange(startKey, endKey)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	results := []*Product{}
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		entityProduct := new(Product)
		_ = json.Unmarshal(queryResponse.Value, entityProduct)
		results = append(results, entityProduct)
	}

	return results, nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(new(Supplychain))
	if err != nil {
		fmt.Printf("Error create supplychain chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting supplychain chaincode: %s", err.Error())
	}
}
