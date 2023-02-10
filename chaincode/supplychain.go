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

type UserInfo struct {
	Name         string `json:"Name`
	User_ID      string `json:"UserId"`
	Email        string `json:"Email"`
	UserType     string `json:"UserType"`
	Organization string `json:"Organization"`
	Address      string `json:"Address"`
}

type ProductPosition struct {
	Date            string   `json:"Date"`
	Organization    string   `json:"Organization"`
	Longtitude string `json:"Longtitude"`
	Latitude   string `json:"Latitude"`
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
	counterJSON, _ := ctx.GetStub().GetState(AssetType)
	counter := CounterNO{}

	json.Unmarshal(counterJSON, &counter)
	return counter.Counter
}

func incrementCounter(ctx contractapi.TransactionContextInterface, AssetType string) int {
	counterJSON, _ := ctx.GetStub().GetState(AssetType)
	counter := CounterNO{}

	json.Unmarshal(counterJSON, &counter)
	counter.Counter++
	counterJSON, _ = json.Marshal(counter)

	err := ctx.GetStub().PutState(AssetType, counterJSON)
	if err != nil {
		fmt.Sprintf("Failed to Increment Counter")
	}
	return counter.Counter
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
	userManufacturer := User{
		Name:         "Manufacturer Admin",
		User_ID:      "manufacturer-admin",
		UserType:     "admin",
		Organization: "ManufacturerOrg",
		Address:      "Hanoi",
		Password:     "admin@123",
	}

	userManufacturerJSON, err := json.Marshal(userManufacturer)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(userManufacturer.User_ID, userManufacturerJSON)
	if err != nil {
		return fmt.Errorf("Failed to put to world state. %s", err.Error())
	}

	//Init Distributor Admin Account
	userDistributor := User{
		Name:         "Distributor Admin",
		User_ID:      "distributor-admin",
		UserType:     "admin",
		Organization: "DistributorOrg",
		Address:      "Hanoi",
		Password:     "admin@123",
	}
	userDistributorJSON, err := json.Marshal(userDistributor)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(userDistributor.User_ID, userDistributorJSON)
	if err != nil {
		return fmt.Errorf("Failed to put to world state. %s", err.Error())
	}

	//Init Retailer Admin Account
	userRetailer := User{
		Name:         "Retailer Admin",
		User_ID:      "retailer-admin",
		UserType:     "admin",
		Organization: "RetailerOrg",
		Address:      "Hanoi",
		Password:     "admin@123",
	}
	userRetailerJSON, err := json.Marshal(userRetailer)
	if err != nil {
		return err
	}
	err = ctx.GetStub().PutState(userRetailer.User_ID, userRetailerJSON)
	if err != nil {
		return fmt.Errorf("Failed to put to world state. %s", err.Error())
	}

	return nil
}

func (t *Supplychain) SignIn(ctx contractapi.TransactionContextInterface, userID string, password string) (*User, error) {
	userJSON, err := ctx.GetStub().GetState(userID)
	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state. %s", err.Error())
	}
	if userJSON == nil {
		return nil, fmt.Errorf("Cannot find User %s", userID)
	}

	user := UserInfo{}
	err = json.Unmarshal(userJSON, &user)
	if err != nil {
		return nil, err
	}

	if user.Password != password {
		return fmt.Errorf("Incorrect password")
	}

	return user, nil
}

