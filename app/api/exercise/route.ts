import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
export async function POST(req: NextRequest) {
	try {
		const { gender, age, height, weight, isHypertension, isDiabetes } =
			await req.json();

		try {
			const resModel = await axios.post(
				"https://web-production-377ff.up.railway.app/predict",
				{
					Age: age,
					Diabetes: isDiabetes ? 1 : 0,
					Height: height,
					Hypertension: isHypertension ? 1 : 0,
					Sex: gender == "male" ? 1 : 0,
					Weight: weight,
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
