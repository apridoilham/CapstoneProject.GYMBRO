import mongoose, { Schema, models, model } from "mongoose";

const UsersSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, "Email must be filled"],
	},
	fullName: {
		type: String,
		required: [true, "Full name must be filled"],
		maxlength: [50, "Full name must be less than 50 characters"],
		minLength: [2, "Full name must be more than 2 characters"],
	},
	password: {
		type: String,
		required: [true, "Password must be filled"],
		maxLength: [100, "Password must be less than 100 characters"],
		minLength: [5, "Password must be more than 5 characters"],
	},
	date: {
		type: Date,
		required: false,
	},
	age: {
		type: Number,
		required: false,
	},
	gender: {
		type: String,
		required: false,
	},
	height: {
		type: Number,
		required: false,
	},
	weight: {
		type: Number,
		required: false,
	},
	BloodPressure: mongoose.Schema.Types.Mixed,
	FastingGlucose: {
		type: Number,
		required: false,
	},
	isComplete: {
		type: Boolean,
		required: true,
		default: false,
	},
});

const UsersModel = models.Users || model("Users", UsersSchema);
export default UsersModel;
