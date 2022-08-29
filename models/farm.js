const mongoose = require("mongoose");
//key to variable + rename variable - object destructuring
const { Schema: SchemaClassObject } = mongoose; //mongoose.Schema = SchemaClassObject

// ********************************************************************************
// CONNECT - nodeJS runtime app connects to default mogod server port + creates db
// ********************************************************************************
async function main() {
  await mongoose.connect("mongodb://localhost:27017/relationship-db");
  console.log("Connected to mongo");
}
main().catch((err) => {
  console.log("initial mongo connection error");
  console.log(err);
});

//****************************************************************************************
//mongodb(nosqldb) relationship - ONE TO MANY -
//each products property in all document in farms collection contains id references to documents in products collection
//the same relationship in a sqldb requires 2 seperate entities
//***************************************************************************************

//*********************************************************************************
//CHILD MODEL - ProductClassObject ie(Model) - represents the (products) collection
//*********************************************************************************
//mongooseObject.schemaMethod = SchemaClassObject(object)
//schemaClassInstanceObject = new SchemaClassObject(object)
//setting validtaions/constraints in object - shorthand vs longhand - [string] vs [{properties}] , String vs {type:String,required:true}
//mongoose treats [{properties}] object as an another/embedded schemaInstanceObject - (we can prevent id creation)
//season is type:String ,enum validator is a string array with pre fixed values season needs to use
const productSchemaInstanceObject = new SchemaClassObject({
  name: String,
  price: Number,
  season: { type: String, enum: ["Spring", "Summer", "Fall"] },
});
//creating ProductClassObject ie(Model) - represents the (products)collection
const Product = mongoose.model("Product", productSchemaInstanceObject);
//creates (products)collection in (relationship-db)db and/or add document's into (products)collection
// Product.insertMany([
//   { name: "Goddess Melon", price: 4.99, season: "Summer" },
//   { name: "Sugar Baby Watermelon", price: 5.99, season: "Summer" },
//   { name: "Asparagus", price: 3.99, season: "Spring" },
// ]);

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
  name: String,
  city: String,
  products: [{ type: SchemaClassObject.Types.ObjectId, ref: "Product" }],
});

//creating FarmClassObject ie(Model) - represents the (farms)collection
const Farm = mongoose.model("Farm", farmSchemaInstanceObject);

//async variable stored anonymous arrow function expression - allows await
const makeFarm = async () => {
  //create modelInstanceObject(ie document) from UserClassObject(object) //object has validations/contraints
  const newFarm = new Farm({ name: "Full Belly Farms2", city: "Guinda, CA" });
  //find first modelInstanceObject(ie document) that matches queryObject
  const foundProduct = await Product.findOne({ name: "Goddess Melon" });
  //modelInstanceObject.property = arrayObject.push(foundProduct) //foundProduct has validations/contraints
  //Seems like pushing on entire foundProduct, but we only push on the ID's
  //but newFarm.products gives us arrayObject of entire documents
  //NOTE - mongoose modelInstanceObject(newFarm-ie document) shows us the values of the ID's as well
  //     - mongodb modelInstaneObject(newFarm-ie document) show us only the ID's
  newFarm.products.push(foundProduct);
  //creates (farms)collection in (relationship-db)db and/or add newFarm(document) into (farms)collection
  const savedFarm = await newFarm.save();
};
// makeFarm().catch((e) => {
//   console.log(e);
// });

const addProduct = async () => {
  //find first modelInstanceObject(ie document) that matches queryObject
  const foundFarm = await Farm.findOne({ name: "Full Belly Farms2" });
  //find first modelInstanceObject(ie document) that matches queryObject
  const foundProduct = await Product.findOne({ name: "Sugar Baby Watermelon" });
  //modelInstanceObject.property = arrayObject.push(foundProduct) //foundProduct has validations/contraints
  //Seems like pushing on entire foundProduct, but we only push on the ID's
  //but newFarm.products gives us arrayObject of entire documents
  //NOTE - mongoose modelInstanceObject(newFarm-ie document) shows us the values of the ID's as well
  //     - mongodb modelInstaneObject(newFarm-ie document) show us only the ID's
  foundFarm.products.push(foundProduct);
  //creates (farms)collection in (relationship-db)db and/or add newUser(document) into relationship-db(collection)
  const savedFarm = await foundFarm.save();
};
//addProduct().catch(e=>{console.log(e)});

//find first modelInstanceObject(ie document) that matches queryObject -> Farm.findOne(queryObejct}) -> thenableObject(pending,undefined)
//thenableObject(resolved,valueObject).queryBuilderMethod("products") = new thenableObject(pending,undefined)
//new thenableObject(pending,undefined) -> finds all modelInstanceObjects(ie documents) from products(collection) that have matching id in products property
//the populate("products")(queryBuilderMedthod()) then combines its valueObject with the previousValueObject to create the newValueObject
//thus newValueObject is the output of poppulating the array of ID's from the previousValueObjects products property with the documents in the currentValueObject
Farm.findOne({ name: "Full Belly Farms" })
  .populate("products")
  .then((foundFarm) => console.log(foundFarm));
