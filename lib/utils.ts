import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
    if (error.name === "ValidationError") {
        const validationErrors = [];
        const errorFields: any = {};

        for (const field in error.errors) {
            const errorDetails = error.errors[field];
            const fieldName = field;

            if (!errorFields[fieldName]) {
                errorFields[fieldName] = [];
            }

            let errorMessage = errorDetails.message;
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
            errorFields[fieldName].push(errorMessage);
        }

        for (const field in errorFields) {
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

interface BloodPressure {
  systolic: number;
  diastolic: number;
}

export const checkHypertensi = (inp: BloodPressure | null | undefined): boolean => {
    if (!inp || typeof inp.systolic === 'undefined' || typeof inp.diastolic === 'undefined') {
        return false;
    }
    if (inp.systolic >= 130 || inp.diastolic >= 80) {
        return true;
    }
    return false;
};

export const checkDiabet = (inp: number | null | undefined): boolean => {
    if (inp === null || typeof inp === 'undefined') {
        return false;
    }
    if (inp >= 126) {
        return true;
    }
    return false;
};