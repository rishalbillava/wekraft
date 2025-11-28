import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Store, 
  Truck, 
  Package, 
  Calculator, 
  Settings, 
  LogOut, 
  Search, 
  Plus, 
  Bell,
  ChevronRight,
  Sun,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  DollarSign,
  TrendingUp,
  Box,
  Edit2,
  Trash2,
  X,
  Save,
  MoreVertical,
  UploadCloud,
  FileSpreadsheet
} 
from 'lucide-react';

// --- Initial Mock Data ---
const INITIAL_DEALERS = [
  { id: 1, name: "Sunrise Solar Solutions", location: "Tumkur", phone: "+91 98765 43210", creditLimit: 500000, outstanding: 120000, status: "Active" },
  { id: 2, name: "Green Earth Retailers", location: "Mysore", phone: "+91 99887 76655", creditLimit: 1000000, outstanding: 850000, status: "Overdue" },
  { id: 3, name: "PowerPlus Electronics", location: "Hubli", phone: "+91 91234 56789", creditLimit: 250000, outstanding: 0, status: "Active" },
];

const INITIAL_ORDERS = [
  { id: 'ORD-2024-001', dealer: "Sunrise Solar Solutions", items: "120x Adani 540W", value: "₹15,40,000", stage: "Dispatched", date: "2024-11-28" },
  { id: 'ORD-2024-002', dealer: "Green Earth Retailers", items: "50x Tata 450W", value: "₹6,25,000", stage: "Picking", date: "2024-11-27" },
  { id: 'ORD-2024-003', dealer: "PowerPlus Electronics", items: "10x Growatt 5kW", value: "₹4,50,000", stage: "New Order", date: "2024-11-28" },
];

const INITIAL_INVENTORY = [
  { id: 'P01', item: "Adani Mono PERC 540W", category: "Solar Panels", stock: 1200, unit: "Pcs", warehouse: "BLR-WH1", status: "In Stock" },
  { id: 'P02', item: "Tata Power 450W Poly", category: "Solar Panels", stock: 85, unit: "Pcs", warehouse: "BLR-WH1", status: "Low Stock" },
  { id: 'I01', item: "Growatt 5kW Hybrid", category: "Inverters", stock: 45, unit: "Units", warehouse: "MYS-WH2", status: "In Stock" },
  { id: 'S01', item: "DC Cable 4sqmm", category: "Accessories", stock: 5000, unit: "Meters", warehouse: "BLR-WH1", status: "In Stock" },
];

