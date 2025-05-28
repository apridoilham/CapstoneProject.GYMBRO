import { connectDB } from "@/lib/connection";
import { verifyUser } from "@/lib/utils";
import UsersModel from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

// Fungsi untuk memvalidasi format tanggal
const isValidDate = (dateString: string) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const token = verifyUser(req);
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {
      email,
      fullName,
      username,
      date,
      age,
      gender,
      height,
      weight,
      BloodPressure,
      FastingGlucose,
      bio,
      healthNotes,
      socialMedia,
      avatarUrl,
    } = await req.json();

    // Validasi email wajib
    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    // Validasi format tanggal
    if (date && !isValidDate(date)) {
      return NextResponse.json(
        { error: "Invalid date format." },
        { status: 400 }
      );
    }

    // Validasi struktur BloodPressure
    if (BloodPressure && (!BloodPressure.systolic || !BloodPressure.diastolic)) {
      return NextResponse.json(
        { error: "BloodPressure must include systolic and diastolic values." },
        { status: 400 }
      );
    }

    await connectDB();

    const updateData: any = { isComplete: true };
    if (fullName) updateData.fullName = fullName;
    if (username) updateData.username = username;
    if (date) updateData.date = date;
    if (age) updateData.age = age;
    if (gender) updateData.gender = gender;
    if (height) updateData.height = height;
    if (weight) updateData.weight = weight;
    if (BloodPressure) updateData.BloodPressure = BloodPressure;
    if (FastingGlucose) updateData.FastingGlucose = FastingGlucose;
    if (bio) updateData.bio = bio;
    if (healthNotes) updateData.healthNotes = healthNotes;
    if (socialMedia) updateData.socialMedia = socialMedia;
    if (avatarUrl) updateData.avatarUrl = avatarUrl;

    const user = await UsersModel.findOneAndUpdate(
      { email },
      { $set: updateData },
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
  } catch (error: any) {
    console.error("Error in PUT /user:", error);
    return NextResponse.json(
      { message: error.message || "Process failed", success: false },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const token = verifyUser(req);
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Mengambil semua pengguna dari database, tanpa password
    const users = await UsersModel.find({}, { password: 0 }); // Exclude password field

    if (!users || users.length === 0) {
      return NextResponse.json(
        { message: "No users found", success: false },
        { status: 404 }
      );
    }

    // Format data pengguna untuk respons
    const userData = users.map((user) => ({
      email: user.email,
      fullName: user.fullName,
      date: user.date ?? null,
      age: user.age ?? null,
      gender: user.gender ?? null,
      height: user.height ?? null,
      weight: user.weight ?? null,
      BloodPressure: user.BloodPressure ?? null,
      FastingGlucose: user.FastingGlucose ?? null,
    }));

    return NextResponse.json(
      { message: "Users fetched successfully", success: true, data: userData },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in GET /user:", error);
    return NextResponse.json(
      { message: error.message || "Process failed", success: false },
      { status: 500 }
    );
  }
}