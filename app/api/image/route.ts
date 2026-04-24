import { mkdir, writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import path from 'path';

export async function GET() {
  const openai = new OpenAI();

  const prompt = `
A children's book drawing of a golden retriever called Tuenti, 
sitting on a grassy hill under a starry night sky, with a full moon shining brightly above. 
The dog has a happy expression and is surrounded by colorful flowers and fireflies. 
The style is whimsical and cartoon-like, with vibrant colors and soft lines.
`;

  const result = await openai.images.generate({
    model: 'gpt-image-2',
    prompt,
  });

  const image_base64 = result.data?.[0]?.b64_json;

  if (!image_base64) {
    return NextResponse.json(
      { error: 'No image was generated' },
      { status: 500 },
    );
  }

  const generatedAt = new Date();
  const timestamp = generatedAt.toISOString().replace(/[:.]/g, '-');
  const filename = `tuenti-${timestamp}.png`;
  const imagesDirectory = path.join(process.cwd(), 'public', 'images');
  const filePath = path.join(imagesDirectory, filename);
  const image_bytes = Buffer.from(image_base64, 'base64');

  await mkdir(imagesDirectory, { recursive: true });
  await writeFile(filePath, image_bytes);

  return NextResponse.json({
    filename,
    path: `/images/${filename}`,
    generatedAt: generatedAt.toISOString(),
  });
}
