//user created module file can contain functionObjects,variable,classObjects etc

//mongoose ODM - has callback but also supports promises-ie returns promiseObject (pending,undefined) to -resove(value)(fullfulled,value) or reject(errorMessage)(rejected,errorMessage)
const mongoose = require("mongoose"); //mongooseObject //mongoose module

//dont need to connect nodejs runtime app to mongod server port since we are going to export model to where its already connected

// *******************************************
// MODEL SETUP 1
// *******************************************
//blueprint of a single document in products collection -
//mongooseObject.schemaMethod = schemaClassObject(objectArgument passed to constructor method)
//objectArgument-{key:nodejs value type} for collection {keys:value}
//creating productSchemaInstanceObject - with new keyword and schemaClassObject constructor method

//setting validtaions/constraints in objectArgument - longhand way
///cannot ommit name property,cannot ommit price property, price gets converted to type number, addtional key:values get neglected(no error)
//price min val 0,setting (atomicValue)customEnumType with pre fixed values category needs to use eg.(booleanEnumType takes true,false)
//but here enum validator is of type string array with pre fixed values category needs to use,category needs to be lowercase
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, require: true, min: 0 },
  category: {
    type: String,
    lowercase: true,
    enum: ["fruit", "vegetable", "dairy"],
  },
});

//creating productClassObject ie(Model) - represents a collection (products)
//mongooseObject.method("collectionNameSingular",collectionSchemaInstanceObject)
const Product = mongoose.model("Product", productSchema);

//exportsObject = productsClassObject ie(Model)
module.exports = Product;
