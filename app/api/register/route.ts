import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connection";
import UsersModel from "@/models/UserModel";
import { handleMongooseError, hashPassword } from "@/lib/utils";

export async function POST(req: NextRequest) {
	try {
		const { fullName, email, password, confirmPassword } = await req.json();

		if (!fullName || !email || !password || !confirmPassword) {
			return NextResponse.json(
				{ error: "All fields are required." },
				{ status: 400 }
			);
		}

		if (password !== confirmPassword) {
			return NextResponse.json(
				{ error: "Passwords do not match." },
				{ status: 400 }
			);
		}

		await connectDB();
		const existingUser = await UsersModel.findOne({ email });
		if (existingUser) {
			return NextResponse.json(
				{ error: "User already exists." },
				{ status: 400 }
			);
		}

		const hashPass = await hashPassword(password.toLowerCase());
		const newUser = {
			email,
			fullName,
			password: hashPass,
		};
		await UsersModel.create(newUser);

		return NextResponse.json(
			{ message: "Registration successful." },
			{ status: 201 }
		);
	} catch (error) {
		const formatError = handleMongooseError(error);
		return NextResponse.json(
			{ ...formatError, success: false },
			{ status: 400 }
		);
	}
}

export function GET() {
	return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
