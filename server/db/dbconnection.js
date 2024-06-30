var mongoose = require ('mongoose')
// const MongoClient = require('mongodb').MongoClient
require('dotenv').config()

const DB_Key = process.env.DB_Key

const localurl = "mongodb://localhost:27017/complaintSystem"

  mongoose.connect(localurl, {useNewUrlParser: true, useUnifiedTopology: true} ,(error)=>{

	if (error) throw error;
	console.log('connected to complaintSystem')
	})

	mongoose.set('useFindAndModify', false)


 
	




 