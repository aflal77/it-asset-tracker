export interface HardwareAsset {
  id: number;
  asset_tag: string;
  asset_name: string;
  category: string;
  assigned_to: string | null;
  status: 'Active' | 'In Repair' | 'Decommissioned' | 'In Storage';
  notes: string | null;
  created_at: string;
}