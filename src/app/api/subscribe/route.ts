import { NextResponse } from 'next/server';
import { getCTAConfig } from '@/utils/content';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Get list ID from CTA config
    const ctaConfig = await getCTAConfig();
    const listId = ctaConfig.email?.listId;

    console.log('CTA Config:', ctaConfig);
    console.log('List ID:', listId);

    if (!listId) {
      throw new Error('Brevo list ID not configured');
    }

    // Prepare request body
    const requestBody = {
      email,
      listIds: [listId],
      updateEnabled: true
    };

    console.log('Request body:', requestBody);
    console.log('API Key length:', (process.env.BREVO_API_KEY || '').length);

    // Add contact to Brevo list
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': process.env.BREVO_API_KEY || ''
      },
      body: JSON.stringify(requestBody)
    });

    // Log response status and headers for debugging
    console.log('Brevo response status:', response.status);
    console.log('Brevo response headers:', Object.fromEntries(response.headers.entries()));

    // Handle different response types
    if (response.status === 204) {
      // Success with no content
      return NextResponse.json(
        { message: 'Subscribed successfully' },
        { status: 200 }
      );
    }

    // For other status codes, try to parse the response
    const responseText = await response.text();
    console.log('Brevo response text:', responseText);

    // Try to parse JSON if there is any
    let data;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error('Failed to parse Brevo response:', e);
      throw new Error('Invalid response from Brevo');
    }

    if (!response.ok) {
      // Handle duplicate contacts gracefully
      if (response.status === 400 && data.message?.includes('Contact already exist')) {
        return NextResponse.json(
          { message: 'Already subscribed' },
          { status: 200 }
        );
      }
      throw new Error(data.message || 'Failed to subscribe');
    }

    return NextResponse.json(
      { message: 'Subscribed successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
