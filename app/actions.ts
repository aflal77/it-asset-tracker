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
}// Server Action to update an asset's status and assigned user
export async function updateAssetStatus(id: number, status: string, assigned_to: string | null) {
  if (!id || !status) {
    throw new Error('Asset ID and status are required.');
  }

  try {
    await pool.query(
      `UPDATE hardware_assets 
       SET status = ?, assigned_to = ? 
       WHERE id = ?`,
      [status, assigned_to, id]
    );

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: 'Failed to update asset status.' };
  }
}

// Server Action to safely delete a hardware asset
export async function deleteAsset(id: number) {
  if (!id) {
    throw new Error('Asset ID is required.');
  }

  try {
    await pool.query('DELETE FROM hardware_assets WHERE id = ?', [id]);

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: 'Failed to delete hardware asset.' };
  }
}