import pool from '@/lib/db';
import { HardwareAsset } from '@/lib/types';
import { RowDataPacket } from 'mysql2';
import AddAssetModal from '@/components/AddAssetModal';
import AssetRowActions from '@/components/AssetRowActions';

// Server-side function to fetch hardware assets directly from MySQL
async function getAssets(): Promise<HardwareAsset[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM hardware_assets ORDER BY created_at DESC'
  );
  return rows as HardwareAsset[];
}

// Helper function to render status badges with Tailwind colors
function getStatusBadgeClass(status: HardwareAsset['status']) {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'In Repair':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'Decommissioned':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'In Storage':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

export default async function InventoryPage() {
  const assets = await getAssets();

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              IT Asset Maintenance Tracker
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Internal hardware inventory and health monitoring system
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-700">
              Total Assets: {assets.length}
            </span>
            <AddAssetModal />
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-xs uppercase font-semibold tracking-wider border-b border-slate-200">
                  <th className="py-3.5 px-4">Asset Tag</th>
                  <th className="py-3.5 px-4">Device Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Assigned To</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Notes</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                {assets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No hardware assets registered yet.
                    </td>
                  </tr>
                ) : (
                  assets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                        {asset.asset_tag}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-900">
                        {asset.asset_name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {asset.category}
                      </td>
                      <td className="py-3.5 px-4">
                        {asset.assigned_to ? (
                          <span className="text-slate-800">{asset.assigned_to}</span>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(asset.status)}`}>
                          {asset.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                        {asset.notes || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <AssetRowActions asset={asset} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}