import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData();

    // Forward the request to the backend server
    const response = await fetch('https://back-6bl4.onrender.com/chat/', {
      method: 'POST',
      body: formData,
    });

    // If the response is not ok, throw an error
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    // Get the response as a readable stream
    const stream = response.body;

    // Return the stream directly to the client
    return new NextResponse(stream);
  } catch (error) {
    console.error('Error in chat API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 