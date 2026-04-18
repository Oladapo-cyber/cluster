import { useEffect, useMemo, useState } from 'react';
import { fetchAdminDeliveryFees, updateAdminDeliveryFee } from '../../services/admin';

const toNaira = (feeKobo: number): string => String(Math.round(feeKobo / 100));
const toKobo = (feeNaira: string): number | null => {
  if (!feeNaira.trim()) {
    return null;
  }

  const parsed = Number(feeNaira);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return Math.round(parsed * 100);
};

const DeliveryFeesPage = () => {
  const [fees, setFees] = useState<Record<'Mainland' | 'Island', string>>({
    Mainland: '3000',
    Island: '2000',
  });
  const [loading, setLoading] = useState(true);
  const [savingLocation, setSavingLocation] = useState<'Mainland' | 'Island' | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const rows = await fetchAdminDeliveryFees();
      const mainland = rows.find((row) => row.location === 'Mainland');
      const island = rows.find((row) => row.location === 'Island');

      setFees({
        Mainland: mainland ? toNaira(mainland.fee_kobo) : '3000',
        Island: island ? toNaira(island.fee_kobo) : '2000',
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load delivery fees.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const preview = useMemo(() => {
    const mainland = toKobo(fees.Mainland);
    const island = toKobo(fees.Island);

    return {
      Mainland: mainland !== null ? `N${Math.round(mainland / 100).toLocaleString()}` : 'Invalid amount',
      Island: island !== null ? `N${Math.round(island / 100).toLocaleString()}` : 'Invalid amount',
    };
  }, [fees]);

  const saveFee = async (location: 'Mainland' | 'Island') => {
    const feeKobo = toKobo(fees[location]);

    if (feeKobo === null) {
      setError(`Enter a valid non-negative number for ${location}.`);
      return;
    }

    setSavingLocation(location);
    setError(null);
    setMessage(null);

    try {
      await updateAdminDeliveryFee({ location, fee_kobo: feeKobo });
      setMessage(`${location} delivery fee updated successfully.`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : `Failed to update ${location} fee.`);
    } finally {
      setSavingLocation(null);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold text-[#101828]">Delivery Fees</h1>
      <p className="text-sm text-[#4B5563]">
        Configure checkout delivery fees by location. Values are in Naira and applied to new orders.
      </p>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-emerald-700">{message}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {(['Mainland', 'Island'] as const).map((location) => (
          <div key={location} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-[#101828] mb-3">{location}</h2>
            <label className="block text-xs text-[#6B7280] mb-1">Fee (Naira)</label>
            <input
              type="number"
              min={0}
              step="1"
              value={fees[location]}
              onChange={(event) => {
                setMessage(null);
                setError(null);
                setFees((prev) => ({ ...prev, [location]: event.target.value }));
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#45AAB8] focus:outline-none focus:ring-2 focus:ring-[#45AAB8]/30"
            />
            <p className="mt-2 text-xs text-[#6B7280]">Current preview: {preview[location]}</p>
            <button
              type="button"
              disabled={loading || savingLocation === location}
              onClick={() => {
                void saveFee(location);
              }}
              className="mt-3 rounded-lg bg-[#45AAB8] px-3 py-2 text-xs font-semibold text-white hover:bg-[#3d98a5] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {savingLocation === location ? 'Saving...' : `Save ${location} Fee`}
            </button>
          </div>
        ))}
      </div>

      {loading && <p className="text-sm text-[#6B7280]">Loading fees...</p>}
    </div>
  );
};

export default DeliveryFeesPage;
