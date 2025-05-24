import { NextRequest, NextResponse } from 'next/server';

interface Message {
  type: 'user' | 'bot';
  content: string;
  id: string;
}

interface RequestBody {
  message: string;
  conversationHistory: Message[];
}

export async function GET() {
  return NextResponse.json({ status: 'Groq Chat API is running' });
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 });
    }

    const body: RequestBody = await request.json();
    const { message, conversationHistory } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required and must be a string' }, { status: 400 });
    }

    // Bangun konteks pesan
    const messages = [
      {
        role: 'system',
        content: `You are GYM BRO AI, an enthusiastic and knowledgeable fitness assistant with a bro personality. You should:
        - Use casual, friendly "bro" language but stay helpful and informative
        - Provide practical fitness, nutrition, and workout advice
        - Be motivational and encouraging
        - Keep responses concise but detailed enough to be useful
        - Use emojis occasionally to keep it fun
        - If asked about something outside fitness/health, redirect back to fitness topics
        - Always prioritize safety in workout recommendations`
      },
      // Ambil 5 pesan terakhir untuk konteks
      ...conversationHistory.slice(-5).flatMap(msg => {
        if (msg.type === 'user') return [{ role: 'user', content: msg.content }];
        if (msg.type === 'bot') return [{ role: 'assistant', content: msg.content }];
        return [];
      }),
      { role: 'user', content: message }
    ];

    // Kirim ke Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        max_tokens: 300,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', errorText);
      return NextResponse.json({ error: 'Failed to fetch from Groq API', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from Groq API');
    }

    return NextResponse.json({
      message: aiResponse,
      usage: data.usage,
    });

  } catch (error) {
    console.error('API handler error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
