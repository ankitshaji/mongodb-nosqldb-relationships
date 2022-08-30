//isolated seeds.js file, run file to seed(ie add initial data) to our db(farmStanddb)
//specifically seed(ie add intial data) to the products collection

//mongoose ODM - has callback but also supports promises-ie returns promiseObject (pending,undefined) to -resove(value)(fullfulled,value) or reject(errorMessage)(rejected,errorMessage)
const mongoose = require("mongoose"); //mongooseObject //mongoose module
const Product = require("./models/product"); //productClassObject(ie Model) //self created module/file needs "./"

// *******************************************
// CONNECT - nodeJS runtime app connects to default mogod server port + creates db
// *******************************************
//mongooseObject.method(url/defaultPortNo/databaseToUse,optionsObject-notNeeded) //returns promiseObject pending
mongoose
  .connect("mongodb://localhost:27017/farmStanddb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    //promisObject resolved
    console.log("Mongo Connection Open");
  })
  .catch((err) => {
    //promisObject rejected
    console.log("Mongo connection error has occured");
    console.log(err);
  });
//Dont need to nest code inside callback - Operation Buffering
//mongoose lets us use models immediately,without wainting
//for mongoose to eastablish a connection to MongoDB

// *******************************************
//CREATE - creating a single new document for the collection - products
// *******************************************
//modelClass
//productClassObject(objectArgument-passed to constructor method)
//objectArgument- jsObject{key:value} ie the new document that abides to collectionSchemaInstanceObject
//objectArgument has validations/contraints set by collectionSchemaInstanceObject
//validations/contraints -
///cannot ommit name property,cannot ommit price property, price gets converted to type number, addtional key:values get neglected(no error)
//price min val 0,setting (atomicValue)customEnumType with pre fixed values category needs to use eg.(booleanEnumType takes true,false)
//but here enum validator is of type string array with pre fixed values category needs to use,category needs to be lowercase
const p = new Product({
  name: "Ruby Grapefruit",
  price: 1.99,
  category: "fruit",
});
//modelInstance.save() returns promiseObject - pending to resolved(dataObject),rejected(errorObject)
//creates (products)collection in (farmStanddb)db and adds (p)document into the (products)collection //auto pluralisation of Product to products collection
// p.save()
//   .then((data) => {
//     console.log("promise resolved(dataObject)");
//     console.log(data); //jsObject of created document
//   })
//   .catch((err) => {
//     //breaking validation/contraints causes promiseObjec to be rejected(errObject)
//     console.log("promise rejected(errObject)");
//     console.log(err); //check message only err.errors.name.properties.message
//   });

//array of jsObjects
const seedProductsArray = [
  { name: "Fairy Eggplant", price: 1.0, category: "vegetable" },
  { name: "Organic Goddess Melon", price: 4.99, category: "fruit" },
  {
    name: "Organic Mini Seedless Watermelon",
    price: 3.99,
    category: "fruit",
  },
  { name: "Organic Celery", price: 1.5, category: "vegetable" },
  { name: "Chocolate Whole Milk", price: 2.69, category: "dairy" },
];

// *******************************************
//CREATE - creating mutiple new documents for the collection - dont usually use
// *******************************************
//creates the collection if not already existing
//productClassObject.method(array of jsObjects) - ie modelClassObject.method() - returns promiseObject pending to resolve(dataObject) or reject(errorObject) //do not need to modelObject.save()
//same as - db.products.insertMany([{name:"Fairy Eggplant"..},{name:"Organic Celery"..}])- argument-array of jsObjects/jsons/documents,method-converts jsObjects/jsons/doscuments to BSON + auto create id
Product.insertMany(seedProductsArray)
  .then((data) => {
    console.log(
      "promiseObject resolved - Inserted documents to products collection"
    );
    console.log(data);
  })
  .catch((err) => {
    //breaking validation/contraints causes promiseObject to be rejected(errObject)
    //if one jsObject breaks validation/contraints then nothing inserts
    console.log(
      "promiseObject rejected - Non of the documents inserted into products collection"
    );
  });
