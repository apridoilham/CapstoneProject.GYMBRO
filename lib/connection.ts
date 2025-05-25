import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_DB_CONNECTION as string;

if (!MONGODB_URI) {
	throw new Error("MONGO_DB_CONNECTION environment variable is not defined");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
	if (cached.conn) return cached.conn;

	if (!cached.promise) {
		cached.promise = mongoose.connect(MONGODB_URI, {
			dbName: "capstone",
			bufferCommands: false,
		});
	}

	try {
		cached.conn = await cached.promise;
		console.log("MongoDB connected");
		return cached.conn;
	} catch (err) {
		console.error("MongoDB connection error:", err);
		throw err;
	}
}
