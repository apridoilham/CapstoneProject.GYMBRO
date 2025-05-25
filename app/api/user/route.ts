import { connectDB } from "@/lib/connection";
import { verifyUser } from "@/lib/utils";
import UsersModel from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest): Promise<NextResponse> {
	try {
		const token = verifyUser(req);
		if (!token) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const {
			email,
			date,
			age,
			gender,
			height,
			weight,
			BloodPressure,
			FastingGlucose,
		} = await req.json();

		console.log(typeof BloodPressure);

		if (
			!email ||
			!date ||
			!age ||
			!gender ||
			!height ||
			!weight ||
			!BloodPressure ||
			!FastingGlucose
		) {
			return NextResponse.json(
				{ error: "All fields are required." },
				{ status: 400 }
			);
		}

		await connectDB();

		const user = await UsersModel.findOneAndUpdate(
			{ email },
			{
				$set: {
					date,
					age,
					gender,
					height,
					weight,
					BloodPressure,
					FastingGlucose,
					isComplete: true,
				},
			},
			{ new: true }
		);

		if (!user) {
			return NextResponse.json(
				{ message: "User data not found", success: false },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ message: "Update success", success: true, user },
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: "Process failed", success: false },
			{ status: 500 }
		);
	}
}
