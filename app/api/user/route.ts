import { connectDB } from "@/lib/connection";
import cloudinary, {
	extractPublicId,
	checkIfImageExists,
} from "@/lib/cloudinary";
import streamifier from "streamifier";
import { verifyUser } from "@/lib/utils";
import UsersModel from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest): Promise<NextResponse> {
	try {
		const token = verifyUser(req);
		if (!token) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		await connectDB();

		const formData = await req.formData();

		// Extract dan validasi data
		const email = formData.get("email")?.toString();
		const fullName = formData.get("fullName")?.toString();
		const dateRaw = formData.get("date")?.toString();
		const ageRaw = formData.get("age")?.toString();
		const gender = formData.get("gender")?.toString();
		const heightRaw = formData.get("height")?.toString();
		const weightRaw = formData.get("weight")?.toString();
		const bloodPressureRaw = formData.get("BloodPressure")?.toString();
		const fastingGlucoseRaw = formData.get("FastingGlucose")?.toString();

		// Validasi field string wajib
		if (
			!email ||
			!fullName ||
			!dateRaw ||
			!ageRaw ||
			!gender ||
			!heightRaw ||
			!weightRaw ||
			!bloodPressureRaw ||
			!fastingGlucoseRaw
		) {
			return NextResponse.json(
				{ error: "All fields are required." },
				{ status: 400 }
			);
		}

		// Konversi tipe data
		const date = new Date(dateRaw);
		const age = Number(ageRaw);
		const height = Number(heightRaw);
		const weight = Number(weightRaw);
		const FastingGlucose = Number(fastingGlucoseRaw);

		// Validasi konversi number
		if (isNaN(age) || isNaN(height) || isNaN(weight) || isNaN(FastingGlucose)) {
			return NextResponse.json(
				{
					error:
						"Age, height, weight, and fasting glucose must be valid numbers.",
				},
				{ status: 400 }
			);
		}

		// Validasi date
		if (isNaN(date.getTime())) {
			return NextResponse.json(
				{ error: "Date must be valid." },
				{ status: 400 }
			);
		}

		// Parse BloodPressure dengan lebih robust
		let BloodPressure = null;
		try {
			if (typeof bloodPressureRaw === "string") {
				// Coba parse sekali
				let parsed = JSON.parse(bloodPressureRaw);

				// Jika masih string, parse lagi (double-encoded)
				if (typeof parsed === "string") {
					parsed = JSON.parse(parsed);
				}

				BloodPressure = parsed;
			} else {
				BloodPressure = bloodPressureRaw;
			}
		} catch (err) {
			return NextResponse.json(
				{ message: "BloodPressure format invalid" },
				{ status: 400 }
			);
		}

		// Cari user dulu
		const user = await UsersModel.findOne({ email });
		if (!user) {
			return NextResponse.json(
				{ message: "User not found", success: false },
				{ status: 404 }
			);
		}

		// Cek apakah ada file image dikirim
		const file = formData.get("image");
		let newImageUrl = user.imageUrl; // default tetap pakai image lama

		// Upload image baru (jika ada)
		if (file && file instanceof File && file.size > 0) {
			// Validasi tipe file
			if (!file.type.startsWith("image/")) {
				return NextResponse.json(
					{ message: "File harus berupa gambar (image/*)" },
					{ status: 400 }
				);
			}

			// Kalau user punya image lama → cek & hapus
			if (user.imageUrl) {
				const oldPublicId = extractPublicId(user.imageUrl);
				const exists = await checkIfImageExists(oldPublicId);

				if (exists) {
					await cloudinary.uploader.destroy(oldPublicId);
				} else {
				}
			}

			// Upload image baru
			const arrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);

			newImageUrl = await new Promise<string>((resolve, reject) => {
				const uploadStream = cloudinary.uploader.upload_stream(
					{ folder: "profile_picture" },
					(err, result) => {
						if (err || !result) return reject(err);
						resolve(result.secure_url);
					}
				);
				streamifier.createReadStream(buffer).pipe(uploadStream);
			});
		}

		// Siapkan data untuk update
		const updateData = {
			fullName,
			date,
			age,
			gender,
			height,
			weight,
			BloodPressure,
			FastingGlucose,
			isComplete: true,
			imageUrl: newImageUrl,
		};

		// Update data user - PERBAIKAN UTAMA
		const updatedUser = await UsersModel.findOneAndUpdate(
			{ email },
			{
				$set: updateData,
			},
			{
				new: true,
				runValidators: true,
				// Tambahkan option ini untuk memastikan update berjalan
				upsert: false,
			}
		);

		// Verifikasi final
		const finalUser = await UsersModel.findOne({ email });

		// Debug info tambahan
		const totalUsers = await UsersModel.countDocuments();
		const dbName = UsersModel.db?.name;
		const collectionName = UsersModel.collection?.name;

		if (!updatedUser) {
			return NextResponse.json(
				{ message: "User update failed", success: false },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: "Update success", success: true, data: updatedUser },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error in PUT handler:", error);
		return NextResponse.json(
			{ message: "Process failed", success: false, error: error },
			{ status: 500 }
		);
	}
}
