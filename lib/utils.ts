import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "@/lib/cloudinary";
import { NextRequest } from "next/server";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const hashPassword = async (password: string): Promise<string> => {
	return await bcrypt.hash(password, 10);
};

export const comparePassword = async (
	password: string,
	hashed: string
): Promise<boolean> => {
	return await bcrypt.compare(password, hashed);
};

export const handleMongooseError = (error: any) => {
	// Jika error adalah validation error dari mongoose
	if (error.name === "ValidationError") {
		const validationErrors = [];

		// Ekstrak semua error validasi dan urutkan berdasarkan field
		const errorFields: any = {};

		for (const field in error.errors) {
			const errorDetails = error.errors[field];

			// Ambil nama field, handle nested fields dengan dot notation (seperti 'user.name')
			const fieldName = field;

			// Inisialisasi array errors untuk field jika belum ada
			if (!errorFields[fieldName]) {
				errorFields[fieldName] = [];
			}

			// Ambil pesan error berdasarkan tipe validasi
			let errorMessage = errorDetails.message;

			// Tambahkan pesan spesifik berdasarkan tipe validasi jika pesan generik
			if (!errorMessage || errorMessage.includes("Path `" + fieldName + "`")) {
				switch (errorDetails.kind) {
					case "required":
						errorMessage = `${fieldName} wajib diisi`;
						break;
					case "minlength":
						errorMessage = `${fieldName} minimal ${
							errorDetails.properties?.minlength || "?"
						} karakter`;
						break;
					case "maxlength":
						errorMessage = `${fieldName} maksimal ${
							errorDetails.properties?.maxlength || "?"
						} karakter`;
						break;
					case "min":
						errorMessage = `${fieldName} minimal bernilai ${
							errorDetails.properties?.min || "?"
						}`;
						break;
					case "max":
						errorMessage = `${fieldName} maksimal bernilai ${
							errorDetails.properties?.max || "?"
						}`;
						break;
					case "enum":
						const validValues =
							errorDetails.properties?.enumValues?.join(", ") || "?";
						errorMessage = `${fieldName} harus salah satu dari: ${validValues}`;
						break;
					case "regexp":
						errorMessage = `${fieldName} tidak sesuai format yang diharapkan`;
						break;
					case "user defined":
						// Jika validasi kustom tetapi pesan tidak jelas
						if (!errorMessage || errorMessage.includes("validation failed")) {
							errorMessage = `${fieldName} tidak valid`;
						}
						break;
					default:
						errorMessage = `${fieldName} tidak valid: ${
							errorDetails.kind || "unknown validation"
						}`;
				}
			}

			// Tambahkan ke array errors untuk field
			errorFields[fieldName].push(errorMessage);
		}

		// Gabungkan semua error untuk tiap field
		for (const field in errorFields) {
			// Jika hanya ada 1 error untuk field ini, gunakan pesan tersebut
			// Jika ada multiple errors, gabungkan dengan format bullet
			const errorMessages = errorFields[field];
			let finalMessage;

			if (errorMessages.length === 1) {
				finalMessage = errorMessages[0];
			} else {
				finalMessage = errorMessages.join("; ");
			}

			validationErrors.push({
				name: field,
				message: finalMessage,
			});
		}

		return {
			validationError: validationErrors,
		};
	}

	// Jika error adalah duplicate key error
	if (error.code === 11000) {
		const field = Object.keys(error.keyValue)[0];
		return {
			validationError: [
				{
					name: field,
					message: `${field} sudah digunakan, silahkan gunakan yang lain`,
				},
			],
		};
	}

	// Jika error adalah error lainnya
	return {
		validationError: [
			{
				name: "Unknown Error",
				message: error.message || "Terjadi kesalahan yang tidak diketahui",
			},
		],
	};
};

export const getToken = (inpt: any) => {
	const jwtSecret = process.env.JWT_SECRET;
	if (!jwtSecret) {
		throw new Error("JWT_SECRET is not defined in environment variables");
	}
	const token = jwt.sign(inpt, jwtSecret, {
		expiresIn: "7d",
	});
	return token;
};

export function verifyUser(req: NextRequest) {
	const authHeader = req.headers.get("authorization");
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return null;
	}
	const token = authHeader.split(" ")[1];
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!);
		return decoded;
	} catch (error) {
		return null;
	}
}

export function extractPublicId(imageUrl: any) {
	const regex = /\/upload\/(?:v\d+\/)?([^\.]+)/;
	const match = imageUrl.match(regex);
	if (match && match[1]) {
		return match[1];
	}
	return null;
}

export async function checkIfImageExists(publicId: string) {
	try {
		const result = await cloudinary.api.resource(publicId);
		console.log("Resource found:", result);
		return true;
	} catch (err) {
		if (
			typeof err === "object" &&
			err !== null &&
			"http_code" in err &&
			(err as any).http_code === 404
		) {
			console.log("Resource not found");
			return false;
		} else {
			throw err; // error lain
		}
	}
}