const WeKraftERP = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // --- Application State ---
  const [dealers, setDealers] = useState(INITIAL_DEALERS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [notification, setNotification] = useState(null);

  // --- Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'editDealer', 'addDealer', 'editStock', 'importTally'
  const [currentItem, setCurrentItem] = useState(null);
  const [importType, setImportType] = useState(null); // 'stock' or 'invoices'

  // --- Handlers ---

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Dealer Handlers
  const handleSaveDealer = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newDealer = {
      id: currentItem ? currentItem.id : Date.now(),
      name: formData.get('name'),
      location: formData.get('location'),
      phone: formData.get('phone'),
      creditLimit: Number(formData.get('creditLimit')),
      outstanding: currentItem ? currentItem.outstanding : 0,
      status: formData.get('status')
    };

    if (modalType === 'editDealer') {
      setDealers(dealers.map(d => d.id === currentItem.id ? newDealer : d));
      showNotification("Dealer details updated successfully");
    } else {
      setDealers([...dealers, newDealer]);
      showNotification("New dealer onboarded successfully");
    }
    closeModal();
  };

  const handleDeleteDealer = (id) => {
    if (window.confirm("Are you sure you want to delete this dealer?")) {
      setDealers(dealers.filter(d => d.id !== id));
      showNotification("Dealer removed", "error");
    }
  };

  // Inventory Handlers
  const handleSaveStock = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const qty = Number(formData.get('stock'));
    const updatedItem = {
      ...currentItem,
      stock: qty,
      status: qty < 100 ? 'Low Stock' : 'In Stock'
    };
    setInventory(inventory.map(i => i.id === currentItem.id ? updatedItem : i));
    showNotification("Stock level updated");
    closeModal();
  };

  // Tally Import Handler (Simulation)
  const handleTallyImport = (e) => {
    e.preventDefault();
    
    // Simulate processing delay
    setTimeout(() => {
        if (importType === 'stock') {
            const newStock = [
                { id: 'T-099', item: "Luminous Solar Bat 150Ah", category: "Batteries", stock: 200, unit: "Units", warehouse: "BLR-WH1", status: "In Stock" },
                { id: 'T-100', item: "UTL Gamma Plus", category: "Inverters", stock: 50, unit: "Units", warehouse: "MYS-WH2", status: "In Stock" }
            ];
            setInventory([...inventory, ...newStock]);
            showNotification(`Synced 245 SKU records from Tally Prime`);
        } else if (importType === 'invoices') {
            const newOrders = [
                { id: 'INV-8892', dealer: "Surya Power Systems", items: "Imported from Tally", value: "₹2,40,000", stage: "Delivered", date: "2024-11-28" },
                { id: 'INV-8893', dealer: "Ravi Electronics", items: "Imported from Tally", value: "₹85,000", stage: "Processing", date: "2024-11-28" }
            ];
            setOrders([...newOrders, ...orders]); // Add to top
            showNotification(`Imported 2 new invoices from Tally XML`);
        }
        closeModal();
    }, 1500);
  };

  const handleUpdateOrderStatus = (orderId, newStage) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, stage: newStage } : o));
    showNotification(`Order status changed to ${newStage}`);
  };

  // Modal Helpers
  const openModal = (type, item = null, extraType = null) => {
    setModalType(type);
    setCurrentItem(item);
    if(extraType) setImportType(extraType);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setCurrentItem(null);
    setImportType(null);
  };

  // Login Screen Component
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md flex flex-col">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-center">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Sun size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">WeKraft Solar</h1>
            <p className="text-slate-400 text-sm mt-1">Distribution Management System</p>
          </div>
          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Partner Login</h2>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }}>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Username / ID</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                  placeholder="admin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors shadow-md mt-2"
              >
                Access Dashboard
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400">Restricted Access. Authorized Personnel Only.</p>
              <p className="text-xs text-gray-400">Distribution Module v3.2 (Tally Integration)</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main App Layout
  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden relative">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`absolute top-6 right-6 z-[100] px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-5 duration-300 ${notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-600 text-white'}`}>
          {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          <span className="font-medium text-sm">{notification.message}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col shadow-xl z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
            <Sun size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wide">WeKraft<span className="text-yellow-500">Solar</span></h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Distributor Ops</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Store size={20} />} label="Dealer Network" active={activeTab === 'dealers'} onClick={() => setActiveTab('dealers')} />
          <NavItem icon={<Truck size={20} />} label="Orders & Dispatch" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
          <NavItem icon={<Package size={20} />} label="Inventory" active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
          <NavItem icon={<Calculator size={20} />} label="B2B Calculator" active={activeTab === 'calculator'} onClick={() => setActiveTab('calculator')} />
          <div className="pt-6 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">System</div>
          <NavItem icon={<FileText size={20} />} label="Invoices & Reports" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
          <NavItem icon={<Settings size={20} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
          <h2 className="text-xl font-bold text-gray-800 capitalize">{activeTab === 'dealers' ? 'Dealer Management' : activeTab === 'orders' ? 'Order Fulfillment' : activeTab.replace('-', ' ')}</h2>
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search orders, dealers, SKUs..." 
                className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-slate-200 outline-none"
              />
            </div>
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">
                SM
              </div>
              <div className="hidden md:block text-sm">
                <p className="font-semibold text-gray-700">Sales Manager</p>
                <p className="text-xs text-gray-500">Bangalore HQ</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-auto bg-gray-100 p-6">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'dealers' && (
            <DealersView 
              data={dealers} 
              onEdit={(d) => openModal('editDealer', d)} 
              onDelete={handleDeleteDealer}
              onAdd={() => openModal('addDealer')}
            />
          )}
          {activeTab === 'orders' && (
             <OrdersView 
               data={orders} 
               onUpdateStatus={handleUpdateOrderStatus}
               onImportTally={() => openModal('importTally', null, 'invoices')}
             />
          )}
          {activeTab === 'inventory' && (
             <InventoryView 
                data={inventory}
                onEditStock={(item) => openModal('editStock', item)}
                onImportTally={() => openModal('importTally', null, 'stock')}
             />
          )}
          {activeTab === 'calculator' && <QuoteView />}
          {['settings', 'reports'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Settings size={48} className="mb-4 opacity-50" />
              <p className="text-lg">This module is under development.</p>
            </div>
          )}
        </div>
      </main>

      {/* MODAL OVERLAY */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800">
                {modalType === 'addDealer' && 'Onboard New Dealer'}
                {modalType === 'editDealer' && 'Edit Dealer Details'}
                {modalType === 'editStock' && 'Update Inventory Stock'}
                {modalType === 'importTally' && 'Import Tally Data'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              {(modalType === 'editDealer' || modalType === 'addDealer') && (
                <form onSubmit={handleSaveDealer} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                    <input name="name" defaultValue={currentItem?.name} required className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-yellow-500 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Region/Location</label>
                        <input name="location" defaultValue={currentItem?.location} required className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-yellow-500 outline-none" />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input name="phone" defaultValue={currentItem?.phone} required className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-yellow-500 outline-none" />
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Credit Limit (₹)</label>
                        <input name="creditLimit" type="number" defaultValue={currentItem?.creditLimit} required className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-yellow-500 outline-none" />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select name="status" defaultValue={currentItem?.status || 'Active'} className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none">
                           <option value="Active">Active</option>
                           <option value="Overdue">Overdue</option>
                           <option value="Inactive">Inactive</option>
                        </select>
                     </div>
                  </div>
                  <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 text-sm font-medium hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 rounded-lg flex items-center gap-2">
                       <Save size={16} /> Save Details
                    </button>
                  </div>
                </form>
              )}

              {modalType === 'editStock' && (
                <form onSubmit={handleSaveStock} className="space-y-4">
                  <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-sm mb-4">
                     Adjusting stock for: <strong>{currentItem.item}</strong> ({currentItem.id})
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock Level</label>
                    <input name="stock" type="number" defaultValue={currentItem?.stock} required className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-yellow-500 outline-none" />
                    <p className="text-xs text-gray-500 mt-1">Unit: {currentItem.unit}</p>
                  </div>
                  <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 text-sm font-medium hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 rounded-lg flex items-center gap-2">
                       <Save size={16} /> Update Stock
                    </button>
                  </div>
                </form>
              )}

              {modalType === 'importTally' && (
                <form onSubmit={handleTallyImport} className="space-y-6">
                   <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                         <FileSpreadsheet size={24} />
                      </div>
                      <h4 className="font-semibold text-gray-800">Upload Tally Report</h4>
                      <p className="text-xs text-gray-500 mt-1">Supports .XML, .CSV or .XLSX exported from Tally Prime</p>
                      <button type="button" className="mt-4 text-xs bg-white border border-gray-300 px-3 py-1 rounded font-medium">Browse Files</button>
                   </div>
                   
                   <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg flex gap-2">
                      <AlertCircle size={14} className="text-blue-500 flex-shrink-0" />
                      <div>
                        <strong>Note:</strong> Importing {importType === 'stock' ? 'Stock Summary' : 'Sales Register'} will merge new data with existing records based on SKU/Invoice No.
                      </div>
                   </div>

                   <div className="flex justify-end gap-3">
                    <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 text-sm font-medium hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white text-sm font-medium hover:bg-green-700 rounded-lg flex items-center gap-2">
                       <UploadCloud size={16} /> Sync with Tally
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// --- Sub Components ---

const NavItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
      active 
      ? 'bg-yellow-500 text-slate-900 shadow-md transform translate-x-1' 
      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const DashboardView = () => (
  <div className="space-y-6">
    {/* KPI Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard title="Total Sales (Nov)" value="₹1.42 Cr" change="+8% vs last month" icon={<DollarSign size={24} className="text-green-600" />} color="bg-green-50" border="border-green-200" />
      <KPICard title="Units Dispatched" value="3,240" change="450 Panels this week" icon={<Box size={24} className="text-blue-600" />} color="bg-blue-50" border="border-blue-200" />
      <KPICard title="Active Dealers" value="48" change="3 New Onboarded" icon={<Store size={24} className="text-yellow-600" />} color="bg-yellow-50" border="border-yellow-200" />
      <KPICard title="Pending Orders" value="12" change="2 Critical (Overdue)" icon={<Clock size={24} className="text-purple-600" />} color="bg-purple-50" border="border-purple-200" />
    </div>

    {/* Recent Activity & Charts Area */}
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-800">Sales Volume Trend</h3>
          <select className="text-sm border-gray-300 border rounded-md px-2 py-1 bg-gray-50 outline-none">
            <option>Last 7 Days</option>
            <option>This Month</option>
          </select>
        </div>
        <div className="h-64 flex items-end justify-between px-4 gap-4">
          {[60, 45, 80, 50, 95, 70, 85].map((h, i) => (
            <div key={i} className="w-full bg-slate-100 rounded-t-lg relative group">
              <div 
                className="absolute bottom-0 w-full bg-slate-800 rounded-t-lg transition-all duration-500 hover:bg-yellow-500" 
                style={{ height: `${h}%` }}
              ></div>
              <div className="absolute -bottom-6 w-full text-center text-xs text-gray-500">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-gray-800 mb-4">Logistics Alerts</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800">Low Stock Warning</p>
              <p className="text-xs text-red-600 mt-1">Tata Power 450W stock below minimum threshold (85 units).</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <Truck size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-800">Dispatch Delay</p>
              <p className="text-xs text-blue-700 mt-1">Vehicle KA-01-AG-4455 delayed at Hubli checkpoint.</p>
            </div>
          </div>
        </div>
        <button className="w-full mt-4 py-2 text-sm text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors border border-gray-200">
          View All Notifications
        </button>
      </div>
    </div>
  </div>
);

const KPICard = ({ title, value, change, icon, color, border }) => (
  <div className={`bg-white rounded-xl p-6 shadow-sm border-l-4 ${border} hover:shadow-md transition-shadow`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${color}`}>
        {icon}
      </div>
    </div>
    <p className="text-xs text-gray-500 mt-4 flex items-center gap-1">
      <span className="font-medium text-green-600">●</span> {change}
    </p>
  </div>
);

const DealersView = ({ data, onEdit, onDelete, onAdd }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
      <h3 className="font-bold text-gray-800 text-lg">Dealer Network</h3>
      <button onClick={onAdd} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
        <Plus size={16} /> Onboard New Dealer
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
          <tr>
            <th className="px-6 py-4">Dealer Name</th>
            <th className="px-6 py-4">Region</th>
            <th className="px-6 py-4">Credit Limit</th>
            <th className="px-6 py-4">Outstanding</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((dealer) => (
            <tr key={dealer.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <p className="font-medium text-gray-800">{dealer.name}</p>
                <p className="text-xs text-gray-500">{dealer.phone}</p>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{dealer.location}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-500">₹{dealer.creditLimit.toLocaleString()}</td>
              <td className="px-6 py-4 text-sm font-bold text-gray-800">
                 <span className={dealer.outstanding > dealer.creditLimit * 0.8 ? 'text-red-600' : 'text-green-600'}>
                   ₹{dealer.outstanding.toLocaleString()}
                 </span>
              </td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  dealer.status === 'Active' ? 'bg-green-100 text-green-700' : 
                  dealer.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-800'
                }`}>
                  {dealer.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button onClick={() => onEdit(dealer)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Dealer">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => onDelete(dealer.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const OrdersView = ({ data, onUpdateStatus, onImportTally }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
        <div className="flex gap-4 overflow-x-auto pb-2">
        {['All Orders', 'New Order', 'Processing', 'Picking', 'Dispatched', 'Delivered'].map((stage, i) => (
            <button key={stage} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${i === 0 ? 'bg-slate-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}>
            {stage}
            </button>
        ))}
        </div>
        <button onClick={onImportTally} className="hidden md:flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-200 transition-colors">
            <UploadCloud size={16} /> Import from Tally
        </button>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((order) => (
        <div key={order.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col h-full animate-in fade-in duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {order.id}
              </span>
              <h4 className="font-bold text-gray-800 mt-2 text-md">{order.dealer}</h4>
            </div>
            <div className="text-right">
              <span className="block text-xl font-bold text-slate-900">{order.value}</span>
              <span className="text-xs text-gray-400">{order.date}</span>
            </div>
          </div>
          
          <div className="mb-4">
             <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                <Box size={14} className="inline mr-2 text-gray-400"/>
                {order.items}
             </p>
          </div>

          <div className="mt-auto">
             <div className="mb-3">
               <label className="text-xs text-gray-400 font-semibold uppercase">Update Status</label>
               <select 
                 value={order.stage} 
                 onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                 className="w-full mt-1 border border-gray-200 rounded p-1 text-sm text-gray-700 bg-gray-50 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
               >
                 <option>New Order</option>
                 <option>Processing</option>
                 <option>Picking</option>
                 <option>Dispatched</option>
                 <option>Delivered</option>
               </select>
             </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                <FileText size={14} /> Invoice
              </button>
              <button className="text-sm text-slate-700 font-medium hover:bg-slate-100 px-3 py-1 rounded transition-colors">
                Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const InventoryView = ({ data, onEditStock, onImportTally }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
      <h3 className="font-bold text-gray-800 text-lg">Warehouse Stock</h3>
      <div className="flex gap-3">
         <button onClick={onImportTally} className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded text-xs font-bold hover:bg-green-200 transition-colors">
            <UploadCloud size={14} /> Import Tally Stock
         </button>
         <div className="h-6 w-px bg-gray-300"></div>
         <button className="px-3 py-1 text-xs font-medium bg-gray-100 rounded hover:bg-gray-200">BLR-WH1</button>
         <button className="px-3 py-1 text-xs font-medium bg-white border border-gray-200 rounded hover:bg-gray-50 text-gray-500">MYS-WH2</button>
      </div>
    </div>
    <table className="w-full text-left">
      <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
        <tr>
          <th className="px-6 py-4">Item Details</th>
          <th className="px-6 py-4">Category</th>
          <th className="px-6 py-4">Available Qty</th>
          <th className="px-6 py-4">Warehouse</th>
          <th className="px-6 py-4">Status</th>
          <th className="px-6 py-4">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {data.map((item) => (
          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4">
              <p className="font-medium text-gray-800">{item.item}</p>
              <p className="text-xs text-gray-400">SKU: {item.id}</p>
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">{item.category}</td>
            <td className="px-6 py-4 text-sm font-bold text-gray-800">{item.stock} <span className="font-normal text-gray-500 text-xs">{item.unit}</span></td>
            <td className="px-6 py-4 text-sm text-gray-600">{item.warehouse}</td>
            <td className="px-6 py-4">
              <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 w-fit ${
                item.status === 'Low Stock' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
                {item.status === 'Low Stock' ? <AlertCircle size={12} /> : <CheckCircle size={12} />}
                {item.status}
              </span>
            </td>
            <td className="px-6 py-4">
              <button 
                onClick={() => onEditStock(item)}
                className="text-sm text-blue-600 font-medium border border-blue-200 px-3 py-1 rounded hover:bg-blue-50 transition-colors"
              >
                Update Stock
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const QuoteView = () => {
  const [qty, setQty] = useState(10);
  const [basePrice] = useState(12500); // Base price per panel
  
  const total = qty * basePrice;
  const discount = qty >= 50 ? 0.05 : 0;
  const finalPrice = total * (1 - discount);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h3 className="font-bold text-gray-800 text-lg mb-6 flex items-center gap-2">
          <Calculator size={20} className="text-yellow-500" />
          B2B Bulk Price Estimator
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Product</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>Adani Mono PERC 540W</option>
                <option>Tata Power 450W Poly</option>
                <option>Growatt 5kW Inverter</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity (Units)</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="1" 
                max="500" 
                step="1"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
              />
              <input 
                type="number" 
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center font-bold"
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Applied Dealer Tier</label>
             <div className="flex gap-2">
                <span className={`px-3 py-1 rounded text-xs font-medium cursor-pointer border ${qty < 50 ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-500'}`}>Standard</span>
                <span className={`px-3 py-1 rounded text-xs font-medium cursor-pointer border ${qty >= 50 && qty < 200 ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-500'}`}>Gold (5% Off)</span>
                <span className={`px-3 py-1 rounded text-xs font-medium cursor-pointer border ${qty >= 200 ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-500'}`}>Platinum (10% Off)</span>
             </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
              <FileText size={18} /> Generate Proforma Invoice
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg text-white p-8 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        
        <h4 className="text-gray-400 uppercase tracking-wider text-xs font-bold mb-8">Quote Summary</h4>
        
        <div className="space-y-6 relative z-10">
          <div className="flex justify-between items-end border-b border-gray-700 pb-4">
             <span className="text-gray-400 text-sm">Base Amount</span>
             <span className="text-xl font-medium">₹{total.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-end border-b border-gray-700 pb-4">
             <span className="text-gray-400 text-sm">Volume Discount {discount > 0 && <span className="text-green-400 text-xs">({discount * 100}%)</span>}</span>
             <span className="text-xl font-medium text-green-400">-₹{(total * discount).toLocaleString()}</span>
          </div>
          
          <div className="pt-2">
            <p className="text-sm text-gray-400 mb-1">Total Payable (Excl. GST)</p>
            <p className="text-4xl font-bold text-white">₹{finalPrice.toLocaleString()}</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm mt-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-blue-400" />
              <span className="text-sm font-medium">Margin Potential</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Recommended Retail Price: ₹{(finalPrice * 1.15).toLocaleString()}. Dealer margin approx 15%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeKraftERP;