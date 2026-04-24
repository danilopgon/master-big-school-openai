import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET(request: NextRequest) {
  const openai = new OpenAI();

  const response = await openai.responses.create({
    model: 'gpt-4.1-mini',
    input: [
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: 'Devuelve una lista de tags relacionados con la imagen que te voy a mostrar',
          },
          {
            type: 'input_image',
            detail: 'auto',
            image_url:
              'https://api.nga.gov/iiif/a2e6da57-3cd1-4235-b20e-95dcaefed6c8/full/!800,800/0/default.jpg',
          },
        ],
      },
    ],
  });

  console.log(response.output_text);
  return NextResponse.json({ text: response.output_text });
}
