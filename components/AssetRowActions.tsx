'use client';

import { useState } from 'react';
import { updateAssetStatus, deleteAsset } from '@/app/actions';
import { HardwareAsset } from '@/lib/types';

interface AssetRowActionsProps {
  asset: HardwareAsset;
}

export default function AssetRowActions({ asset }: AssetRowActionsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<HardwareAsset['status']>(asset.status);
  const [assignedTo, setAssignedTo] = useState(asset.assigned_to || '');
  const [loading, setLoading] = useState(false);

  async function handleUpdate() {
    setLoading(true);
    await updateAssetStatus(asset.id, status, assignedTo || null);
    setLoading(false);
    setIsEditing(false);
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete asset "${asset.asset_tag}" (${asset.asset_name})?`
    );
    if (!confirmed) return;

    setLoading(true);
    await deleteAsset(asset.id);
    setLoading(false);
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as HardwareAsset['status'])}
          className="px-2 py-1 border border-slate-300 rounded text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="Active">Active</option>
          <option value="In Storage">In Storage</option>
          <option value="In Repair">In Repair</option>
          <option value="Decommissioned">Decommissioned</option>
        </select>

        <input
          type="text"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          placeholder="Assigned user..."
          className="px-2 py-1 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-28"
        />

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium"
        >
          Save
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-medium"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setIsEditing(true)}
        className="px-2.5 py-1 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded transition-colors"
      >
        Edit
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="px-2.5 py-1 border border-red-200 hover:bg-red-50 text-red-600 text-xs font-medium rounded transition-colors disabled:opacity-50"
      >
        {loading ? '...' : 'Delete'}
      </button>
    </div>
  );
}