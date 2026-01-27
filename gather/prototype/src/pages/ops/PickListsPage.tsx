import { useState, useMemo } from 'react';
import { Printer, CheckCircle2, Circle } from 'lucide-react';
import { useOps } from '../../context/OpsContext';
import PickListVendor from '../../components/ops/PickListVendor';

export default function PickListsPage() {
  const { getPickListByVendor, updateItemStatus, orders } = useOps();
  const [expandedVendors, setExpandedVendors] = useState<Set<string>>(new Set());

  // Get pick lists
  const vendorPickLists = useMemo(() => getPickListByVendor(), [orders, getPickListByVendor]);

  // Calculate overall stats
  const overallStats = useMemo(() => {
    const total = vendorPickLists.reduce((sum, v) => sum + v.totalItems, 0);
    const packed = vendorPickLists.reduce((sum, v) => sum + v.packedItems, 0);
    const complete = vendorPickLists.filter(v => v.packedItems === v.totalItems && v.totalItems > 0).length;
    return { total, packed, complete, totalVendors: vendorPickLists.length };
  }, [vendorPickLists]);

  const toggleVendor = (vendorId: string) => {
    setExpandedVendors(prev => {
      const next = new Set(prev);
      if (next.has(vendorId)) {
        next.delete(vendorId);
      } else {
        next.add(vendorId);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedVendors(new Set(vendorPickLists.map(v => v.vendorId)));
  };

  const collapseAll = () => {
    setExpandedVendors(new Set());
  };

  const handleItemToggle = (orderId: string, itemId: string) => {
    // Find current status and toggle
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    const item = order.items.find(i => i.id === itemId);
    if (!item) return;

    const newStatus = item.status === 'packed' ? 'pending' : 'packed';
    updateItemStatus(orderId, itemId, newStatus);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="px-3 py-1.5 text-sm text-[#787774] hover:text-[#37352F] hover:bg-[#F7F6F3] rounded-lg transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1.5 text-sm text-[#787774] hover:text-[#37352F] hover:bg-[#F7F6F3] rounded-lg transition-colors"
          >
            Collapse All
          </button>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-[#4A7C28] text-white rounded-lg hover:bg-[#3A6A1F] transition-colors print:hidden"
        >
          <Printer size={18} />
          Print All
        </button>
      </div>

      {/* Summary */}
      <div className="bg-[#E8F5E9] rounded-xl p-4">
        <h3 className="font-semibold text-[#2E7D32] mb-3">Vendor Progress</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-[#37352F]">{overallStats.complete}</p>
            <p className="text-xs text-[#787774]">Vendors Complete</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#37352F]">
              {overallStats.totalVendors - overallStats.complete}
            </p>
            <p className="text-xs text-[#787774]">In Progress</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#37352F]">{overallStats.packed}/{overallStats.total}</p>
            <p className="text-xs text-[#787774]">Items Packed</p>
          </div>
        </div>
      </div>

      {/* Vendor Progress List */}
      <section>
        <h3 className="text-sm font-semibold text-[#787774] uppercase tracking-wide mb-3">
          Status by Vendor
        </h3>
        <div className="space-y-2 mb-4">
          {vendorPickLists.map(vendor => {
            const isComplete = vendor.packedItems === vendor.totalItems && vendor.totalItems > 0;
            const hasStarted = vendor.packedItems > 0;
            return (
              <div
                key={vendor.vendorId}
                className="flex items-center justify-between p-2 bg-white rounded-lg border border-[#E3E2E0]"
              >
                <div className="flex items-center gap-2">
                  {isComplete ? (
                    <CheckCircle2 size={18} className="text-[#3DDC97]" />
                  ) : hasStarted ? (
                    <Circle size={18} className="text-[#FFA726]" fill="#FFA726" strokeWidth={0} />
                  ) : (
                    <Circle size={18} className="text-[#E3E2E0]" />
                  )}
                  <span className="text-sm font-medium text-[#37352F]">{vendor.vendorName}</span>
                </div>
                <span className="text-xs text-[#787774]">
                  {vendor.packedItems}/{vendor.totalItems}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pick Lists */}
      <section className="print:block">
        <h3 className="text-sm font-semibold text-[#787774] uppercase tracking-wide mb-3 print:hidden">
          Pick Lists
        </h3>
        <div className="space-y-3">
          {vendorPickLists.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-xl border border-[#E3E2E0]">
              <p className="text-[#787774]">All items have been packed!</p>
            </div>
          ) : (
            vendorPickLists.map(vendor => (
              <PickListVendor
                key={vendor.vendorId}
                vendorPickList={vendor}
                isExpanded={expandedVendors.has(vendor.vendorId)}
                onToggle={() => toggleVendor(vendor.vendorId)}
                onItemToggle={handleItemToggle}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
