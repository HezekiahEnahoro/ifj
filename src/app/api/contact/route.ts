import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

export async function POST(request: NextRequest) {
  console.log('📨 POST request received')
  
  try {
    const body = await request.json()
    
    // Validate input
    const result = contactSchema.safeParse(body)
    
    if (!result.success) {
      const errors = result.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message
      }))
      
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: errors 
        },
        { status: 400 }
      )
    }
    
    const validatedData = result.data
    
    // Check environment variables
    const apiKey = process.env.RESEND_API_KEY
    const contactEmail = process.env.CONTACT_EMAIL
    
    if (!apiKey || !contactEmail) {
      console.error('Missing environment variables')
      // For development, just log
      console.log('\n📧 === Contact Form Submission ===')
      console.log('Name:', validatedData.name)
      console.log('Email:', validatedData.email)
      console.log('Subject:', validatedData.subject)
      console.log('Message:', validatedData.message)
      console.log('===================================\n')
      
      return NextResponse.json(
        { 
          success: true,
          message: 'Message logged (dev mode - no email configured)',
        },
        { status: 200 }
      )
    }
    
    // Send email using Resend
    const emailPayload = {
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: contactEmail,
      reply_to: validatedData.email,
      subject: `Portfolio: ${validatedData.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0;">New Contact Form Message</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <div style="margin-bottom: 20px;">
                <p style="color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 5px;">From</p>
                <p style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea; margin: 0;"><strong>${escapeHtml(validatedData.name)}</strong></p>
              </div>
              <div style="margin-bottom: 20px;">
                <p style="color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 5px;">Email</p>
                <p style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea; margin: 0;">${escapeHtml(validatedData.email)}</p>
              </div>
              <div style="margin-bottom: 20px;">
                <p style="color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 5px;">Subject</p>
                <p style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea; margin: 0;">${escapeHtml(validatedData.subject)}</p>
              </div>
              <div style="margin-bottom: 20px;">
                <p style="color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 5px;">Message</p>
                <p style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea; margin: 0; white-space: pre-wrap;">${escapeHtml(validatedData.message)}</p>
              </div>
            </div>
          </body>
        </html>
      `,
    }

    console.log('📤 Sending email via Resend...')
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ Resend API error:', data)
      throw new Error(data.message || 'Failed to send email')
    }

    console.log('✅ Email sent successfully! ID:', data.id)
    
    // Also log to console
    console.log('\n📧 === Email Sent ===')
    console.log('To:', contactEmail)
    console.log('From:', validatedData.name, `<${validatedData.email}>`)
    console.log('Subject:', validatedData.subject)
    console.log('===================\n')

    return NextResponse.json(
      { 
        success: true,
        message: 'Message sent successfully!',
        id: data.id 
      },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('❌ Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to send message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Contact API is working. Use POST to send messages.' },
    { status: 200 }
  )
}