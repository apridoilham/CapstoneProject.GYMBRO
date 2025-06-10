import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
export async function POST(req: NextRequest) {
	try {
		const { gender, age, height, weight, isHypertension, isDiabetes } =
			await req.json();

		try {
			const resModel = await axios.post(
				"https://web-production-4119.up.railway.app/predict",
				{
					Sex: gender == "male" ? true : false,
					Age: age,
					Height: height,
					Weight: weight,
					Hypertension: isHypertension,
					Diabetes: isDiabetes,
				}
			);

			return NextResponse.json(
				{ message: "Proccess Success", data: resModel.data, success: false },
				{ status: 200 }
			);
		} catch (err) {
			console.log("Error pada api ml: ", err);
			return NextResponse.json(
				{ message: "Can't connected", success: false },
				{ status: 400 }
			);
		}
	} catch (err) {
		console.log("Error pada api sendiri", err);
		return NextResponse.json(
			{ message: "Proccess Failed", success: false },
			{ status: 400 }
		);
	}
}
