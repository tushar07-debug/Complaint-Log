const Handlers = require('./handlers')
const Middlewares = require('./middlewares')
const express = require('express')
const multer = require('multer');
var cors = require('cors')
const fs = require('fs')
const path = require('path')
// const https = require('https')
const middlewares = require('./middlewares')
require('dotenv').config()

// const { create } = require('domain');
const privateKey = fs.readFileSync('./cert/key.pem', 'utf8')
const certificate = fs.readFileSync('./cert/cert.pem', 'utf8')
const upload = multer({ dest: 'uploads/' });
const credentials = { key: privateKey, cert: certificate }

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(cors({ origin: 'http://localhost:3000' }))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(express.static(path.join(__dirname, '../build')))

app.get(['/', '/UserScreen', '/AdminScreen*', '/Registration'], (req, res) => {
	res.sendFile(path.join(__dirname, '../build', 'index.html'))
	// res.send('Whoooohoo')
})
app.post(
	'/api/Registration',
	Middlewares.checkDuplicateUsernameOrEmail,
	Handlers.Registration
)
app.get('/api/AllUsers', Handlers.GetUsers)
app.post('/api/add-complaint', middlewares.verifyToken, upload.single('image') , Handlers.AddComplaint)
app.post('/api/login', Handlers.login)
app.get(
	'/api/GetAllComplaints',
	Middlewares.verifyToken,
	Handlers.GetComplaints
)
app.get(
	'/api/complaintsByUser',
	Middlewares.verifyToken,
	Handlers.GetComplaintsByUser
)
app.get('/api/RefreshToken', Middlewares.verifyToken, Handlers.RefreshToken)

// app.post('/api/UpdateComplaintStatus', Handlers.UpdateComplaintStatus)
// app.delete('/api/DeleteAcomplaint', Handlers.DeleteAcomplaint)

// const httpsServer = https.createServer(credentials, app)
// httpsServer.listen(4000,()=>{console.log("httpsss at 4000")})

app.listen(port, () => {
	console.log(`listening at http://localhost:${port}`)
})
