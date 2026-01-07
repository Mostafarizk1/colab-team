import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwHuh0rSDfhVzCAp07zNvnQrNUNbFUxjM-0LQE_WWW69LOtjtRUJrFwFPp-HobJLezV/exec';

interface FormData {
  name: string;
  professions: string[];
  skill: string;
  portfolio1: string;
  portfolio2: string;
  experience: string;
  phone: string;
  email: string;
  country: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: FormData = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.skill || !data.portfolio1 || !data.experience || !data.country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!data.professions || data.professions.length === 0) {
      return NextResponse.json(
        { error: 'At least one profession is required' },
        { status: 400 }
      );
    }

    // Send to Google Sheets
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(data),
      redirect: 'follow',
    });

    const result = await response.text();
    console.log('Google Sheets response:', result);
    console.log('Freelancer saved to Google Sheets:', data.name, data.professions);

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
    });
  } catch (error: any) {
    console.error('Submit error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit form' },
      { status: 500 }
    );
  }
}
