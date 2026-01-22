import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { NewsletterSubscriber } from '@/lib/types';

// TODO: Integrate with email service (Mailchimp, ConvertKit, Resend, etc.)

const dataDirectory = path.join(process.cwd(), 'data');
const newsletterFile = path.join(dataDirectory, 'newsletter.json');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Log the subscription attempt
    console.log(`[Newsletter Subscription] New signup: ${normalizedEmail}`);

    // Ensure data directory exists
    if (!fs.existsSync(dataDirectory)) {
      fs.mkdirSync(dataDirectory, { recursive: true });
    }

    // Read existing subscribers
    let subscribers: NewsletterSubscriber[] = [];
    if (fs.existsSync(newsletterFile)) {
      const fileContents = fs.readFileSync(newsletterFile, 'utf8');
      subscribers = JSON.parse(fileContents);
    }

    // Check for duplicates
    const isDuplicate = subscribers.some(
      (sub) => sub.email.toLowerCase() === normalizedEmail
    );

    if (isDuplicate) {
      return NextResponse.json({
        success: true,
        message: 'You\'re already subscribed!',
      });
    }

    // Add new subscriber
    const subscriber: NewsletterSubscriber = {
      email: normalizedEmail,
      subscribed_at: new Date().toISOString(),
    };

    subscribers.push(subscriber);

    // Write back to file
    fs.writeFileSync(newsletterFile, JSON.stringify(subscribers, null, 2));

    // TODO: Add actual email service integration here
    // Example with Resend:
    // await resend.contacts.create({
    //   email: normalizedEmail,
    //   audienceId: process.env.RESEND_AUDIENCE_ID,
    // });

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing!',
    });
  } catch (error) {
    console.error('[Newsletter Subscription] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
