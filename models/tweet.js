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
//mongodb(nosqldb) relationship - ONE TO BILLIONS -
//each user property in all document in  child collection(tweets) contains id references to parent collection(users)
//the same relationship in a sqldb requires 2 seperate entities
//***************************************************************************************

//*********************************************************************************
//PARENT MODEL - UserClassObject ie(Model) - represents the (users) collection
//*********************************************************************************
//mongooseObject.schemaMethod = SchemaClassObject(object)
//schemaClassInstanceObject = new SchemaClassObject(object)
//setting validtaions/constraints in object - shorthand vs longhand - [string] vs [{properties}] , String vs {type:String,required:true}
//mongoose treats [{properties}] object as an another/embedded schemaInstanceObject - (we can prevent id creation)
const userSchemaInstanceObject = new SchemaClassObject({
  username: String,
  age: Number,
});
//creating UserClassObject ie(Model) - represents the (users)collection
const User = mongoose.model("User", userSchemaInstanceObject);

//*********************************************************************************
//CHILD MODEL - TweetClassObject ie(Model) - represents the (tweets) collection
//*********************************************************************************
//mongooseObject.schemaMethod = SchemaClassObject(object)
//schemaClassInstanceObject = new SchemaClassObject(object)
//setting validtaions/constraints in object - shorthand vs longhand - [string] vs [{properties}] , String vs {type:String,required:true}
//mongoose treats [{properties}] object as an another/embedded schemaInstanceObject - we can prevent id creation
//user property is of type:objectID - JS dosn't have that type so get from mongoose
//ref option - tells mongoose which model to use when populating objectID
const tweetSchemaInstanceObject = new SchemaClassObject({
  text: String,
  likes: Number,
  user: { type: SchemaClassObject.Types.ObjectId, ref: "User" },
});

//creating TweetClassObject ie(Model) - represents the (tweets)collection
const Tweet = mongoose.model("Tweet", tweetSchemaInstanceObject);

//async variable stored anonymous arrow function expression - allows await
const makeTweet = async () => {
  //create modelInstanceObject(ie document) from UserClassObject(object) //object has validations/contraints
  //const newUser = new User({ username: "username123", age: 43 });
  //create modelInstanceObject(ie document) from TweetClassObject(object) //object has validations/contraints
  //const newTweet = new Tweet({ text: "This is the tweet", likes: 0 });

  //find first modelInstanceObject(ie document) that matches queryObject
  const foundUser = await User.findOne({ username: "username123" });
  //create modelInstanceObject(ie document) from TweetClassObject(object) //object has validations/contraints
  const newTweet = new Tweet({ text: "This is second tweet", likes: 1 });

  //modelInstanceObject.property = newUser //newUser has validations/contraints
  //Seems like adding on entire newUser document, but we only add on the ID
  //but newTweet.user gives the entire document
  //NOTE - mongoose modelInstanceObject(newTweet-ie document) - gets us the entire document of the ID that is referenced in its user property
  //     - mongodb modelInstaneObject(newTweet-ie document) - shows us only the ID reference of the referenced document
  //newTweet.user = newUser;
  newTweet.user = foundUser;

  //creates (users)collection in (relationship-db)db and/or add newUser(document) into (users)collection
  // const savedUser = await newUser.save();

  //creates (tweets)collection in (relationship-db)db and/or add newTweet(document) into (tweets)collection
  const savedTweet = await newTweet.save();
};
// makeTweet().catch((e) => {
//   console.log(e);
// });

const findTweet = async () => {
  //find first modelInstanceObject(ie document) that matches queryObject -> Tweet.findOne(queryObejct}) -> thenableObject(pending,undefined)
  //thenableObject(resolved,valueObject).queryBuilderMethod("users") = new thenableObject(pending,undefined)
  //new thenableObject(pending,undefined) -> finds modelInstanceObject(ie document) from users(collection) that has matching id in users property
  //the populate("users")(queryBuilderMedthod()) then combines its valueObject with the previousValueObject to create the newValueObject
  //thus newValueObject is the output after populating the ID from the previousValueObjects user property with the document from currentValueObject
  //NOTE - can populate only specific piece of document instead of entire document
  //const foundTweet = await Tweet.findOne({}).populate("user", "username");

  //same priniple applied to a array of documents -
  const foundTweets = await Tweet.find({}).populate("user");
  console.log(foundTweets);
};
// findTweet().catch((e) => {
//   console.log(e);
// });
