//user created module file can contain functionObjects,variable,classObjects etc

const mongoose = require("mongoose"); //mongooseObject //mongoose module
//key to variable + rename variable - object destructuring
const { Schema: SchemaClassObject } = mongoose; //mongoose.Schema = SchemaClassObject

//dont need to connect nodejs runtime app to mongod server port since we are going to export model to where its already connected

//****************************************************************************************
//mongodb(nosqldb) relationship - ONE TO BILLIONS -
//each user property in all document in  child collection(tweets) contains id references to parent collection(users)
//the same relationship in a sqldb requires 2 seperate entities
//***************************************************************************************

//*********************************************************************************
//CHILD MODEL - ProductClassObject ie(Model) - represents the (products) collection
//*********************************************************************************
//mongooseObject.schemaMethod = SchemaClassObject(object)
//schemaClassInstanceObject = new SchemaClassObject(object)
//setting validtaions/constraints in object - shorthand vs longhand - [string] vs [{properties}] , String vs {type:String,required:true}
//mongoose treats [{properties}] object as an another/embedded schemaInstanceObject - (we can prevent id creation)
//category is type:String ,enum validator is a string array with pre fixed values season needs to use
//farm property is of type:objectID - JS dosn't have that type so get from mongoose
//ref option - tells mongoose which model to use when populating objectID

const productSchemaInstanceObject = new SchemaClassObject({
  name: { type: String, required: true },
  price: { type: Number, require: true, min: 0 },
  category: {
    type: String,
    lowercase: true,
    enum: ["fruit", "vegetable", "dairy"],
  },
  farm: { type: SchemaClassObject.Types.ObjectId, ref: "Farm" },
});

//creating productClassObject ie(Model) - represents a collection (products)
//mongooseObject.method("collectionNameSingular",collectionSchemaInstanceObject)
const ProductClassObject = mongoose.model(
  "Product",
  productSchemaInstanceObject
);

//exportsObject = productsClassObject ie(Model)
module.exports = ProductClassObject;
