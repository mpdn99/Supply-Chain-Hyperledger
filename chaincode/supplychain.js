const shim = require('fabric-shim');
const util = require('util');

let SupplyChain = class {
    async Init(stub) {
        let productCounterBytes = await stub.getState('ProductCounterNo');
        if(!productCounterBytes) {
            let counter = 0
            try {
                await stub.putState('ProductCounterNo', Buffer.from(JSON.stringify(counter)));
            } catch {
                return shim.error('Failed to Initiate Product Counter');
            }
        }

        let orderCounterBytes = await stub.getState('OrderCounterNo');
        if(!orderCounterBytes) {
            let counter = 0
            try {
                await stub.putState('OrderCounterNo', Buffer.from(JSON.stringify(counter)));
            } catch {
                return shim.error('Failed to Initiate Order Counter');
            }
        }

        let userCounterBytes = await stub.getState('UserCounterNo');
        if(!userCounterBytes) {
            let counter = 0
            try {
                await stub.putState('UserCounterNo', Buffer.from(JSON.stringify(counter)));
            } catch {
                return shim.error('Failed to Initiate User Order Counter');
            }
        }
        console.info('=========== Instantiated SupplyChain Chaincode ===========');
        return shim.success();
    }

    async Invoke(stub) {
        let ret = stub.getFunctionAndParameters();
        let method = this[ret.fcn];
        if(!method) {
            console.log('No function of name: ' + + ret.fcn + ' found');
            return shim.success();
        }
        try {
            let payload = await method(stub, ret.params, this);
            return shim.success(payload);
        } catch (err) {
            console.log(err);
            return shim.error(err);
        }
    }

    async getCounter(stub, assetType) {
        let counterAsBytes = await stub.getState(assetType);
        return counterAsBytes;
    }

    async incrementCounter(stub, assetType) {
        let counterAsBytes = await stub.getState(assetType);
        counterAsBytes++;
        try {
            await stub.putState(assetType, counterAsBytes);
        } catch {
            throw new Error('Failed to Increment Counter');
        }
        return counterAsBytes;
    }

    async getTxTimestampChannel(stub) {
        try {
            return txTimeAsPtr = stub.getTxTimestamp();
        } catch (err) {
            throw new Error('Returning Error in TimeStamp');
        }
    }

    async initLedger(stub, args) {
        const entityUser = {
            name: 'admin',
            user_id: 'admin',
            email: 'mpdn99@google.com',
            user_type: 'admin',
            address: 'hanoi',
            password: 'adminpw'
        }
        try {
            stub.putState(entityUser.user_id, entityUser);
        } catch (error) {
            shim.error('Failed to create Entity Asset: ' + entityUser.user_id);
        }
        console.log('Added' + entityUser);
         return shim.success();
    }

    async signIn(stub, args) {
        try {
            let entityUserBytes = stub.getState(args[0]);
            if(entityUserBytes.password != args[1]) {
                return shim.error('Either id or password is wrong');
            }   
        } catch (error) {
            return shim.error('Cannot find Entity');
        }
        return shim.success(entityUserBytes);
    }

    async createUser(stub, args) {
        if(args.length != 5){
            return shim.error('Incorrect number of arguments, require 5 arguments');
        }

        if(args[0].length == 0){
            return shim.error('Name must be provided to register user');
        }

        if(args[1].length == 0){
            return shim.error('Email is mandatory');
        }

        if(args[2].length == 0){
            return shim.error('User type must be specified');
        }

        if(args[3].length == 0){
            return shim.error('Address must be non-empty');
        }

        if(args[4].length == 0){
            return shim.error('Password must be non-empty');
        }

        let userCounter = this.getCounter(stub, 'UserCounterNo');
        userCounter ++;

        let User = {
            name: args[0],
            user_id: 'User' + userCounter,
            email: args[1],
            user_type: args[2],
            address: args[3],
            password: args[4]
        }

        try {
            stub.putState(User.user_id, User);
            this.incrementCounter(stub, 'UserCounterNo');
        } catch (error) {
            return shim.error('Failed to register user: ' + User.user_id);
        }
        return shim.success(User);
    }

    async createProduct(stub, args){
        if(args.length != 3){
            return shim.error('Incorrect number of arguments, require 3 arguments');
        }

        if(args[0].length == 0){
            return shim.error('Name must be provided to create a product');
        }

        if(args[1].length == 0){
            return shim.error('Manufacturer_id must be provided');
        }

        if(args[2].length){
            return shim.error('Price must be non-empty');
        }

        userBytes = stub.getState(args[1]);
        if(!userBytes){
            return shim.error('Cannot find user');
        }
        if(userBytes.user_type != 'manufacturer'){
            return shim.error('User type must be manufacturer');
        }

        let productCounter = this.getCounter(stub, 'ProductCounterNo');
        productCounter ++;

        const txTimeAsPtr = this.getTxTimestampChannel(stub);
        let dates = {
            manufacturerDate: txTimeAsPtr
        }
        let comAsset = {
            product_id: 'Product' + productCounter,
            order_id: '',
            name: args[0],
            supplier_id: '',
            manufacturer: args[1],
            distributor: '',
            retailer: '',
            customer: '',
            status: 'Available',
            date: dates,
            price: args[2]
        }

        try {
            stub.putState(comAsset.product_id, comAsset);
            console.log('Success in creating Product Asset ' + comAsset);
        } catch (error) {
            return shim.error('Failed to create Product Asset: ' + comAsset.product_id);
        }
        return shim.success(comAsset);
    }

    async updateProduct(stub, args){
        if(args.length != 4){
            return shim.error('Incorrect number of arguments, required 4');
        }

        if(args[0].length == 0){
            return shim.error('Product Id must be provided');
        }

        if(args[1].length == 0){
            return shim.error('User Id must be provided');
        }

        if(args[2].length == 0){
            return shim.error('Product name must be provided');
        }

        if(args[3].length == 0){
            return shim.error('Product price must be provided');
        }

        userBytes = stub.getState(args[1]);
        if(!userBytes){
            return shim.error('Cannot find user');
        }

        if (userBytes.user_type == 'customer'){
            return shim.error('User type cannot be customer');
        }

        let productBytes = stub.getState(args[0])
        if(!productBytes){
            return shim.error('Cannot find Product');
        }
        productBytes.name = args[2];
        productBytes.price = args[3];

        try {
            stub.putState(productBytes.product_id, productBytes);
            console.log('Success in updating Product ' , + productBytes.product_id);
        } catch (error) {
            return shim.error('Failed to update product ' + productBytes.product_id);
        }
        return shim.success(productBytes);
    }

    async orderProduct(stub, args){
        if(args.length != 2){
            return shim.error("Incorrect number of arguments, required 2");
        }
        if(args[0].length != 0){
            return shim.error("Customer id must be provided");
        }
        if(args[1].length !=0){
            return shim.error("Product id must be provided");
        }
        let userBytes = stub.getState(args[0]);
        if(!userBytes){
            return shim.error('Cannot find customer');
        }
        if(userBytes.user_type != "customer"){
            return shim.error('User type must be customer');
        }
        let productBytes = stub.getState(args[1]);
        if(!productBytes){
            return shim.error('Cannot find product');
        }
        let orderCounter = this.getCounter(stub, "OrderCounterNo");
        orderCounter++;
        let txTimeAsPtr = this.getTxTimestampChannel(stub)
        productBytes.order_id = "Order" + orderCounter;
        productBytes.customer_id = userBytes.user_id;
        productBytes.status = "Ordered";
        productBytes.date.orderedDate = txTimeAsPtr;

        this.incrementCounter(stub, "OrderCounterNo");
        try {
            stub.putState(productBytes.product_id, productBytes);
        } catch (error) {
            return shim.error('Failed to place the order: ' + productBytes.product_id)
        }
        console.log('Order placed successfuly ' + productBytes.product_id)
        return shim.success(productBytes)
    }

    async deliveredProduct(stub, args){
        if(args.length != 1){
            return shim.error('Incorrect number of arguments, required 4');
        }
        if(args[0].length == 0){
            return shim.error('Product id must be provided');
        }
        let productBytes = stub.getState(args[0])
        if(!productBytes){
            return shim.error('Cannot find product');
        }
        if(productBytes.status != "Sold"){
            return shim.error('product is not delivered yet');
        }
        txTimeAsPtr = this.getTxTimestampChannel(stub);
        productBytes.date.deliverdDate = txTimeAsPtr;
        productBytes.status = 'Delivered'
        try {
            stub.putState(productBytes.product_id, productBytes);
        } catch (error) {
            return shim.error('Failed to update that product is delivered: ' + productBytes.product_id);
        }
        console.log('Success in delivering Product ' + productBytes.product_id);
        return shim.success(productBytes);
    }

    async sellToCustomer(stub, args){
        if(args.length != 1){
            return shim.error('Incorrect number of arguments, require');
        }

        if(args[0].length == 0){
            return shim.error('Product id must be provided');
        }
        let productBytes = stub.getState(args[0])
        if(!productBytes){
            return shim.error('Cannot find product');
        }
        if(productBytes.order_id == ""){
            return shim.error("Product has not been ordered yet");
        }
        if(productBytes.customer_id == ""){
            return shim.error('Customer Id should be set to sell to customer');
        }
        txTimeAsPtr = this.getTxTimestampChannel(stub);
        productBytes.data.sellToCustomerDate = txTimeAsPtr;
        productBytes.status = "Sold";
        try {
            stub.putState(productBytes.product_id, productBytes);
        } catch (error) {
            return shim.error('Failed to Sell to Customer: ' + productBytes.product_id);
        }
        console.log('Success in sending Product ' + productBytes.product_id)
        return shim.success(productBytes)
    }

    async sendToRetailer(stub, args){
        if(args.length != 2){
            return shim.error
        }
    }

    async queryAll(stub, args){
        if(args.length != 1){
            return shim.error('Incorect number of arguments, require 1');
        }
        if(args[0].length == 0){
            return shim.error('Asset type must be provided');
        }

    }
}