func (t *Supplychain) CreateProduct(ctx contractapi.TransactionContextInterface, name string, manufacturerID string, longtitude string, latitude string, price string) error {
	//Authentication
	id, err := cid.GetMSPID(ctx.GetStub())
	if err != nil {
		return err
	}
	if id != "ManufacturerMSP" {
		return fmt.Errorf("User must be Manufacturer")
	}

	//Add product
	priceAsFloat, err := strconv.ParseFloat(price, 64)
	if err != nil {
		return fmt.Errorf("Failed to convert price: %s", err.Error())
	}

	productCounter := getCounter(ctx, "ProductCounterNO")
	productCounter++

	txTimeAsPtr, err := t.GetTxTimestampChannel(ctx)
	if err != nil {
		return fmt.Errorf("Error in Transaction Timestamp")
	}
	postion := ProductPosition{}
	postion.Date = txTimeAsPtr
	postion.Longtitude = longtitude
	postion.Latitude = latitude
	postion.Organization = manufacturerID

	product := Product{
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
	productJSON, err := json.Marshal(product)
	if err != nil {
		return err
	}
	err = ctx.GetStub().PutState(product.Product_ID, productJSON)
	if err != nil {
		return fmt.Errorf("Failed to put to world state. %s", err.Error())
	}
	incrementCounter(ctx, "ProductCounterNO")

	return nil
}

func (t *Supplychain) UpdateProduct(ctx contractapi.TransactionContextInterface, productID string, name string, price string) error {
	//Authentication
	id, err := cid.GetMSPID(ctx.GetStub())
	if err != nil {
		return err
	}
	if id != "ManufacturerMSP" {
		return fmt.Errorf("User must be Manufacturer")
	}

	productJSON, err := ctx.GetStub().GetState(productID)
	if err != nil {
		return fmt.Errorf("Failed to read from world state. %s", err.Error())
	}
	if productJSON == nil {
		fmt.Errorf("Cannot find product %s", productID)
	}

	product := Product{}
	json.Unmarshal(productJSON, &product)

	if product.Distributor_ID != "" {
		return fmt.Errorf("Product has sent to Distributor. Cannot update")
	}

	//Update product
	priceAsFloat, err := strconv.ParseFloat(price, 64)
	if err != nil {
		return fmt.Errorf("Failed to convert price: %s", err.Error())
	}
	product.Name = name
	product.Price = priceAsFloat

	updatedProductJSON, err := json.Marshal(product)
	if err != nil {
		return err
	}
	ctx.GetStub().PutState(product.Product_ID, updatedProductJSON)

	return nil
}

func (t *Supplychain) SentToDistributor(ctx contractapi.TransactionContextInterface, productID string, distributorID string, longtitude string, latitude string) error {
	//Authentication
	id, err := cid.GetMSPID(ctx.GetStub())
	if err != nil {
		return err
	}
	if id != "DistributorMSP" {
		return fmt.Errorf("User must be Distributor")
	}

	productJSON, err := ctx.GetStub().GetState(productID)
	if err != nil {
		return fmt.Errorf("Failed to read from world state. %s", err.Error())
	}
	if productJSON == nil {
		fmt.Errorf("Cannot find product %s", productID)
	}

	product := Product{}
	json.Unmarshal(productJSON, &product)

	if product.Retailer_ID != "" {
		return fmt.Errorf("Product has sent to Retailer. Cannot update")
	}

	//Update product
	txTimeAsPtr, err := t.GetTxTimestampChannel(ctx)
	if err != nil {
		return fmt.Errorf("Error in Transaction Timestamp")
	}

	product.Distributor_ID = distributorID
	product.Positions = append(product.Positions, ProductPosition{Date: txTimeAsPtr, Latitude: latitude, Longtitude: longtitude , Organization: distributorID})

	updatedProductJSON, err := json.Marshal(product)
	if err != nil {
		return err
	}
	ctx.GetStub().PutState(product.Product_ID, updatedProductJSON)

	return nil
}

func (t *Supplychain) SentToRetailer(ctx contractapi.TransactionContextInterface, productID string, retailerID string, longtitude string, latitude string) error {
	//Authentication
	id, err := cid.GetMSPID(ctx.GetStub())
	if err != nil {
		return err
	}
	if id != "RetailerMSP" {
		return fmt.Errorf("User must be Retailer")
	}
	productJSON, err := ctx.GetStub().GetState(productID)
	if err != nil {
		return fmt.Errorf("Failed to read from world state. %s", err.Error())
	}
	if productJSON == nil {
		fmt.Errorf("Cannot find product %s", productID)
	}

	product := Product{}
	json.Unmarshal(productJSON, &product)

	if product.Consumer_ID != "" {
		return fmt.Errorf("Product has sent to Consumer. Cannot update")
	}

	//Update product
	txTimeAsPtr, err := t.GetTxTimestampChannel(ctx)
	if err != nil {
		return fmt.Errorf("Error in Transaction Timestamp")
	}

	product.Retailer_ID = retailerID
	product.Positions = append(product.Positions, ProductPosition{Date: txTimeAsPtr, Latitude: latitude, Longtitude: longtitude, Organization: retailerID})

	updatedProductJSON, err := json.Marshal(product)
	if err != nil {
		return err
	}
	ctx.GetStub().PutState(product.Product_ID, updatedProductJSON)

	return nil
}

func (t *Supplychain) SellToConsumer(ctx contractapi.TransactionContextInterface, productID string, consumerID string, longtitude string, latitude string) error {
	//Authentication
	id, err := cid.GetMSPID(ctx.GetStub())
	if err != nil {
		return err
	}
	if id != "RetailerMSP" {
		return fmt.Errorf("User must be Retailer")
	}

	//Update product
	productJSON, err := ctx.GetStub().GetState(productID)
	if err != nil {
		return fmt.Errorf("Failed to read from world state. %s", err.Error())
	}
	if productJSON == nil {
		fmt.Errorf("Cannot find product %s", productID)
	}

	product := Product{}
	json.Unmarshal(productJSON, &product)

	txTimeAsPtr, err := t.GetTxTimestampChannel(ctx)
	if err != nil {
		return fmt.Errorf("Error in Transaction Timestamp")
	}

	product.Consumer_ID = consumerID
	product.Positions = append(product.Positions, ProductPosition{Date: txTimeAsPtr, Latitude: latitude, Longtitude: longtitude, Organization: consumerID})
	product.Status = "Sold"

	updatedProductJSON, err := json.Marshal(product)
	if err != nil {
		return err
	}
	ctx.GetStub().PutState(product.Product_ID, updatedProductJSON)

	return nil
}

func (t *Supplychain) QueryProduct(ctx contractapi.TransactionContextInterface, productID string) (*Product, error) {
	productJSON, err := ctx.GetStub().GetState(productID)
	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if productJSON == nil {
		return nil, fmt.Errorf("%s does not exist", productID)
	}

	product := new(Product)
	err = json.Unmarshal(productJSON, product)
	if err != nil {
		return nil, err
	}
	return product, nil
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

		product := new(Product)
		_ = json.Unmarshal(queryResponse.Value, product)
		results = append(results, product)
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
