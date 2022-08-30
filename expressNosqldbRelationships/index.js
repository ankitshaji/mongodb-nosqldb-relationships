//main file of an app that gets other npm package modules or user created modules

//RESTful webApi - using REST principles
const express = require("express"); //FunctionObject //express module
const path = require("path"); //pathObject //path module
const app = express(); //AppObject
//mongoose ODM - has callback but also supports promises-ie returns promiseObject (pending,undefined) to -resove(value)(fullfulled,value) or reject(errorMessage)(rejected,errorMessage)
const mongoose = require("mongoose"); //mongooseObject //mongoose module
const Product = require("./models/product"); //productClassObject(ie Model) //self created module/file needs "./"
const methodOverride = require("method-override"); //functionObject //method-override module
//mongooseObject.property = objectLiteral
const ObjectID = mongoose.Types.ObjectId; //functionObject

// ********************************************************************************
// CONNECT - nodeJS runtime app connects to default mogod server port + creates db
// ********************************************************************************
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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
//variable to pass into forms -
const categories = ["fruit", "vegetable", "dairy"]; //arrayObject

// *********************************************************************************************************************************************************
//RESTful webApi crud operations pattern (route/pattern matching algorithm - order matters) + MongoDB CRUD Operations using mongoose-ODM (modelClassObject)
// *********************************************************************************************************************************************************

//route 1
//httpMethod=GET,path/resource-/products + can contain ?queryString  -(direct match/exact path)
//(READ) name-index,purpose-display all documents in (products)collection from (farmStanddb)d
//appObject.method(pathString,async middlewareCallback)
app.get("/products", async (req, res) => {
  const { category } = req.query; //queryStringObject
  // *****************************************************
  //READ - querying a collection for a document/documents
  // *****************************************************
  if (category) {
    //productClassObject.method(queryObject) ie modelClassObject.method() - same as - db.products.find({})
    const products = await Product.find({ category: category }); //products = dataObject ie array of all jsObjects(documents) that have the same category value
    res.render("products/index", { products: products, category: category });
  } else {
    //productClassObject.method(queryObject) ie modelClassObject.method() - same as - db.products.find({})
    const products = await Product.find({}); //products = dataObject ie array of all jsObjects(documents)
    res.render("products/index", { products: products, category: "All" });
  }
});

//route 2
//httpMethod=GET,path/resource-/products/new  -(direct match/exact path)
//(READ) name-new,purpose-display form to submit new document into (products)collection of (farmStanddb)db
//appObject.method(pathString,async middlewareCallback)
app.get("/products/new", (req, res) => {
  res.render("products/new", { categories: categories });
});

//route 3
//httpMethod=POST,path/resource-/products  -(direct match/exact path)
//(CREATE) name-create,purpose-create new document in (products)collection of (farmStanddb)db
//appObject.method(pathString,async middlewareCallback)
app.post("/products", async (req, res) => {
  //form data ie req.body is jsObject {key/name:inputValue,key/name:inputValue,key/name:inputValue}
  // ***************************************************************************************
  //CREATE - creating a single new document in the (products) collection of (farmStanddb)db
  // ***************************************************************************************
  //create modelInstanceObject(ie document) from ProdctClassObject(object) //object has validations/contraints
  const newProduct = new Product(req.body); //form data/req.body
  //creates (products)collection in (farmStanddb)db and adds (newProduct)document into the (products)collection
  const savedProduct = await newProduct.save(); //savedProduct = dataObject ie created jsObject(document)
  res.redirect(`/products/${newProduct._id}`);
});

//route 4
//httpMethod=GET,path/resource-/products/:id  -(pattern match) //:id is a path variable
//(READ) name-show,purpose-display single specific document in (products)collection of (farmStanddb)db
//appObject.method(pathString,async middlewareCallback)
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  // *************************************************
  //READ - querying a collection for a document by id
  // *************************************************
  //productClassObject.method(idString) ie modelClassObject.method() - same as - db.products.findOne({_id:"12345"})
  const product = await Product.findById(id); //product = dataObject ie single first matching jsObject(document)
  res.render("products/show", { product: product });
});

//route 5
//httpMethod=GET,path/resource-/products/:id/edit  -(pattern match) //:id is a path variable
//(READ) name-edit,purpose-display form to edit existing document in (products)collection of (farmStanddb)db
//appObject.method(pathString,async middlewareCallback)
app.get("/products/:id?/edit", async (req, res) => {
  const { id } = req.params;
  // ***********************************************************
  //READ - querying a collection(products) for a document by id
  // ***********************************************************
  //productClassObject.method(idString) ie modelClassObject.method() - same as - db.products.findOne({_id:"12345"})
  const foundProduct = await Product.findById(id); //foundProduct = dataObject ie single first matching jsObject(document)
  res.render("products/edit", {
    product: foundProduct,
    categories: categories,
  });
});

//route 6
//httpMethod=DELETE,path/resource-/products/:id  -(pattern match) //:id is a path variable
//(DELETE) name-destroy,purpose-delete single specific document in (products)collection of (farmStanddb)db
//appObject.method(pathString,async middlewareCallback)
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  //form data ie req.body is jsObject {key/name:inputValue,key/name:inputValue,key/name:inputValue}
  // **************************************************************************************************************
  //UPDATE - querying a collection(products) for a document by id then updating it + new key:value pairs neglected
  // **************************************************************************************************************
  //productClassObject.method(idString,updateObject,optionObject) ie modelClassObject.method() - same as - db.products.findOneAndUpdate(({_id:"12345"},{$set:{name:"x",...}},{returnNewDocument:true})
  //queries (products)collection of (farmStanddb)db for single document by idString and updates/replaces the document with new updateObject(document)
  const foundProduct = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  }); //form data/req.body has validations/contraints //foundProduct = dataObject ie single first matching jsObject(document) after it was updated
  res.redirect(`/products/${foundProduct._id}`);
});

//route 7
//httpMethod=DELETE,path/resource-/products/:id  -(pattern match) //:id is a path variable
//(DELETE) name-destroy,purpose-delete single specific document in (products)collection of (farmStanddb)db
//appObject.method(pathString,async middlewareCallback)
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  // ******************************************************************************
  //DELETE - querying a collection(products) for a document by id then deleting it
  // ******************************************************************************
  //productClassObject.method(idString) ie modelClassObject.method() - same as - db.products.findOneAndDelete(({_id:"12345"})
  //queries (products)collection of (farmStanddb)db for single document by idString and deletes the document
  const deletedProduct = await Product.findByIdAndDelete(id); //deletedProduct = dataObject ie single first matching jsObject(document) that was deleted
  res.redirect("/products");
});

//adddress - localhost:3000
//app is listening for (HTTPstructured) requests
//executes callback
app.listen(3000, () => {
  console.log("listning on port 3000;");
});
