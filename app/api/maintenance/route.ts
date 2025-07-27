import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import clientPromise from '@/lib/mongodb';
import { Document, Filter } from 'mongodb';

interface Counter extends Document {
  _id: string;
  sequence_value: number;
}

// Create transporter for Hostinger SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'maintenance@raf-advanced.sa',
    pass: 'Maintenance@12'
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Function to get and increment order number with timeout
async function getNextOrderNumber() {
  try {
    const client = await Promise.race([
      clientPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('MongoDB connection timeout')), 5000)
      )
    ]) as Awaited<typeof clientPromise>;

    const db = client.db('maintenance-requests');
    const counters = db.collection<Counter>('counters');

    const filter: Filter<Counter> = { _id: 'orderNumber' };

    // Find and update the counter atomically with timeout
    const result = await Promise.race([
      counters.findOneAndUpdate(
        filter,
        { $inc: { sequence_value: 1 } },
        { upsert: true, returnDocument: 'after' }
      ),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('MongoDB operation timeout')), 5000)
      )
    ]) as Counter | null;

    // If this is the first request ever (new counter created)
    if (!result || result.sequence_value === 1) {
      // Update it to start from 100
      await counters.updateOne(
        filter,
        { $set: { sequence_value: 100 } }
      );
      return 100;
    }

    return result.sequence_value;
  } catch (error) {
    console.error('Error getting next order number:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Starting maintenance request processing');
    const body = await request.json();
    
    // Allow numberOfProjects to be string (letters and numbers)
    const { name, numberOfFloors, phoneNumber, numberOfProjects, numberOfFlats, address, details } = body;

    if (!name || !numberOfFloors || !phoneNumber || !numberOfProjects || !numberOfFlats || !address || !details) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'All fields are required' 
        },
        { status: 400 }
      );
    }

    // Get the next sequential order number
    console.log('Getting next order number');
    const orderNumber = await getNextOrderNumber();
    const orderCode = orderNumber.toString();
    console.log('Generated order code:', orderCode);

    // Store the maintenance request in MongoDB
    console.log('Storing maintenance request');
    const client = await clientPromise;
    const db = client.db('maintenance-requests');
    await db.collection('requests').insertOne({
      orderNumber,
      name,
      numberOfFloors,
      phoneNumber,
      numberOfProjects,
      numberOfFlats,
      address,
      details,
      createdAt: new Date()
    });

    // Create email content
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; direction: rtl;">
        <div style="background-color: #540f6b; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 24px; text-align: center;">طلب صيانة المبنى</h1>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #540f6b; margin-top: 0; text-align: right;">تفاصيل الطلب</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px; direction: rtl;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px 0; font-weight: bold; color: #540f6b; width: 40%; text-align: right;">رقم الطلب:</td>
              <td style="padding: 12px 0; text-align: right;">${orderCode}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px 0; font-weight: bold; color: #540f6b; width: 40%; text-align: right;">اسم المتصل:</td>
              <td style="padding: 12px 0; text-align: right;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px 0; font-weight: bold; color: #540f6b; text-align: right;">رقم الهاتف:</td>
              <td style="padding: 12px 0; text-align: right;">${phoneNumber}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px 0; font-weight: bold; color: #540f6b; text-align: right;">رقم الدور:</td>
              <td style="padding: 12px 0; text-align: right;">${numberOfFloors}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px 0; font-weight: bold; color: #540f6b; text-align: right;">رقم الشقه:</td>
              <td style="padding: 12px 0; text-align: right;">${numberOfFlats}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px 0; font-weight: bold; color: #540f6b; text-align: right;">رقم المشروع:</td>
              <td style="padding: 12px 0; text-align: right;">${numberOfProjects}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px 0; font-weight: bold; color: #540f6b; text-align: right;">العنوان/الموقع:</td>
              <td style="padding: 12px 0; text-align: right;">${address}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-weight: bold; color: #540f6b; vertical-align: top; text-align: right;">تفاصيل الصيانة:</td>
              <td style="padding: 12px 0; white-space: pre-wrap; text-align: right;">${details}</td>
            </tr>
          </table>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 5px; border-right: 4px solid #540f6b; text-align: right;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              <strong>تاريخ ووقت الإرسال:</strong> ${new Date().toLocaleString('ar-SA', { 
                timeZone: 'Asia/Riyadh',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit',
                weekday: 'long'
              })}
            </p>
          </div>
        </div>
      </div>
    `;

    // Send email
    console.log('Sending email notification');
    const mailOptions = {
      from: 'maintenance@raf-advanced.sa',
      to: 'maintenance@raf-advanced.sa',
      subject: `طلب صيانة المبنى - ${name}`,
      html: emailContent,
      text: `
        طلب صيانة المبنى
        
        رقم الطلب: ${orderCode}
        اسم المتصل: ${name}
        رقم الهاتف: ${phoneNumber}
        رقم الدور: ${numberOfFloors}
        رقم الشقه: ${numberOfFlats}
        رقم المشروع: ${numberOfProjects}
        
        العنوان/الموقع: ${address}
        
        تفاصيل الصيانة:
        ${details}
        
        تاريخ ووقت الإرسال: ${new Date().toLocaleString('ar-SA', { 
          timeZone: 'Asia/Riyadh',
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit',
          weekday: 'long'
        })}
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    
    return NextResponse.json(
      { 
        success: true,
        orderCode,
        message: 'Maintenance request submitted successfully' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing maintenance request:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to process maintenance request. Please try again later.' 
      },
      { status: 500 }
    );
  }
} 