//main file of an app that gets other npm package modules or user created modules

//RESTful webApi - using REST principles
const express = require("express"); //FunctionObject //express module
const path = require("path"); //pathObject //path module
const app = express(); //AppObject
//mongoose ODM - has callback but also supports promises-ie returns promiseObject (pending,undefined) to -resove(value)(fullfulled,value) or reject(errorMessage)(rejected,errorMessage)
const mongoose = require("mongoose"); //mongooseObject //mongoose module
const ProductClassObject = require("./models/product"); //productClassObject(ie Model) //self created module/file needs "./"
const FarmClassObject = require("./models/farm"); //FarmClassObject(ie Model) //self created module/file needs "./"
const methodOverride = require("method-override"); //functionObject //method-override module
//mongooseObject.property = objectLiteral
const ObjectID = mongoose.Types.ObjectId; //functionObject

// ********************************************************************************
// CONNECT - nodeJS runtime app connects to default mogod server port + creates db
// ********************************************************************************
//mongooseObject.method(url/defaultPortNo/databaseToUse,optionsObject-notNeeded) //returns promiseObject pending
mongoose
  .connect("mongodb://localhost:27017/farmStanddb3", {
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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
//variable to pass into forms -
const categories = ["fruit", "vegetable", "dairy"]; //arrayObject

// *********************************************************************************************************************************************************
//RESTful webApi crud operations pattern (route/pattern matching algorithm - order matters) + MongoDB CRUD Operations using mongoose-ODM (modelClassObject)
// *********************************************************************************************************************************************************

//*************
//FARMS ROUTES
//*************

//route 1
//httpMethod=GET,path/resource-/farms + can contain ?queryString  -(direct match/exact path)
//(READ) name-index,purpose-display all documents in (products)collection from (farmStanddb3)d
//appObject.method(pathString,async middlewareCallback)
app.get("/farms", async (req, res) => {
  // *****************************************************
  //READ - querying a collection for a document/documents
  // *****************************************************
  //FarmClassObject.method(queryObject) ie modelClassObject.method() - same as - db.farms.find({})
  const foundFarms = await FarmClassObject.find({}); //products = dataObject ie array of all jsObjects(documents)
  res.render("farms/index", { farms: foundFarms });
});

//route 2
//httpMethod=GET,path/resource-/farms/new  -(direct match/exact path)
//(READ) name-new,purpose-display form to submit new document into (farms)collection of (farmStanddb3)db
//appObject.method(pathString,async middlewareCallback)
app.get("/farms/new", (req, res) => {
  res.render("farms/new");
});

//route 3
//httpMethod=POST,path/resource-/farms  -(direct match/exact path)
//(CREATE) name-create,purpose-create new document in (farms)collection of (farmStanddb3)db
//appObject.method(pathString,async middlewareCallback)
app.post("/farms", async (req, res) => {
  //form data ie req.body is jsObject {key/name:inputValue,key/name:inputValue,key/name:inputValue}
  // ***************************************************************************************
  //CREATE - creating a single new document in the (farms) collection of (farmStanddb3)db
  // ***************************************************************************************
  //create modelInstanceObject(ie document) from FarmClassObject(object) //object has validations/contraints
  const newFarm = new FarmClassObject(req.body); //form data/req.body
  //creates (farms)collection in (farmStanddb3)db and adds (newFarm)document into the (farms)collection
  const savedFarm = await newFarm.save(); //savedFarm = dataObject ie created jsObject(document)
  res.redirect(`/farms`);
});

//route 4
//httpMethod=GET,path/resource-/farms/:id  -(pattern match) //:id is a path variable
//(READ) name-show,purpose-display single specific document in (farms)collection of (farmStanddb3)db
//appObject.method(pathString,async middlewareCallback)
app.get("/farms/:id", async (req, res) => {
  const { id } = req.params;
  // *************************************************
  //READ - querying a collection for a document by id
  // *************************************************
  //FarmClassObject.method(idString) ie modelClassObject.method() - same as - db.farms.findOne({_id:"12345"})
  //find modelInstanceObject(ie document) that matches id -> FarmClassObject.findById(id) -> thenableObject(pending,undefined)
  //thenableObject(resolved,valueObject).queryBuilderMethod("products") = new thenableObject(pending,undefined)
  //new thenableObject(pending,undefined) -> finds all modelInstanceObjects(ie documents) from products(collection) that have matching id in products property
  //the populate("products")(queryBuilderMedthod()) then combines its valueObject with the previousValueObject to create the newValueObject
  //thus newValueObject is the output of populating the array of ID's from the previousValueObjects products property with the documents in the currentValueObject
  //NOTE - can populate only specific piece of document instead of entire document
  const foundFarm = await FarmClassObject.findById(id).populate("products"); //foundFarm = dataObject ie single first matching jsObject(document)
  res.render("farms/show", { farm: foundFarm }); //passing in foundFarm with products property populated
});

//***************
//Nested routing
//***************
//add product through the farm - using nested routing to get farm_id
//nested routing - more than one dynamic variable in path ie pathVariablesObject
//follow RESTful webApi CRUD operations pattern naming convention
//other options to send farm_id - hide in form(hidden field) OR send in request body
//note- dont need to nest under farm if we dont need farm id - decide when we need info
//eg -can populate farm property of product since it is already connected to a farm - dont need farm/:id
//if we need both ids eg./posts/:postId/comments/:commentId  - more than one dynamic variable in path - name them diffrently
//note previous products added not through farm routes will have errors since they dont have a farm property

//route 5
//httpMethod=GET,path/resource-/farms/:id/products/new  -(pattern match) //:id is a path variable
//(READ) name-new,purpose-display form to submit new document into (products)collection of (farmStanddb3)db
//appObject.method(pathString,async middlewareCallback)
app.get("/farms/:id/products/new", async (req, res) => {
  const { id } = req.params;
  // *************************************************
  //READ - querying a collection for a document by id
  // *************************************************
  //FarmClassObject.method(idString) ie modelClassObject.method() - same as - db.farms.findOne({_id:"12345"})
  foundFarm = await FarmClassObject.findById(id);
  res.render("products/new", { farm: foundFarm, categories: categories });
});

//route 6
//httpMethod=POST,path/resource-/farms/:id/products  -(pattern match) //:id is a path variable
//(CREATE) name-create,purpose-create new document in (products)collection of (farmStanddb3)db
//appObject.method(pathString,async middlewareCallback)
app.post("/farms/:id/products", async (req, res) => {
  //form data ie req.body is jsObject {key/name:inputValue,key/name:inputValue,key/name:inputValue}
  const { name, price, category } = req.body;
  const { id } = req.params;

  // *************************************************
  //READ - querying a collection for a document by id
  // *************************************************
  //FarmClassObject.method(idString) ie modelClassObject.method() - same as - db.farms.findOne({_id:"12345"})
  const foundFarm = await FarmClassObject.findById(id);

  // ***************************************************************************************
  //CREATE - creating a single new document in the (products) collection of (farmStanddb3)db
  // ***************************************************************************************
  //create modelInstanceObject(ie document) from ProductClassObject(object) //object has validations/contraints
  const newProduct = new ProductClassObject({
    name: name,
    price: price,
    category: category,
  }); //form data/req.body

  // *********************************
  //UPDATE -  updating both documents
  // *********************************
  //******************************************************************************************************
  //we assosicate the newProduct and the foundFarm by referenceing them in each other(double referencing)
  //******************************************************************************************************

  //modelInstanceObject.property = arrayObject.push(newProduct) //newProduct has validations/contraints
  //Seems like pushing on entire newProduct, but we only push on the ID's
  //but foundFarm.products gives us arrayObject of entire documents
  //NOTE - mongoose modelInstanceObject(foundFarm-ie document) shows us the values of the ID's as well
  //     - mongodb modelInstaneObject(foundFarm-ie document) show us only the ID's
  foundFarm.products.push(newProduct);

  //modelInstanceObject.property = foundFarm //foundFarm has validations/contraints
  //Seems like adding on entire foundFarm document, but we only add on the ID
  //but newProduct.farm gives the entire document
  //NOTE - mongoose modelInstanceObject(newProduct-ie document) - gets us the entire document of the ID that is referenced in its farm property
  //     - mongodb modelInstaneObject(newProduct-ie document) - shows us only the ID reference of the referenced document
  newProduct.farm = foundFarm;
  //creates (farms)collection in (farmStanddb3)db and/or adds (newFarm)document into the (farms)collection
  const savedFarm = await foundFarm.save(); //savedFarm = dataObject ie created jsObject(document)
  //creates (products)collection in (f armStanddb3)db and/or adds (newProduct)document into the (products)collection
  const savedProduct = await newProduct.save(); //savedProduct = dataObject ie created jsObject(document)
  res.redirect(`/farms/${savedFarm._id}`);
});

//****************
//PRODUCTS ROUTES
//****************

//route 1
//httpMethod=GET,path/resource-/products + can contain ?queryString  -(direct match/exact path)
//(READ) name-index,purpose-display all documents in (products)collection from (farmStanddb3)d
//appObject.method(pathString,async middlewareCallback)
app.get("/products", async (req, res) => {
  const { category } = req.query; //queryStringObject
  // *****************************************************
  //READ - querying a collection for a document/documents
  // *****************************************************
  if (category) {
    //productClassObject.method(queryObject) ie modelClassObject.method() - same as - db.products.find({})
    const products = await ProductClassObject.find({ category: category }); //products = dataObject ie array of all jsObjects(documents) that have the same category value
    res.render("products/index", { products: products, category: category });
  } else {
    //productClassObject.method(queryObject) ie modelClassObject.method() - same as - db.products.find({})
    const products = await ProductClassObject.find({}); //products = dataObject ie array of all jsObjects(documents)
    res.render("products/index", { products: products, category: "All" });
  }
});

//route 2
//httpMethod=GET,path/resource-/products/new  -(direct match/exact path)
//(READ) name-new,purpose-display form to submit new document into (products)collection of (farmStanddb3)db
//appObject.method(pathString,async middlewareCallback)
app.get("/products/new", (req, res) => {
  res.render("products/new", { categories: categories });
});

//route 3
//httpMethod=POST,path/resource-/products  -(direct match/exact path)
//(CREATE) name-create,purpose-create new document in (products)collection of (farmStanddb3)db
//appObject.method(pathString,async middlewareCallback)
app.post("/products", async (req, res) => {
  //form data ie req.body is jsObject {key/name:inputValue,key/name:inputValue,key/name:inputValue}
  // ***************************************************************************************
  //CREATE - creating a single new document in the (products) collection of (farmStanddb3)db
  // ***************************************************************************************
  //create modelInstanceObject(ie document) from ProdctClassObject(object) //object has validations/contraints
  const newProduct = new ProductClassObject(req.body); //form data/req.body
  //creates (products)collection in (farmStanddb3)db and adds (newProduct)document into the (products)collection
  const savedProduct = await newProduct.save(); //savedProduct = dataObject ie created jsObject(document)
  res.redirect(`/products/${newProduct._id}`);
});

//route 4
//httpMethod=GET,path/resource-/products/:id  -(pattern match) //:id is a path variable
//(READ) name-show,purpose-display single specific document in (products)collection of (farmStanddb3)db
//appObject.method(pathString,async middlewareCallback)
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  // *************************************************
  //READ - querying a collection for a document by id
  // *************************************************
  //productClassObject.method(idString) ie modelClassObject.method() - same as - db.products.findOne({_id:"12345"})
  //find modelInstanceObject(ie document) that matches id -> ProductClassObject.findById(id) -> thenableObject(pending,undefined)
  //thenableObject(resolved,valueObject).queryBuilderMethod("farm") = new thenableObject(pending,undefined)
  //new thenableObject(pending,undefined) -> finds modelInstanceObject(ie document) from farms(collection) that has matching id in farm property
  //the populate("farm")(queryBuilderMedthod()) then combines its valueObject with the previousValueObject to create the newValueObject
  //thus newValueObject is the output after populating the ID from the previousValueObjects farm property with the document from currentValueObject
  //NOTE - can populate only specific piece of document instead of entire document
  //NOTE - dont need to nest under farm if we dont need farm id - decide when we need info
  //eg -can populate farm property of product since it is already connected to a farm - dont need farm/:id
  const foundProduct = await ProductClassObject.findById(id).populate(
    "farm",
    "name"
  ); //foundProduct = dataObject ie single first matching jsObject(document)
  res.render("products/show", { product: foundProduct }); //passing in foundProduct with farm property populated
});

