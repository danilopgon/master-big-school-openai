import { mkdir, writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import path from 'path';

export async function GET() {
  const openai = new OpenAI();

  // Generate an audio response to the given prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-audio',
    modalities: ['text', 'audio'],
    audio: { voice: 'echo', format: 'mp3' },
    messages: [
      {
        role: 'system',
        content:
          'Eres un generador de audio. La salida textual puede quedar vacia. No debes narrar confirmaciones, explicaciones, saludos ni frases de asistencia dentro del audio. El audio debe contener solamente las palabras y sonidos solicitados por el usuario.',
      },
      {
        role: 'user',
        content:
          'Crea un audio corto, calido, alegre y reproducible en bucle, con la tematica de un golden retriever llamado Tuenti en una colina con flores. Debe sonar tierno y de cuento infantil, con voz amable y suave. El audio debe contener palabras reconocibles y un pequeno ladrido jugueton. Di unicamente esta frase: "Tuenti, buen chico". Despues anade un ladrido suave. No digas "entendido", "aqui esta tu audio", ni ninguna explicacion.',
      },
    ],
    store: true,
  });

  const audioBase64 = response.choices[0]?.message.audio?.data;

  if (!audioBase64) {
    return NextResponse.json(
      { error: 'No audio was generated' },
      { status: 500 },
    );
  }

  const generatedAt = new Date();
  const timestamp = generatedAt.toISOString().replace(/[:.]/g, '-');
  const filename = `tuenti-golden-retriever-${timestamp}.mp3`;
  const audiosDirectory = path.join(process.cwd(), 'public', 'audios');
  const filePath = path.join(audiosDirectory, filename);
  const audioBytes = Buffer.from(audioBase64, 'base64');

  await mkdir(audiosDirectory, { recursive: true });
  await writeFile(filePath, audioBytes);

  return NextResponse.json({
    filename,
    path: `/audios/${filename}`,
    generatedAt: generatedAt.toISOString(),
  });
}
