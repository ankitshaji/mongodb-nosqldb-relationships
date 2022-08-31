//user created module file can contain functionObjects,variable,classObjects etc

const mongoose = require("mongoose"); //mongooseObject //mongoose module
//key to variable + rename variable - object destructuring
const { Schema: SchemaClassObject } = mongoose; //mongoose.Schema = SchemaClassObject

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

//creating farmClassObject ie(Model) - represents a collection (farms)
//mongooseObject.method("collectionNameSingular",collectionSchemaInstanceObject)
const FarmClassObject = mongoose.model("Farm", farmSchemaInstanceObject);

//exportsObject = productsClassObject ie(Model)
module.exports = FarmClassObject;
