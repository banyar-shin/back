import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the user_id from the query parameters
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json(
        { error: 'Missing user_id parameter' },
        { status: 400 }
      );
    }

    // Forward the request to the backend server
    const response = await fetch(`http://localhost:5000/tasks/?user_id=${encodeURIComponent(user_id)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    // If the response is not ok, throw an error
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    // Get the response as JSON
    const data = await response.json();

    // Return the response
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in tasks API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}