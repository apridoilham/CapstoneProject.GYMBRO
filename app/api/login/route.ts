import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/connection";
import { comparePassword, getToken } from "@/lib/utils";
import UsersModel from "@/models/UserModel";

export async function POST(req: NextRequest) {
	try {
		const { email, password } = await req.json();
		await connectDB();
		const user = await UsersModel.findOne({ email });
		if (!user) {
			return NextResponse.json(
				{ message: "User not found.", success: false },
				{ status: 400 }
			);
		}

		if (!(await comparePassword(password, user.password))) {
			return NextResponse.json(
				{ message: "Password is incorrect.", success: false },
				{ status: 400 }
			);
		}

		const token = getToken({ email, password });
		return NextResponse.json(
			{
				message: "Login successful.",
				success: true,
				token,
				data: { email },
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ message: "Login failed", success: false },
			{ status: 400 }
		);
	}
}
