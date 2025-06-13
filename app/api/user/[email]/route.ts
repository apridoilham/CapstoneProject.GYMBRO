import { connectDB } from "@/lib/connection";
import { verifyUser, checkHypertensi, checkDiabet } from "@/lib/utils";
import UsersModel from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { email: string } }
) {
    try {
        const { email } = params;
        const token = verifyUser(req);
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const user = await UsersModel.findOne({ email });

        // Perbaikan 1: Menggunakan status 404 jika data tidak ditemukan
        if (!user) {
            return NextResponse.json(
                { message: "Data tidak ditemukan", success: false },
                { status: 404 } 
            );
        }

        const finalData = {
            email: user.email,
            fullName: user.fullName,
            date: user.date ?? null,
            age: user.age ?? null,
            gender: user.gender ?? null,
            height: user.height ?? null,
            weight: user.weight ?? null,
            BloodPressure: user.BloodPressure ?? null,
            FastingGlucose: user.FastingGlucose ?? null,
            imageUrl: user.imageUrl ?? null,
            // Perbaikan 2: Memeriksa data sebelum memanggil fungsi untuk mencegah error
            isHypertension: user.BloodPressure ? checkHypertensi(user.BloodPressure) : false,
            isDiabetes: user.FastingGlucose ? checkDiabet(user.FastingGlucose) : false,
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