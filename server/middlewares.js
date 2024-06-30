const Users = require('./models/model.users')
const jwt = require('jsonwebtoken')

module.exports = {
	checkDuplicateUsernameOrEmail: (req, res, next) => {
		if (!req.body.username || !req.body.email|| !req.body.pwd)
			return res
				.status(500)
				.send({ message: 'Username, email & password are required!' })

		const email = req.body.email
		console.log('middleware check check' + email)
		Users.FindUser(email, (err, user) => {
			if (err) return res.status(500).send({ message: err })
			if (user)
				return res
					.status(400)
					.send({ message: `Failed! email ${email} is already in use!` })

			res.header('Access-Control-Expose-Headers', 'token')

			next()
		})
	},

	verifyToken: (req, res, next) => {
		let token = req.headers['authorization'].split(' ')[1]
		 console.log('headderrr', req.headers)
		if (!token) return res.status(403).send({ message: 'Unauthorized!' })

		jwt.verify(token, process.env.ACCESS_TOKENSECRET, (err, decoded) => {
			if (err) return res.status(401).send({ message: 'Unauthorized!' })

			req.user = decoded
			console.log('decooded', decoded.iat - decoded.exp)
		})
		next()
	},

	// isAdmin: (req, res, next) => {
	// 	Users.findById(req.userId).exec((err, user) => {

	// 	  if (err) return res.status(500).send({ message: err })

	//    res.status(403).send({ message: "Require Admin Role!" });

	//  	})
	//   },

	//   checkRole: (req, res, next) => {

	// 	next();
	//   },
}
