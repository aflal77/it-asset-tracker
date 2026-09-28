import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Run a simple test query to verify MySQL connection
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    return NextResponse.json({ 
      success: true, 
      message: 'MySQL Connected Successfully!', 
      data: rows 
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}