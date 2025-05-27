import mongoose, { Schema, models, model } from "mongoose";

const LogFoodSchema = new mongoose.Schema({
	foodId: {
		type: Schema.Types.ObjectId,
		ref: "Foods",
		required: [true, "Food ID must be provided"],
	},
	imgUrl: {
		type: String,
		required: [true, "Image URL must be provided"],
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

const LogFood = models.LogFood || model("LogFood", LogFoodSchema);

export default LogFood;
