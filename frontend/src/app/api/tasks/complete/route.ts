import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData();

    // Ensure we have the required parameters
    const user_id = formData.get('user_id');
    const task_id = formData.get('task_id');

    if (!user_id || !task_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    console.log(`Marking task ${task_id} as complete for user ${user_id}`);

    // Forward the request to the backend server
    const response = await fetch('http://localhost:5000/tasks/complete/', {
      method: 'POST',
      body: formData,
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
    console.error('Error in tasks/complete API route:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 