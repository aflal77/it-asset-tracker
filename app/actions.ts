'use server';

import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Server Action to create a new hardware asset
export async function createAsset(formData: FormData) {
  const asset_tag = formData.get('asset_tag') as string;
  const asset_name = formData.get('asset_name') as string;
  const category = formData.get('category') as string;
  const assigned_to = (formData.get('assigned_to') as string) || null;
  const status = formData.get('status') as string;
  const notes = (formData.get('notes') as string) || null;

  // Basic server-side input validation
  if (!asset_tag || !asset_name || !category || !status) {
    throw new Error('Required fields are missing.');
  }

  try {
    // Parameterized SQL query to prevent SQL Injection
    await pool.query(
      `INSERT INTO hardware_assets (asset_tag, asset_name, category, assigned_to, status, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [asset_tag, asset_name, category, assigned_to, status, notes]
    );

    // Revalidate the home page so the new item appears instantly in the table
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    // Handle unique constraint error on asset_tag
    if (error.code === 'ER_DUP_ENTRY') {
      return { success: false, error: 'Asset Tag already exists. Please use a unique tag.' };
    }
    return { success: false, error: 'Failed to create hardware asset.' };
  }
}