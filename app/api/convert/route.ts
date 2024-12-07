import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('image') as Blob | null;

        if (!file) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const webpBuffer = await sharp(buffer)
            .webp({ quality: 80 })
            .resize(200, 200)
            .toBuffer();

        return new NextResponse(webpBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'image/webp',
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Error converting image:', error);
        return NextResponse.json({ error: 'Failed to convert image' }, { status: 500 });
    }
}