//route 5
//httpMethod=GET,path/resource-/products/:id/edit  -(pattern match) //:id is a path variable
//(READ) name-edit,purpose-display form to edit existing document in (products)collection of (farmStanddb3)db
//appObject.method(pathString,async middlewareCallback)
app.get("/products/:id?/edit", async (req, res) => {
  const { id } = req.params;
  // ***********************************************************
  //READ - querying a collection(products) for a document by id
  // ***********************************************************
  //productClassObject.method(idString) ie modelClassObject.method() - same as - db.products.findOne({_id:"12345"})
  const foundProduct = await ProductClassObject.findById(id); //foundProduct = dataObject ie single first matching jsObject(document)
  res.render("products/edit", {
    product: foundProduct,
    categories: categories,
  });
});

//route 6
//httpMethod=DELETE,path/resource-/products/:id  -(pattern match) //:id is a path variable
//(DELETE) name-destroy,purpose-delete single specific document in (products)collection of (farmStanddb3)db
//appObject.method(pathString,async middlewareCallback)
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  //form data ie req.body is jsObject {key/name:inputValue,key/name:inputValue,key/name:inputValue}
  // **************************************************************************************************************
  //UPDATE - querying a collection(products) for a document by id then updating it + new key:value pairs neglected
  // **************************************************************************************************************
  //productClassObject.method(idString,updateObject,optionObject) ie modelClassObject.method() - same as - db.products.findOneAndUpdate(({_id:"12345"},{$set:{name:"x",...}},{returnNewDocument:true})
  //queries (products)collection of (farmStanddb3)db for single document by idString and updates/replaces the document with new updateObject(document)
  const foundProduct = await ProductClassObject.findByIdAndUpdate(
    id,
    req.body,
    {
      runValidators: true,
      new: true,
    }
  ); //form data/req.body has validations/contraints //foundProduct = dataObject ie single first matching jsObject(document) after it was updated
  res.redirect(`/products/${foundProduct._id}`);
});

//route 7
//httpMethod=DELETE,path/resource-/products/:id  -(pattern match) //:id is a path variable
//(DELETE) name-destroy,purpose-delete single specific document in (products)collection of (farmStanddb3)db
//appObject.method(pathString,async middlewareCallback)
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  // ******************************************************************************
  //DELETE - querying a collection(products) for a document by id then deleting it
  // ******************************************************************************
  //productClassObject.method(idString) ie modelClassObject.method() - same as - db.products.findOneAndDelete(({_id:"12345"})
  //queries (products)collection of (farmStanddb3)db for single document by idString and deletes the document
  const deletedProduct = await ProductClassObject.findByIdAndDelete(id); //deletedProduct = dataObject ie single first matching jsObject(document) that was deleted
  res.redirect("/products");
});

//adddress - localhost:3000
//app is listening for (HTTPstructured) requests
//executes callback
app.listen(3000, () => {
  console.log("listning on port 3000;");
});
