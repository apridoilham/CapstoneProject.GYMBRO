import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { verifyUser } from "@/lib/utils";
import { Client } from "@gradio/client";
import FoodModel from "@/models/FoodModel";
import LogFoodModel from "@/models/LogFoodModel";
import streamifier from "streamifier";

export async function POST(req: NextRequest) {
	try {
		// Cek token valid
		const token = verifyUser(req);
		if (!token) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const formData = await req.formData();
		const file = formData.get("image");

		// Validasi input
		if (!file || !(file instanceof File)) {
			return NextResponse.json(
				{ message: "File tidak valid atau tidak ditemukan" },
				{ status: 400 }
			);
		}

		// Validasi tipe file (harus gambar)
		if (!file.type.startsWith("image/")) {
			return NextResponse.json(
				{ message: "File harus berupa gambar (image/*)" },
				{ status: 400 }
			);
		}

		// Ubah File ke buffer
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Upload ke Cloudinary dengan streamifier
		const imageUrl = await new Promise<string>((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{ folder: "food_classification" },
				(err, result) => {
					if (err || !result) return reject(err);
					resolve(result.secure_url);
				}
			);
			streamifier.createReadStream(buffer).pipe(uploadStream);
		});

		const response_0 = await fetch(imageUrl);
		const finalImage = await response_0.blob();

		// Klasifikasi ke Hugging Face
		const client = await Client.connect("Mlaana/Classification-Food");
		const result = await client.predict("/predict", {
			img: finalImage,
		});

		try {
			const rawData = String(result.data).split(" ")[0];
			const data = await FoodModel.findOne({ name: rawData });

			const dataLog = { foodId: data._id, imgUrl: imageUrl, date: new Date() };
			await LogFoodModel.create(dataLog);

			return NextResponse.json({
				success: true,
				message: "Success",
				data: { data, imageUrl },
			});
		} catch (err) {
			console.error("Error during classification:", err);
			const errorMessage = err instanceof Error ? err.message : String(err);
			return NextResponse.json(
				{ message: "Classification failed", error: errorMessage },
				{ status: 500 }
			);
		}
	} catch (err: any) {
		console.error("Upload/classify error:", err);
		return NextResponse.json(
			{ message: "Upload failed", error: err.message },
			{ status: 500 }
		);
	}
}
