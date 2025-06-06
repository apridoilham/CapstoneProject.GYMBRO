import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API,
	api_secret: process.env.CLOUDINARY_KEY,
});

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

export default cloudinary;
