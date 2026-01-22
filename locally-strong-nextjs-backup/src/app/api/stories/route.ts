import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { StorySubmission } from '@/lib/types';

const dataDirectory = path.join(process.cwd(), 'data');
const submissionsFile = path.join(dataDirectory, 'submissions.json');

// TODO: Add email notification to admin when new story is submitted
// TODO: Integration with Airtable/Notion for easier management
// TODO: Add reCAPTCHA or similar spam protection

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, storyTitle, story, consent } = body;

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

    if (!storyTitle || typeof storyTitle !== 'string' || !storyTitle.trim()) {
      return NextResponse.json(
        { success: false, message: 'Story title is required.' },
        { status: 400 }
      );
    }

    if (!story || typeof story !== 'string' || story.trim().length < 100) {
      return NextResponse.json(
        { success: false, message: 'Story must be at least 100 characters.' },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        { success: false, message: 'You must agree to allow publication.' },
        { status: 400 }
      );
    }

    // Create submission object
    const submission: StorySubmission = {
      id: `story_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || undefined,
      storyTitle: storyTitle.trim(),
      story: story.trim(),
      consent: true,
      submitted_at: new Date().toISOString(),
      status: 'pending',
    };

    // Log submission
    console.log('[Story Submission] New submission:', {
      id: submission.id,
      name: submission.name,
      email: submission.email,
      storyTitle: submission.storyTitle,
    });

    // Ensure data directory exists
    if (!fs.existsSync(dataDirectory)) {
      fs.mkdirSync(dataDirectory, { recursive: true });
    }

    // Read existing submissions
    let submissions: StorySubmission[] = [];
    if (fs.existsSync(submissionsFile)) {
      const fileContents = fs.readFileSync(submissionsFile, 'utf8');
      submissions = JSON.parse(fileContents);
    }

    // Append new submission
    submissions.push(submission);

    // Write back to file
    fs.writeFileSync(submissionsFile, JSON.stringify(submissions, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Thank you for sharing your story! We will review it and get back to you.',
      id: submission.id,
    });
  } catch (error) {
    console.error('[Story Submission] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
