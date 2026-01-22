import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// TODO: Add email notification when new partner inquiry is submitted
// TODO: Integration with CRM (HubSpot, Salesforce, etc.)
// TODO: Add reCAPTCHA or similar spam protection

interface PartnerInquiry {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  interestAreas: string[];
  message: string;
  submitted_at: string;
  status: 'new' | 'contacted' | 'in_discussion' | 'closed';
}

const dataDirectory = path.join(process.cwd(), 'data');
const partnersFile = path.join(dataDirectory, 'partners.json');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyName, contactName, email, phone, interestAreas, message } = body;

    // Validate required fields
    if (!companyName || typeof companyName !== 'string' || !companyName.trim()) {
      return NextResponse.json(
        { success: false, message: 'Company name is required.' },
        { status: 400 }
      );
    }

    if (!contactName || typeof contactName !== 'string' || !contactName.trim()) {
      return NextResponse.json(
        { success: false, message: 'Contact name is required.' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!interestAreas || !Array.isArray(interestAreas) || interestAreas.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Please select at least one area of interest.' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { success: false, message: 'Please tell us about your organization.' },
        { status: 400 }
      );
    }

    // Create inquiry object
    const inquiry: PartnerInquiry = {
      id: `partner_${Date.now()}`,
      companyName: companyName.trim(),
      contactName: contactName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || undefined,
      interestAreas,
      message: message.trim(),
      submitted_at: new Date().toISOString(),
      status: 'new',
    };

    // Log submission
    console.log('[Partner Inquiry] New inquiry:', {
      id: inquiry.id,
      companyName: inquiry.companyName,
      contactName: inquiry.contactName,
      email: inquiry.email,
      interestAreas: inquiry.interestAreas,
    });

    // Ensure data directory exists
    if (!fs.existsSync(dataDirectory)) {
      fs.mkdirSync(dataDirectory, { recursive: true });
    }

    // Read existing inquiries
    let inquiries: PartnerInquiry[] = [];
    if (fs.existsSync(partnersFile)) {
      const fileContents = fs.readFileSync(partnersFile, 'utf8');
      inquiries = JSON.parse(fileContents);
    }

    // Append new inquiry
    inquiries.push(inquiry);

    // Write back to file
    fs.writeFileSync(partnersFile, JSON.stringify(inquiries, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Thank you for your interest in partnering with Locally Strong! We\'ll be in touch soon.',
      id: inquiry.id,
    });
  } catch (error) {
    console.error('[Partner Inquiry] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
