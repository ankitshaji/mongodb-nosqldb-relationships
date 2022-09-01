//user created module file can contain functionObjects,variable,classObjects etc

const mongoose = require("mongoose"); //mongooseObject //mongoose module
//key to variable + rename variable - object destructuring
const { Schema: SchemaClassObject } = mongoose; //mongoose.Schema = SchemaClassObject
const ProductClassObject = require("../models/product"); //productClassObject(ie Model) //self created module/file needs "./"
//dont need to connect nodejs runtime app to mongod server port since we are going to export model to where its already connected

//****************************************************************************************
//mongodb(nosqldb) relationship - ONE TO MANY -
//each products property in all document in farms collection contains id references to documents in products collection
//the same relationship in a sqldb requires 2 seperate entities
//***************************************************************************************

//*********************************************************************************
//PARENT MODEL - FarmClassObject ie(Model) - represents the (farms) collection
//*********************************************************************************
//mongooseObject.schemaMethod = SchemaClassObject(object)
//schemaClassInstanceObject = new SchemaClassObject(object)
//setting validtaions/constraints in object - shorthand vs longhand - [string] vs [{properties}] , String vs {type:String,required:true}
//mongoose treats [{properties}] object as an another/embedded schemaInstanceObject - we can prevent id creation
//products property is an array of type:objectID - JS dosn't have that type so get from mongoose
//ref option - tells mongoose which model to use when populating objectIDs
const farmSchemaInstanceObject = new SchemaClassObject({
  name: { type: String, required: [true, "Farm must have name"] },
  city: String,
  email: { type: String, required: [true, "Email is required"] },
  products: [{ type: SchemaClassObject.Types.ObjectId, ref: "Product" }],
});

// **************************************************************************************************************
//adding mongoose middleware(hook)Callback on farmSchemaInstanceObject - //thus adding mongoose middleware(hook)Callback to model - (case1)modelInstanceObject/dataObject
// mongoose middleware(hook)Callback executes code before or after a mongoose method
// ****************************************************************************************************************
//usefull to keep track of global count of mongoose method use

//async middlewareCallback - type1
//async modelMiddlwareCallbacks (this keyword refers to model instance)
//async modelFunctions(mongoose methods) - save(),remove(),updateOne() etc
//example - pre async modelMiddlwareCallbacks added to remove() modelFunctions(mongoose method) that removes other associated info

//async middlewareCallback - type2
//async queryMiddlewareCallbacks(this keyword refers to thenableObject) -
//exectue pre/post async queryMiddlewareCallback when await/.then() is called on queryFunction(mongoose method)
//-pre async queryMiddlewareCallbacks does not have access to the dataObject returned by the queryFunction(mongoose method)
//-post async queryMiddlewareCallbacks does have access to the dataObject returned by the queryFunction(mongoose method)

//no async vs async
//middlewareCallback(next){//dostuff next()}  - needs next() execution to go to next middlewareCallback
//OR
//async middlewareCallback(){await doStuff()} - async default returns promiseObject - auto calls next() to go to next middlewareCallback

//farmSchemaInstanceObject.method(argument -"mongooseMethod",async queryMiddlewareCallbacks to execute after mongooseMethod)
//async(ie continues running outside code if it hits an await inside) callback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
//queryFunction(mongoose method) - findByIdAndDelete becomes findOneAndDelete
farmSchemaInstanceObject.post("findOneAndDelete", async function (deletedFarm) {
  //length = 0 is falsey
  if (deletedFarm.products.length) {
    //we use the passed in deletedFarm(ie document)argument to find and delete all assosiated documents in the products array property of deletedFarm(ie document)
    //queries (products)collection of (farmStanddb3)db for all documents that match queryObject and deletes them
    //queryObject contains queryOperator - $in
    const messageObject = await ProductClassObject.deleteMany({
      _id: { $in: deletedFarm.products },
    });
  }
});

//creating farmClassObject ie(Model) - represents a collection (farms)
//mongooseObject.method("collectionNameSingular",collectionSchemaInstanceObject)
const FarmClassObject = mongoose.model("Farm", farmSchemaInstanceObject);

//exportsObject = productsClassObject ie(Model)
module.exports = FarmClassObject;
