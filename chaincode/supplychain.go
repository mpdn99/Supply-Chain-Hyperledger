package main

import (
	"encoding/json"
	"fmt"
	"strconv"
	"errors"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type Supplychain struct {
	contractapi.Contract
}

type CounterNO struct {
	Counter int `json:"counter"`
}

type User struct {
	Name string `json:"Name`
	User_ID string `json:"UserId"`
	Email string `json:"Email"`
	UserType string `json:"UserType"`
	Organization string `json:"Organization"`
	Address string `json:"Address"`
	Password string `json:"Password"`
}

type ProductDate struct {
	ManufactureDate string `json:"ManufactureDate"`
	SendToDistributorDate string `json:"SendToDistributorDate"`
	SendToRetailerDate string `json:"SendToRetailerDate"`
	SellToConsumerDate string `json:"SellToConsumerDate"`
}

type Product struct {
	Product_ID string `json:"productId"`
	Name string`json:"Name"`
	Manufacturer_ID string `json:"Manufacturer"`
	Distributor_ID string `json:"Distributor"`
	Retailer_ID string `json:"Retailer"`
	Consumer_ID string `json:"Consumer"`
	Status string `json:"Status"`
	Price float64 `json:"Price"`
}

func getCounter(ctx contractapi.TransactionContextInterface, AssetType string) int {
	counterAsBytes, _ := ctx.GetStub().GetState(AssetType)
	counterAsset := CounterNO{}

	json.Unmarshal(counterAsBytes, &counterAsset)
	return counterAsset.Counter;
}

func incrementCounter(ctx contractapi.TransactionContextInterface, AssetType string) int {
	counterAsBytes, _ := ctx.GetStub().GetState(AssetType)
	counterAsset := CounterNO{}

	json.Unmarshal(counterAsBytes, &counterAsset)
	counterAsset.Counter++;
	counterAsBytes, _ = json.Marshal(counterAsset)

	err := ctx.GetStub().PutState(AssetType, counterAsBytes)
	if err != nil {
		fmt.Sprintf("Failed to Increment Counter")
	}
	return counterAsset.Counter
}

func (t *Supplychain) InitLedger(ctx contractapi.TransactionContextInterface) error {

	//Init Manufacturer Admin Account
	entityUserManufacturer := User{
		Name: "Manufacturer Admin", 
		User_ID: "manufacturer-admin", 
		UserType: "admin", 
		Organization: "ManufacturerOrg",
		Address:"Hanoi", 
		Password: "admin@123",
	}
	entityUserAsBytesManufacturer, _ := json.Marshal(entityUserManufacturer)
	errManufacturer := ctx.GetStub().PutState(entityUserManufacturer.User_ID, entityUserAsBytesManufacturer)
	if errManufacturer != nil {
		return errManufacturer
	}

	//Init Distributor Admin Account
	entityUserDistributor := User{
		Name: "Distributor Admin", 
		User_ID: "distributor-admin", 
		UserType: "admin", 
		Organization: "DistributorOrg",
		Address:"Hanoi", 
		Password: "admin@123",
	}
	entityUserAsBytesDistributor, _ := json.Marshal(entityUserDistributor)
	errDistributor := ctx.GetStub().PutState(entityUserDistributor.User_ID, entityUserAsBytesDistributor)
	if errDistributor != nil {
		return errDistributor
	}

	//Init Retailer Admin Account
	entityUserRetailer := User{
		Name: "Retailer Admin", 
		User_ID: "retailer-admin", 
		UserType: "admin", 
		Organization: "RetailerOrg",
		Address:"Hanoi", 
		Password: "admin@123",
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

func (t *Supplychain) createUser(ctx contractapi.TransactionContextInterface, )

func (t *Supplychain) CreateProduct(ctx contractapi.TransactionContextInterface, productID string, name string, manufacturerID string, price string) error {
	priceAsFloat, errPrice := strconv.ParseFloat(price, 64)
	if errPrice != nil {
		return fmt.Errorf("Failed to convert price: %s", errPrice.Error())
	}

	productCounter := getCounter(ctx, "ProductCounterNO")
	productCounter++

	entityProduct := Product{
		Product_ID: "Product" + strconv.Itoa(productCounter),
		Name: name,
		Manufacturer_ID: manufacturerID,
		Distributor_ID: "",
		Retailer_ID: "",
		Consumer_ID: "",
		Status: "Available",
		Price: priceAsFloat,
	}

	entityProductAsBytes, _ := json.Marshal(entityProduct)
	
	ctx.GetStub().PutState(entityProduct.Product_ID, entityProductAsBytes)

	incrementCounter(ctx, "ProductCounterNO")

	return nil
}