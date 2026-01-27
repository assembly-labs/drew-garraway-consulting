import { useNavigate } from 'react-router-dom';
import { Printer, ScanLine, AlertTriangle } from 'lucide-react';
import { useOps } from '../../context/OpsContext';
import StatCard from '../../components/ops/StatCard';
import SlotHealthBar from '../../components/ops/SlotHealthBar';
import StatusBadge from '../../components/ops/StatusBadge';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { getDashboardStats, getOrdersByStatus, pickupSlots } = useOps();

  const stats = getDashboardStats();
  const issueOrders = getOrdersByStatus('issues');

  return (
    <div className="p-4 space-y-6">
      {/* Stats Cards */}
      <section>
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            value={stats.pendingOrders}
            label="Pending"
            sublabel="need packing"
            variant="default"
            onClick={() => navigate('/ops/orders?status=pending')}
          />
          <StatCard
            value={stats.packedOrders}
            label="Packed"
            sublabel="ready for pickup"
            variant="success"
            onClick={() => navigate('/ops/orders?status=packed')}
          />
          <StatCard
            value={stats.issueOrders}
            label="Issues"
            sublabel="needs attention"
            variant={stats.issueOrders > 0 ? 'warning' : 'muted'}
            onClick={() => navigate('/ops/orders?status=issues')}
          />
        </div>
      </section>

      {/* Pickup Slots */}
      <section>
        <h3 className="text-sm font-semibold text-[#37352F] mb-3 uppercase tracking-wide">
          Pickup Slots
        </h3>
        <div className="space-y-2">
          {stats.slotStats.map(slot => (
            <SlotHealthBar
              key={slot.slotId}
              slot={slot}
              onClick={() => navigate(`/ops/orders?slot=${slot.slotId}`)}
            />
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h3 className="text-sm font-semibold text-[#37352F] mb-3 uppercase tracking-wide">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/ops/pick-lists')}
            className="flex items-center justify-center gap-3 p-4 bg-white rounded-xl border-2 border-[#E3E2E0] hover:border-[#4A7C28] hover:shadow-md transition-all"
          >
            <Printer size={24} className="text-[#4A7C28]" />
            <div className="text-left">
              <p className="font-semibold text-[#37352F]">Print Pick Lists</p>
              <p className="text-xs text-[#787774]">For all vendors</p>
            </div>
          </button>
          <button
            onClick={() => navigate('/ops/check-in')}
            className="flex items-center justify-center gap-3 p-4 bg-gradient-to-br from-[#FFE082] via-[#81C784] to-[#4CAF50] rounded-xl hover:shadow-lg transition-all"
          >
            <ScanLine size={24} className="text-white" />
            <div className="text-left">
              <p className="font-semibold text-white">Start Check-in</p>
              <p className="text-xs text-white/80">Scan QR codes</p>
            </div>
          </button>
        </div>
      </section>

      {/* Issues Queue */}
      {issueOrders.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-[#37352F] mb-3 uppercase tracking-wide flex items-center gap-2">
            <AlertTriangle size={16} className="text-[#FF6B6B]" />
            Needs Attention ({issueOrders.length})
          </h3>
          <div className="space-y-2">
            {issueOrders.slice(0, 5).map(order => {
              const unavailableItem = order.items.find(item => item.status === 'unavailable');
              return (
                <button
                  key={order.id}
                  onClick={() => navigate(`/ops/orders?order=${order.id}`)}
                  className="w-full p-3 bg-white rounded-lg border border-[#FFCDD2] hover:border-[#FF6B6B] transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#37352F]">
                        {order.orderNumber}
                      </span>
                      <StatusBadge status="unavailable" size="sm" />
                    </div>
                    <span className="text-xs text-[#787774]">
                      {pickupSlots.find(s => s.id === order.pickupSlotId)?.label}
                    </span>
                  </div>
                  {unavailableItem && (
                    <p className="text-sm text-[#787774] mt-1">
                      {unavailableItem.productName} unavailable
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Market Summary */}
      <section className="pb-4">
        <div className="p-4 bg-[#E8F5E9] rounded-xl border border-[#81C784]">
          <h3 className="font-semibold text-[#2E7D32] mb-2">Today's Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[#787774]">Total Orders</p>
              <p className="font-bold text-[#37352F]">{stats.totalOrders}</p>
            </div>
            <div>
              <p className="text-[#787774]">Picked Up</p>
              <p className="font-bold text-[#37352F]">{stats.pickedUpOrders}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
