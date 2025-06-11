import { NextRequest, NextResponse } from "next/server";
import { Client } from "@gradio/client";

export async function POST(req: NextRequest) {
    try {

        const { message } = await req.json();
        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { message: "Message is required and must be a string" },
                { status: 400 }
            );
        }

        const client = await Client.connect("Mlaana/Chatbot");
        const result = await client.predict("/chat", {
            message, 		
            max_tokens: 64, 		
            temperature: 0.1, 		
            top_p: 0.1,
        });

        const chatbotOutputArray = result.data as any[];

        // Check if the response array exists and is not empty
        if (!chatbotOutputArray || chatbotOutputArray.length === 0) {
            throw new Error("Chatbot returned an empty or invalid response.");
        }
        
        // The actual response message is the first element of the array.
        const chatbotMessage = chatbotOutputArray[0];

        // Return the successful response
        return NextResponse.json({
            message: "Proccess Success", data: chatbotMessage, success: true
        });
    } catch (err: any) {
        console.error("Error during chat bot:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        return NextResponse.json(
            { message: "Message failed", error: errorMessage },
            { status: 500 }
        );
    }
}
