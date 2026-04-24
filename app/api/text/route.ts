import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET(request: NextRequest) {
  const client = new OpenAI();

  const response = await client.responses.create({
    model: 'gpt-5.4-nano',
    input:
      'Write a one-sentence bedtime story about a golden retriever called Tuenti.',
  });

  console.log(response.output_text);

  return NextResponse.json({ text: response.output_text });
}
