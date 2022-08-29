const mongoose = require("mongoose");
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
//mongodb(nosqldb) relationship - ONE TO FEW -
//each address property in all document in users collection can contains "few" addresses
//the same relationship in a sqldb requires 2 seperate entities
//***************************************************************************************

//mongooseObject.schemaMethod = SchemaClassObject(object)
//schemaClassInstanceObject = new SchemaClassObject(object)
//shorthand vs longhand -
//[string] vs [{properties}] , String vs {type:String,required:true}
//mongoose treats [{properties}] object as an another/embedded schemaInstanceObject - we can prevent id creation
const userSchemaInstanceObject = new mongoose.Schema({
  first: String,
  last: String,
  addresses: [
    {
      _id: { id: false },
      street: String,
      city: String,
      state: String,
      country: { type: String, required: true },
    },
  ],
});

//creating UserClassObject ie(Model) - represents the collection (users)
const User = mongoose.model("User", userSchemaInstanceObject);

//async variable stored anonymous arrow function expression - allows await
const makeUser = async () => {
  //create modelInstanceObject(ie document) from UserClassObject(object) //object has validations/contraints
  const newUser = new User({ first: "James", last: "Dean" });
  //modelInstanceObject.property is an arrayObject //object has validations/contraints
  newUser.addresses.push({
    street: "123 sichuan street",
    city: "New York",
    state: "New York",
    country: "USA",
  });
  //creates (users)collection in (relationship-db)db and/or add newUser(document) into (users)collection
  const savedUser = await newUser.save();
};
//makeUser().catch((e) => {
//   console.log(e);
// });

const addAddress = async (id) => {
  //find  modelInstanceObject(ie document) with specified id
  const foundUser = await User.findById(id);
  //modelInstanceObject.property is an arrayObject //object has validations/contraints
  foundUser.addresses.push({
    street: "421 sichuan street",
    city: "New York",
    state: "New York",
    country: "USA",
  });
  //creates (users)collection in (relationship-db)db and/or add newUser(document) into relationship-db(collection)
  const savedUser = await user.save();
  console.log(savedUser);
};
// addAddress("630bb90c681e635aee93ab17");
