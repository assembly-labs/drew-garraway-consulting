import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { ContactSubmission } from '@/lib/types';

// TODO: Add email notification when new contact submission is received
// TODO: Add reCAPTCHA or similar spam protection

const dataDirectory = path.join(process.cwd(), 'data');
const contactFile = path.join(dataDirectory, 'contact.json');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Name is required.' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!subject || typeof subject !== 'string' || !subject.trim()) {
      return NextResponse.json(
        { success: false, message: 'Subject is required.' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { success: false, message: 'Message is required.' },
        { status: 400 }
      );
    }

    // Create submission object
    const submission: ContactSubmission = {
      id: `contact_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      submitted_at: new Date().toISOString(),
    };

    // Log submission
    console.log('[Contact Submission] New submission:', {
      id: submission.id,
      name: submission.name,
      email: submission.email,
      subject: submission.subject,
    });

    // Ensure data directory exists
    if (!fs.existsSync(dataDirectory)) {
      fs.mkdirSync(dataDirectory, { recursive: true });
    }

    // Read existing submissions
    let submissions: ContactSubmission[] = [];
    if (fs.existsSync(contactFile)) {
      const fileContents = fs.readFileSync(contactFile, 'utf8');
      submissions = JSON.parse(fileContents);
    }

    // Append new submission
    submissions.push(submission);

    // Write back to file
    fs.writeFileSync(contactFile, JSON.stringify(submissions, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.',
    });
  } catch (error) {
    console.error('[Contact Submission] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
