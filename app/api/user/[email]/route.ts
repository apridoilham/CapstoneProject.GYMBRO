import { connectDB } from "@/lib/connection";
import { verifyUser } from "@/lib/utils";
import UsersModel from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: { email: string } }
  ) {
	try {
	  const token = verifyUser(req);
	  if (!token) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	  }
  
	  const { email } = params;
	  await connectDB();
	  const user = await UsersModel.findOne({ email });
	  if (!user) {
		return NextResponse.json(
		  { message: "Data tidak ditemukan", success: false },
		  { status: 404 }
		);
	  }
  
	  const finalData = {
		email: user.email,
		fullName: user.fullName,
		username: user.username || user.email.split('@')[0],
		date: user.date ?? null,
		age: user.age ?? null,
		gender: user.gender ?? null,
		height: user.height ?? null,
		weight: user.weight ?? null,
		BloodPressure: user.BloodPressure ?? null,
		FastingGlucose: user.FastingGlucose ?? null,
		bio: user.bio ?? null,
		healthNotes: user.healthNotes ?? null,
		socialMedia: user.socialMedia ?? null,
		avatarUrl: user.avatarUrl ?? null,
	  };
  
	  return NextResponse.json({ data: finalData, success: true });
	} catch (error) {
	  console.log(error);
	  return NextResponse.json(
		{ message: "Process failed", success: false },
		{ status: 500 }
	  );
	}
  }
  