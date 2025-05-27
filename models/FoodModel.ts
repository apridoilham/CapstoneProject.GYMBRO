import mongoose, { Schema, models, model } from "mongoose";

const FoodSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Food name is required"],
		trim: true,
	},
	calories: {
		type: Number,
		required: [true, "Calories are required"],
		min: [0, "Calories cannot be negative"],
	},
	protein: {
		type: Number,
		default: 0,
		min: [0, "Protein cannot be negative"],
	},
	fat: {
		type: Number,
		default: 0,
		min: [0, "Fat cannot be negative"],
	},
	carbo: {
		type: Number,
		default: 0,
		min: [0, "Carbohydrates cannot be negative"],
	},
});

const Food = models.Food || model("Food", FoodSchema);

export default Food;
