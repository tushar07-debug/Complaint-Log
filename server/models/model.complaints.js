const mongoose = require('mongoose');
const dbconnection = require('../db/dbconnection');

const ComplaintSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	department: { type: String, required: true },
	nature: { type: String, required: true },
	image: { type: String },
	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
	// complaint: {
	// 	type: String,
	// 	required: 'Required',
	// },
	
	// status: {
	// 	type: String,
	// 	required: 'Required',
	// },
	// userId: {
	// 	type: mongoose.Schema.Types.ObjectId, // Ensure userId is an ObjectId
	// 	required: 'Required',
	// },
});

const Complaints = mongoose.model('Complaints', ComplaintSchema);

exports.SaveComplaint = function (title , description, department, nature , image , createdBy, callback) {
	const Complaint = new Complaints({
		title , description, department, nature , image , createdBy
	});
	Complaint.save().then(callback).catch((err) => {
		console.error('Error saving complaint:', err);
		callback(err);
	});
	console.log('complaint in mongoose module schema', Complaint);
};

exports.getAllComplaints = function (callback) {
	Complaints.find().exec(callback);
};

exports.getComplaintsByUserId = function (userId, callback) {
	if (!mongoose.Types.ObjectId.isValid(userId)) {
		return callback(new Error('Invalid userId format'));
	}
	Complaints.find({ createdBy: mongoose.Types.ObjectId(userId) }).exec(callback);
};

// exports.UpdateComplaintStatusById = function (id, status, callback) {
// 	if (!mongoose.Types.ObjectId.isValid(id)) {
// 		return callback(new Error('Invalid complaint ID format'));
// 	}
// 	Complaints.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, { status: status })
// 		.then((result) => callback(null, result))
// 		.catch((err) => callback(err));
// };

// exports.deleteAcomplaintById = (id, callback) => {
// 	if (!mongoose.Types.ObjectId.isValid(id)) {
// 		return callback(new Error('Invalid complaint ID format'));
// 	}
// 	Complaints.deleteOne({ _id: mongoose.Types.ObjectId(id) })
// 		.then((result) => callback(null, result))
// 		.catch((err) => callback(err));
// };
