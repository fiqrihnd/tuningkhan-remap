import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  UserCheck, 
  Plus, 
  Trash2, 
  Edit, 
  Gauge, 
  Search, 
  X, 
  AlertCircle, 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  Bell,
  Download,
  Printer,
  Calendar,
  Filter,
  Info
} from 'lucide-react';

import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

function DatePicker({ value, onChange, placeholder = "Pilih Tanggal" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => value ? new Date(value) : new Date());
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedDate = value ? new Date(value) : null;
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const days = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleSelectDay = (date) => {
    if (!date) return;
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    onChange(`${yyyy}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <div className="relative" ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus-within:border-orange-500 hover:border-slate-700 flex items-center justify-between cursor-pointer select-none transition-colors"
      >
        <span className="text-sm">{value ? formatDateDisplay(value) : placeholder}</span>
        <div className="flex items-center gap-1.5">
          {value && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(''); }}
              className="text-slate-500 hover:text-slate-300 p-0.5 rounded transition"
              title="Bersihkan tanggal"
            >
              <X size={14} />
            </button>
          )}
          <Calendar className="text-slate-400" size={16} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 z-50 mt-2 p-4 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl shadow-black/80">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
            <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <span className="font-bold text-slate-200 text-sm tracking-wide">{monthNames[month]} {year}</span>
            <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map(d => <span key={d}>{d}</span>)}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} />;
              const isSelected = selectedDate && 
                day.getDate() === selectedDate.getDate() && 
                day.getMonth() === selectedDate.getMonth() && 
                day.getFullYear() === selectedDate.getFullYear();
              
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`h-8 w-8 text-xs rounded-lg flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'bg-orange-500 text-slate-950 font-black shadow-lg shadow-orange-500/20' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                  }`}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const generateAutoFinanceLogs = (customer, panduanList) => {
  const logs = [];
  const baseId = customer.id;
  const paket = panduanList.find(p => p.id === customer.paketId);
  
  if (!paket) return logs;
  
  const tanggal = customer.tanggal || new Date().toISOString().split('T')[0];
  const suffix = customer.plat ? ` (${customer.plat})` : '';
  
  // 1. Catat Pemasukan Remap
  logs.push({
    id: `${baseId}-masuk`,
    tanggal,
    tipe: 'Pemasukan',
    plat: customer.plat,
    crew: customer.crew || '',
    amount: Number(paket.hargaRemap || 0),
    keterangan: `Pemasukan Remap: ${paket.nama}${suffix}`,
    isAuto: true
  });
  
  // 2. Catat Benefit Crew Pembawa (Pengeluaran)
  if (Number(paket.benefit) > 0 && customer.crew) {
    logs.push({
      id: `${baseId}-benefit-pembawa`,
      tanggal,
      tipe: 'Pengeluaran',
      plat: customer.plat,
      crew: customer.crew,
      amount: Number(paket.benefit || 0),
      keterangan: `Benefit Crew Pembawa: ${customer.crew}${suffix}`,
      isAuto: true
    });
  }
  
  // 3. Catat Benefit Tuner (Pengeluaran - Rp250.000)
  if (customer.tuner) {
    logs.push({
      id: `${baseId}-benefit-tuner`,
      tanggal,
      tipe: 'Pengeluaran',
      plat: customer.plat,
      crew: customer.tuner,
      amount: 250000,
      keterangan: `Benefit Tuner: ${customer.tuner}${suffix}`,
      isAuto: true
    });
  }
  
  // 4. Catat Benefit Remote (Pengeluaran - Rp150.000)
  if (customer.remote) {
    logs.push({
      id: `${baseId}-benefit-remote`,
      tanggal,
      tipe: 'Pengeluaran',
      plat: customer.plat,
      crew: customer.remote,
      amount: 150000,
      keterangan: `Benefit Remote: ${customer.remote}${suffix}`,
      isAuto: true
    });
  }
  
  // 5. Catat Benefit Support (Pengeluaran - Rp50.000 per crew)
  const selectedSupports = Array.isArray(customer.support) 
    ? customer.support 
    : (customer.support ? customer.support.split(',').map(s => s.trim()).filter(Boolean) : []);
    
  selectedSupports.forEach((sup, idx) => {
    logs.push({
      id: `${baseId}-benefit-support-${idx}`,
      tanggal,
      tipe: 'Pengeluaran',
      plat: customer.plat,
      crew: sup,
      amount: 50000,
      keterangan: `Benefit Support: ${sup}${suffix}`,
      isAuto: true
    });
  });
  
  // 6. Catat Fee Perantara (Pengeluaran - jika ada)
  if (customer.perantara && Number(customer.perantaraFee) > 0) {
    logs.push({
      id: `${baseId}-fee-perantara`,
      tanggal,
      tipe: 'Pengeluaran',
      plat: customer.plat,
      crew: customer.crew || '',
      amount: Number(customer.perantaraFee || 0),
      keterangan: `Fee Perantara: ${customer.perantara}${suffix}`,
      isAuto: true
    });
  }
  
  return logs;
};

const defaultMockData = {
  customers: [
    { id: 'm1', tanggal: '2026-05-28', nama: 'Budi Santoso', plat: 'B 1234 SMN', mobil: 'Innova Reborn 2.4D', warna: 'Hitam Metalik', vin: 'MHR17KLA192837', phone: '08123456789', location: 'Bengkel Utama', paketId: 'p1', crew: 'Ahmad', tuner: 'Eko', remote: 'Fandi', support: ['Gani'], perantara: 'Deni', perantaraFee: '100000' },
    { id: 'm2', tanggal: '2026-05-29', nama: 'Siti Aminah', plat: 'D 9999 XYZ', mobil: 'Civic Turbo 1.5T', warna: 'Merah Candy', vin: 'MHR17KLA192004', phone: '08234567890', location: 'Home Service', paketId: 'p2', crew: 'Eko', tuner: 'Eko', remote: '', support: [], perantara: '', perantaraFee: '0' },
    { id: 'm3', tanggal: '2026-05-31', nama: 'Andi Wijaya', plat: 'F 888 WA', mobil: 'Fortuner VRZ 2.4', warna: 'Putih Super', vin: 'MHR17KLA195821', phone: '08345678901', location: 'Bengkel Utama', paketId: 'p3', crew: 'Ahmad', tuner: 'Eko', remote: 'Fandi', support: ['Gani', 'Hadi'], perantara: 'Roni', perantaraFee: '150000' },
    { id: 'm4', tanggal: '2026-06-01', nama: 'Dewi Lestari', plat: 'B 2234 CDE', mobil: 'Honda Brio 1.2', warna: 'Kuning Lemon', vin: 'MHR17KLA197261', phone: '08456789012', location: 'Bengkel Utama', paketId: 'p4', crew: 'Gani', tuner: 'Eko', remote: '', support: ['Ahmad'], perantara: '', perantaraFee: '0' }
  ],
  crews: [
    { id: 'c1', nama: 'Ahmad', posisi: 'Teknisi Senior' },
    { id: 'c2', nama: 'Eko', posisi: 'Master Tuner' },
    { id: 'c3', nama: 'Fandi', posisi: 'Remote Programmer' },
    { id: 'c4', nama: 'Gani', posisi: 'Asisten Mekanik' },
    { id: 'c5', nama: 'Hadi', posisi: 'Support Crew' }
  ],
  finance: [
    { id: 'm1-masuk', tanggal: '2026-05-28', tipe: 'Pemasukan', plat: 'B 1234 SMN', crew: 'Ahmad', amount: 2500000, keterangan: 'Pemasukan Remap: Stage 1 Performance (B 1234 SMN)', isAuto: true },
    { id: 'm1-benefit-pembawa', tanggal: '2026-05-28', tipe: 'Pengeluaran', plat: 'B 1234 SMN', crew: 'Ahmad', amount: 500000, keterangan: 'Benefit Crew Pembawa: Ahmad (B 1234 SMN)', isAuto: true },
    { id: 'm1-benefit-tuner', tanggal: '2026-05-28', tipe: 'Pengeluaran', plat: 'B 1234 SMN', crew: 'Eko', amount: 250000, keterangan: 'Benefit Tuner: Eko (B 1234 SMN)', isAuto: true },
    { id: 'm1-benefit-remote', tanggal: '2026-05-28', tipe: 'Pengeluaran', plat: 'B 1234 SMN', crew: 'Fandi', amount: 150000, keterangan: 'Benefit Remote: Fandi (B 1234 SMN)', isAuto: true },
    { id: 'm1-benefit-support-0', tanggal: '2026-05-28', tipe: 'Pengeluaran', plat: 'B 1234 SMN', crew: 'Gani', amount: 50000, keterangan: 'Benefit Support: Gani (B 1234 SMN)', isAuto: true },
    { id: 'm1-fee-perantara', tanggal: '2026-05-28', tipe: 'Pengeluaran', plat: 'B 1234 SMN', crew: 'Ahmad', amount: 100000, keterangan: 'Fee Perantara: Deni (B 1234 SMN)', isAuto: true },
    { id: 'm2-masuk', tanggal: '2026-05-29', tipe: 'Pemasukan', plat: 'D 9999 XYZ', crew: 'Eko', amount: 3500000, keterangan: 'Pemasukan Remap: Stage 2 Extreme (D 9999 XYZ)', isAuto: true },
    { id: 'm2-benefit-pembawa', tanggal: '2026-05-29', tipe: 'Pengeluaran', plat: 'D 9999 XYZ', crew: 'Eko', amount: 750000, keterangan: 'Benefit Crew Pembawa: Eko (D 9999 XYZ)', isAuto: true },
    { id: 'm2-benefit-tuner', tanggal: '2026-05-29', tipe: 'Pengeluaran', plat: 'D 9999 XYZ', crew: 'Eko', amount: 250000, keterangan: 'Benefit Tuner: Eko (D 9999 XYZ)', isAuto: true },
    { id: 'm3-masuk', tanggal: '2026-05-31', tipe: 'Pemasukan', plat: 'F 888 WA', crew: 'Ahmad', amount: 4000000, keterangan: 'Pemasukan Remap: Stage 2 Pro (F 888 WA)', isAuto: true },
    { id: 'm3-benefit-pembawa', tanggal: '2026-05-31', tipe: 'Pengeluaran', plat: 'F 888 WA', crew: 'Ahmad', amount: 800000, keterangan: 'Benefit Crew Pembawa: Ahmad (F 888 WA)', isAuto: true },
    { id: 'm3-benefit-tuner', tanggal: '2026-05-31', tipe: 'Pengeluaran', plat: 'F 888 WA', crew: 'Eko', amount: 250000, keterangan: 'Benefit Tuner: Eko (F 888 WA)', isAuto: true },
    { id: 'm3-benefit-remote', tanggal: '2026-05-31', tipe: 'Pengeluaran', plat: 'F 888 WA', crew: 'Fandi', amount: 150000, keterangan: 'Benefit Remote: Fandi (F 888 WA)', isAuto: true },
    { id: 'm3-benefit-support-0', tanggal: '2026-05-31', tipe: 'Pengeluaran', plat: 'F 888 WA', crew: 'Gani', amount: 50000, keterangan: 'Benefit Support: Gani (F 888 WA)', isAuto: true },
    { id: 'm3-benefit-support-1', tanggal: '2026-05-31', tipe: 'Pengeluaran', plat: 'F 888 WA', crew: 'Hadi', amount: 50000, keterangan: 'Benefit Support: Hadi (F 888 WA)', isAuto: true },
    { id: 'm3-fee-perantara', tanggal: '2026-05-31', tipe: 'Pengeluaran', plat: 'F 888 WA', crew: 'Ahmad', amount: 150000, keterangan: 'Fee Perantara: Roni (F 888 WA)', isAuto: true },
    { id: 'm4-masuk', tanggal: '2026-06-01', tipe: 'Pemasukan', plat: 'B 2234 CDE', crew: 'Gani', amount: 1800000, keterangan: 'Pemasukan Remap: Stage 1 Eco (B 2234 CDE)', isAuto: true },
    { id: 'm4-benefit-pembawa', tanggal: '2026-06-01', tipe: 'Pengeluaran', plat: 'B 2234 CDE', crew: 'Gani', amount: 400000, keterangan: 'Benefit Crew Pembawa: Gani (B 2234 CDE)', isAuto: true },
    { id: 'm4-benefit-tuner', tanggal: '2026-06-01', tipe: 'Pengeluaran', plat: 'B 2234 CDE', crew: 'Eko', amount: 250000, keterangan: 'Benefit Tuner: Eko (B 2234 CDE)', isAuto: true },
    { id: 'm4-benefit-support-0', tanggal: '2026-06-01', tipe: 'Pengeluaran', plat: 'B 2234 CDE', crew: 'Ahmad', amount: 50000, keterangan: 'Benefit Support: Ahmad (B 2234 CDE)', isAuto: true }
  ],
  panduan: [
    { id: 'p1', nama: 'Stage 1 Performance', hargaRemap: 2500000, benefit: 500000 },
    { id: 'p2', nama: 'Stage 2 Extreme', hargaRemap: 3500000, benefit: 750000 },
    { id: 'p3', nama: 'Stage 2 Pro', hargaRemap: 4000000, benefit: 800000 },
    { id: 'p4', nama: 'Stage 1 Eco', hargaRemap: 1800000, benefit: 400000 }
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showFormPanel, setShowFormPanel] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, item: null, menu: '' });
  const [cancelConfirmModal, setCancelConfirmModal] = useState(false);

  // Global search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCrew, setFilterCrew] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');
  const [filterPaket, setFilterPaket] = useState('');

  // Initial Data dari LocalStorage dengan fallback data tiruan (Mock) lengkap
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('tuningkhan_pro');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validasi struktur minimal agar chart tidak error
      if (parsed.customers && parsed.customers.length > 0) {
        return parsed;
      }
    }
    return defaultMockData;
  });

  useEffect(() => {
    localStorage.setItem('tuningkhan_pro', JSON.stringify(data));
  }, [data]);

  const [formData, setFormData] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };

    // Otomatisasi menu keuangan ketika Plat dipilih (Khusus Pemasukan)
    if (activeTab === 'finance') {
      if (name === 'plat') {
        const customer = data.customers.find(c => c.plat === value);
        if (customer) {
          // Set crew bawaan menjadi Crew Pembawa (customer.crew)
          newFormData.crew = customer.crew || '';
          const paket = data.panduan.find(p => p.id === customer.paketId);
          
          if (paket) {
            if (newFormData.tipe === 'Pemasukan') {
              newFormData.amount = paket.hargaRemap;
            } else {
              newFormData.amount = '';
            }
          }
        }
      }
      
      // Update otomatis jika tipe transaksi diubah saat Plat sudah terisi
      if (name === 'tipe' && newFormData.plat) {
        const customer = data.customers.find(c => c.plat === newFormData.plat);
        if (customer) {
          const paket = data.panduan.find(p => p.id === customer.paketId);
          if (paket) {
            if (value === 'Pemasukan') {
              newFormData.amount = paket.hargaRemap;
            } else {
              newFormData.amount = '';
            }
          }
        }
      }
    }

    setFormData(newFormData);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const saveItem = { ...formData, id: editingId || Date.now().toString() };
    
    setData(prev => {
      let updatedCustomers = prev.customers;
      let updatedFinance = prev.finance;
      
      if (activeTab === 'customers') {
        // 1. Simpan atau perbarui list pelanggan
        updatedCustomers = editingId 
          ? prev.customers.map(item => item.id === editingId ? saveItem : item)
          : [...prev.customers, saveItem];
          
        // 2. Hapus log keuangan otomatis yang lama untuk pelanggan ini (jika sedang mengedit)
        updatedFinance = prev.finance.filter(f => !(f.isAuto && f.id.startsWith(saveItem.id)));
        
        // 3. Buat ulang log keuangan otomatis yang baru
        const newAutoLogs = generateAutoFinanceLogs(saveItem, prev.panduan);
        
        // 4. Masukkan log otomatis ke data keuangan
        updatedFinance = [...updatedFinance, ...newAutoLogs];
        
        return {
          ...prev,
          customers: updatedCustomers,
          finance: updatedFinance
        };
      } else {
        // Logika default untuk tab selain pelanggan (crew, panduan, manual finance)
        return {
          ...prev,
          [activeTab]: editingId 
            ? prev[activeTab].map(item => item.id === editingId ? saveItem : item)
            : [...prev[activeTab], saveItem]
        };
      }
    });
    
    setFormData({});
    setEditingId(null);
    setShowFormPanel(false);
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item.id);
    setShowFormPanel(true);
  };

  const handleCancelClick = () => {
    const hasInput = Object.values(formData).some(val => val && String(val).trim() !== '');
    if (hasInput) {
      setCancelConfirmModal(true);
    } else {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({});
    setEditingId(null);
    setShowFormPanel(false);
    setCancelConfirmModal(false);
  };

  const executeDelete = () => {
    const { item, menu } = deleteModal;
    
    setData(prev => {
      if (menu === 'customers') {
        // 1. Hapus data pelanggan dari list
        const updatedCustomers = prev.customers.filter(i => i.id !== item.id);
        // 2. Bersihkan seluruh log keuangan otomatis yang terkait dengan pelanggan ini
        const updatedFinance = prev.finance.filter(f => !(f.isAuto && f.id.startsWith(item.id)));
        
        return {
          ...prev,
          customers: updatedCustomers,
          finance: updatedFinance
        };
      } else {
        // Hapus biasa untuk menu lain
        return {
          ...prev,
          [menu]: prev[menu].filter(i => i.id !== item.id)
        };
      }
    });
    
    setDeleteModal({ show: false, item: null, menu: '' });
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  };

  const calculateCrewBenefit = (crewName) => {
    // 1. Benefit Manual (dari input langsung di menu Keuangan)
    const manualBenefits = data.finance
      .filter(f => f.crew === crewName && f.tipe === 'Benefit')
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    // 2. Benefit Otomatis dari Peran di Menu Customer
    let autoBenefits = 0;
    data.customers.forEach(customer => {
      // Tuner: Rp250.000
      if (customer.tuner === crewName) autoBenefits += 250000;
      
      // Remote: Rp150.000
      if (customer.remote === crewName) autoBenefits += 150000;
      
      // Support: Rp50.000 per kru pembantu
      const supports = typeof customer.support === 'string'
        ? customer.support.split(',').map(s => s.trim())
        : (Array.isArray(customer.support) ? customer.support : []);
        
      if (supports.includes(crewName)) autoBenefits += 50000;
      
      // Crew Pembawa (Membawa Pelanggan) -> Mengambil nominal benefit dari Panduan Layanan
      if (customer.crew === crewName) {
        const targetId = customer.paketId || customer.paket_id;
        const paket = data.panduan.find(p => p.id === targetId);
        if (paket) {
          autoBenefits += Number(paket.benefit || 0);
        }
      }
    });

    return manualBenefits + autoBenefits;
  };

  const getFinancialAnalysis = () => {
    // 1. Ambil Pemasukan Manual (Diluar Pemasukan Otomatis untuk cegah Duplikasi data)
    const manualPemasukan = data.finance
      .filter(f => f.tipe === 'Pemasukan' && !f.customer_ref_id && !f.isAuto)
      .reduce((sum, f) => sum + Number(f.amount || 0), 0);

    // 2. Ambil Pengeluaran Manual (Abaikan komisi otomatis)
    const manualPengeluaran = data.finance
      .filter(f => f.tipe === 'Pengeluaran' && !f.customer_ref_id && !f.isAuto)
      .reduce((sum, f) => sum + Number(f.amount || 0), 0);

    let totalHargaRemap = 0;
    let totalBenefitCrewPembawa = 0;
    let totalBenefitTuner = 0;
    let totalBenefitRemote = 0;
    let totalBenefitSupport = 0;
    let totalPerantaraFee = 0;

    data.customers.forEach(c => {
      const targetId = c.paketId || c.paket_id;
      const paket = data.panduan.find(p => p.id === targetId);
      if (paket) {
        totalHargaRemap += Number(paket.harga_remap || paket.hargaRemap || 0);
        totalBenefitCrewPembawa += Number(paket.benefit || 0);
      }
      if (c.tuner) totalBenefitTuner += 250000;
      if (c.remote) totalBenefitRemote += 150000;
      
      const supports = typeof c.support === 'string'
        ? c.support.split(',').filter(Boolean).length
        : (Array.isArray(c.support) ? c.support.length : 0);
        
      totalBenefitSupport += supports * 50000;
      totalPerantaraFee += Number(c.perantaraFee || c.perantara_fee || 0);
    });

    const totalBenefitAuto = totalBenefitCrewPembawa + totalBenefitTuner + totalBenefitRemote + totalBenefitSupport;
    const totalPengeluaranOtomatis = totalBenefitAuto + totalPerantaraFee;

    const totalPemasukanKumulatif = manualPemasukan + totalHargaRemap;
    const totalPengeluaranKumulatif = manualPengeluaran + totalPengeluaranOtomatis;

    const totalSaldoBersih = totalPemasukanKumulatif - totalPengeluaranKumulatif;

    return {
      totalPemasukan: totalPemasukanKumulatif,
      totalPengeluaran: totalPengeluaranKumulatif,
      totalBenefit: totalBenefitAuto,
      totalSaldoBersih
    };
  };

  const financialStats = getFinancialAnalysis();

  const getTrendDataForChart = () => {
    const dailyMap = {};
    
    // Inisiasi dari data pelanggan
    data.customers.forEach(c => {
      const date = c.tanggal || new Date().toISOString().split('T')[0];
      if (!dailyMap[date]) {
        dailyMap[date] = { date, Pemasukan: 0, Pengeluaran: 0 };
      }
      
      const paket = data.panduan.find(p => p.id === c.paketId);
      if (paket) {
        dailyMap[date].Pemasukan += Number(paket.hargaRemap || 0);
        dailyMap[date].Pengeluaran += Number(paket.benefit || 0);
      }
      if (c.tuner) dailyMap[date].Pengeluaran += 250000;
      if (c.remote) dailyMap[date].Pengeluaran += 150000;
      
      const supports = typeof c.support === 'string'
        ? c.support.split(',').filter(Boolean).length
        : (Array.isArray(c.support) ? c.support.length : 0);
      dailyMap[date].Pengeluaran += supports * 50000;
      dailyMap[date].Pengeluaran += Number(c.perantaraFee || 0);
    });

    // Inisiasi dari data kas manual
    data.finance.forEach(f => {
      const date = f.tanggal || new Date().toISOString().split('T')[0];
      if (!dailyMap[date]) {
        dailyMap[date] = { date, Pemasukan: 0, Pengeluaran: 0 };
      }
      if (f.tipe === 'Pemasukan') {
        dailyMap[date].Pemasukan += Number(f.amount || 0);
      } else if (f.tipe === 'Pengeluaran') {
        dailyMap[date].Pengeluaran += Number(f.amount || 0);
      }
    });

    // Urutkan & petakan menjadi format ramah Recharts
    return Object.values(dailyMap)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7) // ambil 7 hari transaksi aktif terakhir
      .map(item => ({
        ...item,
        displayDate: formatDateDisplay(item.date),
        "Pemasukan (Rp)": item.Pemasukan,
        "Pengeluaran (Rp)": item.Pengeluaran,
        "Saldo Bersih (Rp)": item.Pemasukan - item.Pengeluaran
      }));
  };

  const getPaketDistribution = () => {
    const map = {};
    data.customers.forEach(c => {
      const pId = c.paketId || c.paket_id;
      const paket = data.panduan.find(p => p.id === pId);
      const name = paket ? paket.nama : 'Lainnya';
      map[name] = (map[name] || 0) + 1;
    });

    return Object.entries(map).map(([name, value]) => ({ name, value }));
  };

  const getCrewPerformance = () => {
    const performance = {};
    data.customers.forEach(c => {
      if (c.crew) performance[c.crew] = (performance[c.crew] || 0) + 1;
      if (c.tuner) performance[c.tuner] = (performance[c.tuner] || 0) + 1;
      if (c.remote) performance[c.remote] = (performance[c.remote] || 0) + 1;
    });

    return Object.entries(performance)
      .map(([name, count]) => ({ name, "Total Ganti/Remap": count }))
      .sort((a, b) => b["Total Ganti/Remap"] - a["Total Ganti/Remap"])
      .slice(0, 5); // Tampilkan top 5 kru terproduktif
  };

  const trendData = getTrendDataForChart();
  const paketData = getPaketDistribution();
  const crewPerformanceData = getCrewPerformance();

  const PIE_COLORS = ['#f97316', '#10b981', '#6366f1', '#fbbf24', '#06b6d4', '#ec4899'];

  const getFilteredItems = () => {
    const list = data[activeTab] || [];
    
    if (activeTab === 'customers') {
      return list.filter(item => {
        const matchesSearch = 
          item.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.plat?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.mobil?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.vin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.warna?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCrew = !filterCrew || 
          item.crew === filterCrew ||
          item.tuner === filterCrew ||
          item.remote === filterCrew;
          
        const matchesDate = (!filterDateStart || item.tanggal >= filterDateStart) &&
                            (!filterDateEnd || item.tanggal <= filterDateEnd);
        
        return matchesSearch && matchesCrew && matchesDate;
      });
    }

    if (activeTab === 'crews') {
      return list.filter(item => {
        return item.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
               item.posisi?.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    if (activeTab === 'finance') {
      return list.filter(item => {
        const matchesSearch = 
          item.plat?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.crew?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.keterangan?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesType = !filterType || item.tipe === filterType;
        const matchesDate = (!filterDateStart || item.tanggal >= filterDateStart) &&
                            (!filterDateEnd || item.tanggal <= filterDateEnd);
        
        return matchesSearch && matchesType && matchesDate;
      });
    }

    if (activeTab === 'panduan') {
      return list.filter(item => {
        return item.nama?.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    return list;
  };

  const filteredItems = getFilteredItems();

  const exportToCSV = (tabName, items) => {
    let headers = [];
    let rows = [];
    
    if (tabName === 'customers') {
      headers = ['Tanggal', 'Nama Pelanggan', 'No. Plat', 'Tipe Mobil', 'Warna', 'VIN', 'Paket Remap', 'Crew Pembawa', 'Tuner', 'Remote', 'Support', 'Nama Perantara', 'Fee Perantara'];
      rows = items.map(item => {
        const targetId = item.paketId || item.paket_id;
        const p = data.panduan.find(x => x.id === targetId);
        return [
          item.tanggal || '',
          item.nama || '',
          item.plat || '',
          item.mobil || '',
          item.warna || '',
          item.vin || '',
          p ? p.nama : '-',
          item.crew || '',
          item.tuner || '',
          item.remote || '',
          item.support || '',
          item.perantara || '',
          item.perantaraFee || item.perantara_fee || 0
        ];
      });
    } else if (tabName === 'crews') {
      headers = ['Nama Crew', 'Posisi', 'Akumulasi Benefit'];
      rows = items.map(item => [item.nama || '', item.posisi || '', calculateCrewBenefit(item.nama)]);
    } else if (tabName === 'finance') {
      headers = ['Tanggal', 'Tipe', 'Plat', 'Crew', 'Keterangan', 'Nominal'];
      rows = items.map(item => [item.tanggal || '', item.tipe || '', item.plat || '-', item.crew || '-', item.keterangan || '', item.amount || 0]);
    } else if (tabName === 'panduan') {
      headers = ['Nama Paket', 'Harga Remap', 'Benefit'];
      rows = items.map(item => [item.nama || '', item.hargaRemap || item.harga_remap || 0, item.benefit || 0]);
    }
    
    const csvContent = "\uFEFF" + [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `TuningKhan_${tabName}_Export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = (tabName, items) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    let tableHeadersHTML = '';
    let tableRowsHTML = '';
    
    if (tabName === 'customers') {
      tableHeadersHTML = '<tr><th>Tanggal</th><th>Nama</th><th>No. Plat</th><th>Mobil</th><th>Warna</th><th>VIN</th><th>Paket</th><th>Crew Pembawa</th><th>Tuner</th><th>Remote</th><th>Support</th><th>Perantara</th></tr>';
      tableRowsHTML = items.map(item => {
        const targetId = item.paketId || item.paket_id;
        const p = data.panduan.find(x => x.id === targetId);
        return `<tr>
          <td>${formatDateDisplay(item.tanggal)}</td>
          <td><b>${item.nama}</b></td>
          <td><span style="font-family: monospace; background: #1e293b; color: #f8fafc; padding: 3px 6px; border-radius: 4px;">${item.plat}</span></td>
          <td>${item.mobil}</td>
          <td>${item.warna || '-'}</td>
          <td style="font-family: monospace; font-size: 11px;">${item.vin || '-'}</td>
          <td>${p ? p.nama : '-'}</td>
          <td>${item.crew || '-'}</td>
          <td>${item.tuner || '-'}</td>
          <td>${item.remote || '-'}</td>
          <td>${item.support || '-'}</td>
          <td>${item.perantara || '-'}</td>
        </tr>`;
      }).join('');
    } else if (tabName === 'crews') {
      tableHeadersHTML = '<tr><th>Nama Crew</th><th>Posisi</th><th>Akumulasi Benefit</th></tr>';
      tableRowsHTML = items.map(item => `<tr>
        <td><b>${item.nama}</b></td>
        <td>${item.posisi}</td>
        <td style="color: #10b981; font-weight: bold;">${formatRupiah(calculateCrewBenefit(item.nama))}</td>
      </tr>`).join('');
    } else if (tabName === 'finance') {
      tableHeadersHTML = '<tr><th>Tanggal</th><th>Tipe</th><th>Plat</th><th>Crew</th><th>Keterangan</th><th>Nominal</th></tr>';
      tableRowsHTML = items.map(item => `<tr>
        <td>${formatDateDisplay(item.tanggal)}</td>
        <td><b>${item.tipe}</b></td>
        <td>${item.plat || '-'}</td>
        <td>${item.crew || '-'}</td>
        <td>${item.keterangan}</td>
        <td>${formatRupiah(item.amount)}</td>
      </tr>`).join('');
    } else if (tabName === 'panduan') {
      tableHeadersHTML = '<tr><th>Nama Paket</th><th>Harga Remap</th><th>Benefit</th></tr>';
      tableRowsHTML = items.map(item => `<tr>
        <td><b>${item.nama}</b></td>
        <td>${formatRupiah(item.hargaRemap || item.harga_remap)}</td>
        <td>${formatRupiah(item.benefit)}</td>
      </tr>`).join('');
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>TuningKhan Report - ${tabName.toUpperCase()}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #0f172a; background: #fff; }
            h1 { font-size: 24px; color: #f97316; margin: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
            th { background-color: #f8fafc; color: #475569; }
          </style>
        </head>
        <body>
          <h1>Laporan TuningKhan Pro: ${tabName.toUpperCase()}</h1>
          <table>
            <thead>${tableHeadersHTML}</thead>
            <tbody>${tableRowsHTML}</tbody>
          </table>
          <script>
            window.onload = function() { window.print(); setTimeout(window.close, 500); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const CustomChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl shadow-2xl">
          <p className="text-xs text-slate-400 font-bold mb-1.5">{label}</p>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <p key={index} className="text-xs font-semibold flex items-center gap-2" style={{ color: entry.color || entry.fill }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color || entry.fill }}></span>
                <span>{entry.name}: {formatRupiah(entry.value)}</span>
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderDashboardStats = () => {
    const totalCustomers = data.customers.length;
    const totalCrews = data.crews.length;
    const totalPanduan = data.panduan.length;
    const totalFinanceLogs = data.finance.length;

    let totalHargaRemap = 0;
    data.customers.forEach(c => {
      const targetId = c.paketId || c.paket_id;
      const paket = data.panduan.find(p => p.id === targetId);
      if (paket) {
        totalHargaRemap += Number(paket.harga_remap || paket.hargaRemap || 0);
      }
    });

    const averageRevenue = totalCustomers > 0 ? (totalHargaRemap / totalCustomers) : 0;
    
    return (
      <div className="space-y-6">
        {/* KPI Utama */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-orange-500/30 transition duration-300">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Pelanggan</p>
            <div className="flex items-center justify-between mt-2">
              <h3 className="text-3xl font-extrabold text-orange-500">{totalCustomers} Unit</h3>
              <Users size={32} className="text-slate-700" />
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-emerald-500/30 transition duration-300">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Saldo Bersih</p>
            <div className="flex items-center justify-between mt-2">
              <h3 className="text-2xl font-extrabold text-amber-400">{formatRupiah(financialStats.totalSaldoBersih)}</h3>
              <DollarSign size={32} className="text-slate-700" />
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-emerald-500/30 transition duration-300">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pemasukan Kumulatif</p>
            <div className="flex items-center justify-between mt-2">
              <h3 className="text-2xl font-extrabold text-emerald-400">{formatRupiah(financialStats.totalPemasukan)}</h3>
              <TrendingUp size={32} className="text-slate-700" />
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-red-500/30 transition duration-300">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pengeluaran Kumulatif</p>
            <div className="flex items-center justify-between mt-2">
              <h3 className="text-2xl font-extrabold text-red-400">{formatRupiah(financialStats.totalPengeluaran)}</h3>
              <TrendingDown size={32} className="text-slate-700" />
            </div>
          </div>
        </div>

        {/* SECTION: VISUALISASI GRAFIK UTAMA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 1. Area Chart: Tren Alur Kas Mingguan */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl lg:col-span-2 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wide text-slate-300">📈 Tren Alur Kas Mingguan</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Analisis harian pemasukan vs pengeluaran bengkel</p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-bold">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Pemasukan
                </span>
                <span className="flex items-center gap-1 text-red-400">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> Pengeluaran
                </span>
              </div>
            </div>
            
            <div className="h-64 w-full">
              {trendData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-600 text-xs italic">
                  Belum ada data keuangan untuk membuat grafik.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPemasukan" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="displayDate" stroke="#475569" fontSize={10} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Area type="monotone" name="Pemasukan" dataKey="Pemasukan (Rp)" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPemasukan)" />
                    <Area type="monotone" name="Pengeluaran" dataKey="Pengeluaran (Rp)" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPengeluaran)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* 2. Donut/Pie Chart: Distribusi Paket Jasa Terlaris */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wide text-slate-300">🍩 Distribusi Paket Jasa</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Segmentasi kontribusi paket terhadap total unit remap</p>
            </div>

            <div className="h-48 w-full flex items-center justify-center relative">
              {paketData.length === 0 ? (
                <span className="text-slate-600 text-xs italic">Belum ada transaksi pelanggan.</span>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paketData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {paketData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} Transaksi`]} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {paketData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 truncate max-w-[150px]">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}></span>
                    <span className="truncate">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-300">{item.value} Unit</span>
                </div>
              ))}
            </div>
          </div>
          
        </div>

        {/* ROW 3: Grafik Bar Kru dan Statistik database */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* 3. Bar Chart: Kinerja Kru Bertugas */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl lg:col-span-2 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wide text-slate-300">🔥 Kinerja Kru & Mekanik Teraktif</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Top 5 kru berdasarkan jumlah penugasan remap</p>
            </div>

            <div className="h-56 w-full mt-4">
              {crewPerformanceData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-600 text-xs italic">
                  Belum ada penugasan crew.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={crewPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip formatter={(value) => [`${value} Unit`, 'Ganti/Remap']} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                    <Bar dataKey="Total Ganti/Remap" fill="#f97316" radius={[6, 6, 0, 0]}>
                      {crewPerformanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[(index + 1) % PIE_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Sektor Statistik Tambahan */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 flex flex-col justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span>📊 Data Pendukung Sistem</span>
            </h3>
            <div className="grid grid-cols-2 gap-3 flex-1">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 hover:border-orange-500/20 transition flex flex-col justify-center">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Crew Terdaftar</span>
                <p className="text-xl font-extrabold text-orange-400">{totalCrews} Orang</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 hover:border-indigo-500/20 transition flex flex-col justify-center">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Paket Jasa</span>
                <p className="text-xl font-extrabold text-indigo-400">{totalPanduan} Jasa</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 hover:border-emerald-500/20 transition flex flex-col justify-center">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Log Transaksi</span>
                <p className="text-xl font-extrabold text-emerald-400">{totalFinanceLogs} Item</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 hover:border-teal-500/20 transition flex flex-col justify-center" title="Rata-rata pemasukan jasa remap per kendaraan">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Rata Jasa/Unit</span>
                <p className="text-sm font-extrabold text-teal-400 mt-1 truncate">{formatRupiah(averageRevenue)}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Aktivitas Terakhir */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Aktivitas Remap Terbaru</h3>
          {data.customers.length === 0 ? (
            <p className="text-slate-600 italic text-sm">Belum ada riwayat aktivitas terbaru.</p>
          ) : (
            <div className="space-y-4">
              {data.customers.slice(-3).reverse().map((item, index) => {
                const pkg = data.panduan.find(p => p.id === item.paketId);
                return (
                  <div key={index} className="flex justify-between items-center border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-bold text-slate-200">{item.mobil} <span className="text-slate-500 font-normal">({item.plat})</span></p>
                      <p className="text-xs text-slate-400">Pelanggan: {item.nama} | Crew Pembawa: {item.crew} | Tuner: <span className="text-emerald-400 font-medium">{item.tuner || '-'}</span> | Remote: <span className="text-cyan-400 font-medium">{item.remote || '-'}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-orange-400">{pkg ? pkg.nama : '-'}</p>
                      <p className="text-xs text-slate-500">{formatDateDisplay(item.tanggal)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
    ];
    return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans text-slate-200">
      
      {/* Sidebar Nav */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-slate-800">
            <h1 className="text-2xl font-black flex items-center text-orange-500 tracking-tight">
              <Gauge className="mr-2 text-orange-500" size={28} /> Tuning<span className="text-slate-100 font-bold">Khan</span>
            </h1>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-extrabold flex items-center gap-1.5">
              <span>Cloud Admin</span>
            </p>
          </div>
          
          <nav className="p-4 space-y-2">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
              { id: 'customers', name: 'Customer', icon: Users },
              { id: 'crews', name: 'Data Crew', icon: UserCheck },
              { id: 'finance', name: 'Keuangan', icon: DollarSign },
              { id: 'panduan', name: 'Panduan', icon: Settings }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => { setActiveTab(item.id); resetForm(); }}
                className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                  activeTab === item.id 
                  ? 'bg-orange-600/10 text-orange-500 border border-orange-500/20' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <item.icon size={18} className="mr-3" /> {item.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 text-center text-xs text-slate-600">
          TuningKhan v3.5 &copy; 2026
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-slate-900 border-b border-slate-800 h-16 flex items-center justify-between px-8 shadow-md">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full animate-pulse bg-orange-500"></span>
            <h2 className="text-lg font-bold text-slate-200 uppercase tracking-wider">{activeTab} Panel</h2>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-200">Admin</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Super Control</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-slate-950 font-black text-sm border-2 border-slate-800">
              TK
            </div>
          </div>
        </header>

        {/* Dynamic Inner Panel Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {activeTab !== 'dashboard' && !showFormPanel && (
              <div className="flex justify-between items-center bg-slate-900 p-4 border border-slate-800 rounded-xl">
                <p className="text-sm text-slate-400">Punya data baru untuk dimasukkan ke bagian {activeTab}?</p>
                <button 
                  onClick={() => { resetForm(); setShowFormPanel(true); }} 
                  className="bg-orange-600 text-slate-950 font-extrabold px-4 py-2 rounded-xl flex items-center hover:bg-orange-500 hover:scale-105 transition shadow-lg"
                >
                  <Plus size={16} className="mr-2" /> Tambah Baru
                </button>
              </div>
            )}

            {/* CRUDS Forms */}
            {showFormPanel && (
              <div className="bg-slate-900 border-2 border-orange-500/30 p-6 rounded-xl shadow-xl">
                <h3 className="text-base font-bold text-slate-100 border-b border-slate-850 pb-3 mb-4 flex items-center">
                  {editingId ? <Edit size={18} className="mr-2 text-orange-500" /> : <Plus size={18} className="mr-2 text-orange-500" />}
                  {editingId ? 'Edit Item' : 'Tambah Baru'} - <span className="capitalize text-orange-500 ml-1">{activeTab}</span>
                </h3>

                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {activeTab === 'panduan' && (
                    <>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nama Paket / Layanan</label>
                        <input type="text" name="nama" value={formData.nama || ''} onChange={handleInputChange} placeholder="Misal: Stage 1 Honda Brio" required className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Harga Remap (Rp)</label>
                        <input type="number" name="hargaRemap" value={formData.hargaRemap || formData.harga_remap || ''} onChange={handleInputChange} placeholder="1500000" required className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Benefit (Rp)</label>
                        <input type="number" name="benefit" value={formData.benefit || ''} onChange={handleInputChange} placeholder="300000" required className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none" />
                      </div>
                    </>
                  )}

                  {activeTab === 'customers' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal Remap</label>
                        <DatePicker 
                          value={formData.tanggal || ''} 
                          onChange={(val) => handleInputChange({ target: { name: 'tanggal', value: val } })} 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nama Pelanggan</label>
                        <input type="text" name="nama" value={formData.nama || ''} onChange={handleInputChange} required className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">No. Plat Kendaraan</label>
                        <input type="text" name="plat" value={formData.plat || ''} onChange={handleInputChange} placeholder="B 1234 ABC" required className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tipe Mobil</label>
                        <input type="text" name="mobil" value={formData.mobil || ''} onChange={handleInputChange} placeholder="Innova Reborn" required className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Warna Mobil</label>
                        <input type="text" name="warna" value={formData.warna || ''} onChange={handleInputChange} placeholder="Hitam / Putih / Silver" required className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">VIN (No. Rangka)</label>
                        <input type="text" name="vin" value={formData.vin || ''} onChange={handleInputChange} placeholder="MHR17xxxxxxxxxxxx" required className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">No. HP Pelanggan</label>
                        <input type="text" name="phone" value={formData.phone || ''} onChange={handleInputChange} placeholder="08123xxxxxx" required className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Lokasi Remap</label>
                        <input type="text" name="location" value={formData.location || ''} onChange={handleInputChange} placeholder="Bengkel Utama" required className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pilihan Paket Remap</label>
                        <select name="paketId" value={formData.paketId || formData.paket_id || ''} onChange={handleInputChange} required className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none">
                          <option value="">-- Pilih Paket Panduan --</option>
                          {data.panduan.map(p => (
                            <option key={p.id} value={p.id}>{p.nama} (Remap: {formatRupiah(p.hargaRemap || p.harga_remap || 0)})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Crew Pembawa (Membawa Pelanggan)</label>
                        <select name="crew" value={formData.crew || ''} onChange={handleInputChange} required className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none">
                          <option value="">-- Pilih Crew Pembawa --</option>
                          {data.crews.map(c => (
                            <option key={c.id} value={c.nama}>{c.nama}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pilihan Tuner (Rp250.000 Benefit)</label>
                        <select name="tuner" value={formData.tuner || ''} onChange={handleInputChange} required className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none">
                          <option value="">-- Pilih Tuner --</option>
                          {data.crews.map(c => (
                            <option key={c.id} value={c.nama}>{c.nama}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pilihan Remote (Rp150.000 Benefit, Opsional)</label>
                        <select name="remote" value={formData.remote || ''} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none">
                          <option value="">-- Pilih Remote --</option>
                          {data.crews.map(c => (
                            <option key={c.id} value={c.nama}>{c.nama}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nama Perantara / Sales (Opsional)</label>
                        <input type="text" name="perantara" value={formData.perantara || ''} onChange={handleInputChange} placeholder="Nama Perantara" className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Fee Perantara (Rp) (Opsional)</label>
                        <input type="number" name="perantaraFee" value={formData.perantaraFee || formData.perantara_fee || ''} onChange={handleInputChange} placeholder="Contoh: 100000" className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none" />
                      </div>

                      {/* Checklist Support Crew */}
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pilihan Support (Rp50.000 Benefit, Bisa Lebih Dari 1)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-950 border border-slate-800 p-3 rounded-lg max-h-40 overflow-y-auto">
                          {data.crews.map(c => {
                            const selectedSupports = Array.isArray(formData.support) 
                              ? formData.support 
                              : (formData.support ? formData.support.split(',').map(s => s.trim()) : []);
                            const isChecked = selectedSupports.includes(c.nama);
                            
                            const handleSupportToggle = () => {
                              let newSupports;
                              if (isChecked) {
                                newSupports = selectedSupports.filter(name => name !== c.nama);
                              } else {
                                newSupports = [...selectedSupports, c.nama];
                              }
                              setFormData(prev => ({ ...prev, support: newSupports }));
                            };

                            return (
                              <label key={c.id} className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer hover:text-slate-100 transition select-none">
                                <input 
                                  type="checkbox" 
                                  checked={isChecked} 
                                  onChange={handleSupportToggle}
                                  className="rounded border-slate-800 bg-slate-900 text-orange-500 focus:ring-orange-500 h-4 w-4"
                                />
                                <span>{c.nama}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === 'crews' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nama Anggota Crew</label>
                        <input type="text" name="nama" value={formData.nama || ''} onChange={handleInputChange} required className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Posisi / Jabatan</label>
                        <input type="text" name="posisi" value={formData.posisi || ''} onChange={handleInputChange} placeholder="Tuner / Teknisi" required className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none" />
                      </div>
                    </>
                  )}

                  {activeTab === 'finance' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal Transaksi</label>
                        <DatePicker 
                          value={formData.tanggal || ''} 
                          onChange={(val) => handleInputChange({ target: { name: 'tanggal', value: val } })} 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tipe Alur Kas</label>
                        <select name="tipe" value={formData.tipe || ''} onChange={handleInputChange} required className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none">
                          <option value="">-- Pilih Tipe --</option>
                          <option value="Pemasukan">Pemasukan</option>
                          <option value="Pengeluaran">Pengeluaran</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Hubungkan No. Plat Customer</label>
                        <select name="plat" value={formData.plat || ''} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none">
                          <option value="">-- Non Plat / Hubungkan Plat --</option>
                          {data.customers.map(c => (
                            <option key={c.id} value={c.plat}>{c.plat} ({c.nama})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Crew Penerima (Auto)</label>
                        <select name="crew" value={formData.crew || ''} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none">
                          <option value="">-- Pilih Crew --</option>
                          {data.crews.map(c => (
                            <option key={c.id} value={c.nama}>{c.nama}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Jumlah Nominal (Rp) (Auto)</label>
                        <input type="number" name="amount" value={formData.amount || ''} onChange={handleInputChange} required className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Keterangan Tambahan</label>
                        <input type="text" name="keterangan" value={formData.keterangan || ''} onChange={handleInputChange} placeholder="Keterangan transaksi..." required className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none" />
                      </div>
                    </>
                  )}

                  <div className="md:col-span-2 flex justify-end gap-3 mt-4 border-t border-slate-850 pt-4">
                    <button type="button" onClick={handleCancelClick} className="px-4 py-2 bg-slate-800 text-slate-400 rounded-xl hover:text-slate-200 transition">Batal</button>
                    <button type="submit" className="px-5 py-2 bg-orange-600 text-slate-950 font-bold rounded-xl hover:bg-orange-500 transition shadow-md">
                      {editingId ? 'Update Data' : 'Simpan Data'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Render Tab List */}
            {activeTab === 'dashboard' ? (
              renderDashboardStats()
            ) : (
              /* Render Other Tabs with filters and lists */
              <div className="space-y-6">
                
                {/* MENU STATS KEUNGAN YANG DINAMIS DAN TRANSPARAN */}
                {activeTab === 'finance' && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
                    <div className="bg-slate-950/60 p-4 border border-orange-500/20 rounded-xl flex flex-col justify-between relative group overflow-hidden">
                      <div className="absolute right-3 top-3 text-orange-500/20">
                        <DollarSign size={24} />
                      </div>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        Total Saldo Bersih 
                        <span className="cursor-pointer text-slate-400 hover:text-slate-200" title="Formula: (Pemasukan Manual + Harga Remap Customer) - (Pengeluaran Manual + Semua Komisi/Benefit Crew + Fee Perantara)">
                          <Info size={12} />
                        </span>
                      </p>
                      <h3 className="text-xl font-extrabold text-amber-500 mt-2">{formatRupiah(financialStats.totalSaldoBersih)}</h3>
                      <p className="text-[9px] text-slate-500 mt-1 font-mono">Formula Terbuka Aktif</p>
                    </div>

                    <div className="bg-slate-950/60 p-4 border border-emerald-500/10 rounded-xl flex flex-col justify-between">
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Total Pemasukan (Kumulatif)</p>
                      <h3 className="text-xl font-extrabold text-emerald-400 mt-2">{formatRupiah(financialStats.totalPemasukan)}</h3>
                      <p className="text-[9px] text-emerald-600 mt-1 font-semibold flex items-center gap-1">
                        <TrendingUp size={10} /> Kas Manual + Harga Remap
                      </p>
                    </div>

                    <div className="bg-slate-950/60 p-4 border border-red-500/10 rounded-xl flex flex-col justify-between">
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Total Pengeluaran (Kumulatif)</p>
                      <h3 className="text-xl font-extrabold text-red-400 mt-2">{formatRupiah(financialStats.totalPengeluaran)}</h3>
                      <p className="text-[9px] text-red-600 mt-1 font-semibold flex items-center gap-1">
                        <TrendingDown size={10} /> Kas Manual + Benefit + Perantara
                      </p>
                    </div>

                    <div className="bg-slate-950/60 p-4 border border-indigo-500/10 rounded-xl flex flex-col justify-between">
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Total Benefit Crew</p>
                      <h3 className="text-xl font-extrabold text-indigo-400 mt-2">{formatRupiah(financialStats.totalBenefit)}</h3>
                      <p className="text-[9px] text-slate-500 mt-1 font-mono">Otomatis Peran Customer</p>
                    </div>
                  </div>
                )}

                {!showFormPanel && (
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3 flex-1">
                      
                      {/* Search */}
                      <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <Search className="absolute left-3 top-2.5 text-slate-600" size={18} />
                        <input 
                          type="text" 
                          placeholder="Cari data..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      {/* Dropdown Filters */}
                      {activeTab === 'customers' && (
                        <select value={filterCrew} onChange={e => setFilterCrew(e.target.value)} className="bg-slate-950 border border-slate-850 rounded-xl p-2 text-xs text-slate-300">
                          <option value="">Semua Crew</option>
                          {data.crews.map(c => <option key={c.id} value={c.nama}>{c.nama}</option>)}
                        </select>
                      )}

                      {activeTab === 'finance' && (
                        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-slate-950 border border-slate-850 rounded-xl p-2 text-xs text-slate-300">
                          <option value="">Semua Tipe</option>
                          <option value="Pemasukan">Pemasukan</option>
                          <option value="Pengeluaran">Pengeluaran</option>
                        </select>
                      )}

                      {/* Date Filter */}
                      {(activeTab === 'customers' || activeTab === 'finance') && (
                        <div className="flex items-center gap-2">
                          <div className="w-36">
                            <DatePicker value={filterDateStart} onChange={setFilterDateStart} placeholder="Dari Tgl" />
                          </div>
                          <span className="text-slate-600 text-xs">-</span>
                          <div className="w-36">
                            <DatePicker value={filterDateEnd} onChange={setFilterDateEnd} placeholder="S/D Tgl" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Export Actions */}
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => exportToCSV(activeTab, filteredItems)}
                        className="bg-slate-950 border border-slate-800 hover:border-emerald-500/30 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2"
                      >
                        <Download size={14} /> <span>Excel</span>
                      </button>
                      <button 
                        onClick={() => exportToPDF(activeTab, filteredItems)}
                        className="bg-slate-950 border border-slate-800 hover:border-orange-500/30 hover:bg-orange-500/10 text-slate-300 hover:text-orange-400 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2"
                      >
                        <Printer size={14} /> <span>PDF</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Table list */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-850 border-b border-slate-850 text-slate-400 uppercase text-[10px] font-bold tracking-widest">
                          {activeTab === 'customers' && (
                            <>
                              <th className="p-4">Tanggal</th>
                              <th className="p-4">Nama Pelanggan</th>
                              <th className="p-4">No. Plat</th>
                              <th className="p-4">Kendaraan</th>
                              <th className="p-4">Warna</th>
                              <th className="p-4">VIN</th>
                              <th className="p-4">Paket</th>
                              <th className="p-4">Crew Pembawa</th>
                              <th className="p-4">Tuner</th>
                              <th className="p-4">Remote</th>
                              <th className="p-4">Support</th>
                              <th className="p-4">Perantara</th>
                              <th className="p-4">Fee</th>
                              <th className="p-4 text-right">Aksi</th>
                            </>
                          )}
                          {activeTab === 'crews' && (
                            <>
                              <th className="p-4">Nama Crew</th>
                              <th className="p-4">Posisi</th>
                              <th className="p-4">Akumulasi Benefit</th>
                              <th className="p-4 text-right">Aksi</th>
                            </>
                          )}
                          {activeTab === 'finance' && (
                            <>
                              <th className="p-4">Tanggal</th>
                              <th className="p-4">Tipe</th>
                              <th className="p-4">Plat</th>
                              <th className="p-4">Penerima</th>
                              <th className="p-4">Keterangan</th>
                              <th className="p-4">Nominal</th>
                              <th className="p-4 text-right">Aksi</th>
                            </>
                          )}
                          {activeTab === 'panduan' && (
                            <>
                              <th className="p-4">Nama Layanan</th>
                              <th className="p-4">Harga Remap</th>
                              <th className="p-4">Benefit</th>
                              <th className="p-4 text-right">Aksi</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredItems.length === 0 ? (
                          <tr>
                            <td colSpan="100%" className="p-8 text-center text-slate-600 italic text-sm">Tidak ada data ditemukan.</td>
                          </tr>
                        ) : (
                          filteredItems.map(item => (
                            <tr key={item.id} className="border-b border-slate-850 hover:bg-slate-800/10 transition">
                              {activeTab === 'customers' && (
                                <>
                                  <td className="p-4 text-slate-400 text-xs font-mono">{formatDateDisplay(item.tanggal)}</td>
                                  <td className="p-4 font-bold text-slate-200">{item.nama}</td>
                                  <td className="p-4 font-mono text-xs"><span className="bg-slate-950 border border-slate-850 px-2 py-1 rounded text-orange-400">{item.plat}</span></td>
                                  <td className="p-4 text-slate-400 text-sm">{item.mobil}</td>
                                  <td className="p-4 text-slate-400 text-sm">{item.warna || '-'}</td>
                                  <td className="p-4 font-mono text-xs text-slate-400">{item.vin || '-'}</td>
                                  <td className="p-4 text-slate-300 text-sm">
                                    {(() => {
                                      const p = data.panduan.find(x => x.id === (item.paketId || item.paket_id));
                                      return p ? p.nama : '-';
                                    })()}
                                  </td>
                                  <td className="p-4 text-slate-400 text-sm">{item.crew || '-'}</td>
                                  <td className="p-4 text-emerald-400 font-medium">{item.tuner || '-'}</td>
                                  <td className="p-4 text-cyan-400 font-medium">{item.remote || '-'}</td>
                                  <td className="p-4 text-indigo-400 text-sm max-w-[150px] truncate" title={item.support || '-'}>{item.support || '-'}</td>
                                  <td className="p-4 text-slate-400 text-sm">{item.perantara || '-'}</td>
                                  <td className="p-4 text-slate-400 text-sm">{formatRupiah(item.perantaraFee || item.perantara_fee || 0)}</td>
                                </>
                              )}
                              {activeTab === 'crews' && (
                                <>
                                  <td className="p-4 font-bold text-slate-200">{item.nama}</td>
                                  <td className="p-4 text-slate-400 text-sm">{item.posisi}</td>
                                  <td className="p-4 font-extrabold text-emerald-400">{formatRupiah(calculateCrewBenefit(item.nama))}</td>
                                </>
                              )}
                              {activeTab === 'finance' && (
                                <>
                                  <td className="p-4 text-slate-400 text-xs font-mono">{formatDateDisplay(item.tanggal)}</td>
                                  <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider
                                      ${item.tipe === 'Pemasukan' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                                        'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                      {item.tipe}
                                    </span>
                                  </td>
                                  <td className="p-4 font-mono text-xs text-slate-400">{item.plat || '-'}</td>
                                  <td className="p-4 text-slate-300 text-sm">{item.crew || '-'}</td>
                                  <td className="p-4 text-slate-400 text-xs">{item.keterangan}</td>
                                  <td className={`p-4 font-extrabold ${item.tipe === 'Pengeluaran' ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {item.tipe === 'Pengeluaran' ? '-' : '+'}{formatRupiah(item.amount)}
                                  </td>
                                </>
                              )}
                              {activeTab === 'panduan' && (
                                <>
                                  <td className="p-4 font-bold text-slate-200">{item.nama}</td>
                                  <td className="p-4 text-orange-400 font-bold">{formatRupiah(item.hargaRemap || item.harga_remap)}</td>
                                  <td className="p-4 text-emerald-400 font-bold">{formatRupiah(item.benefit)}</td>
                                </>
                              )}

                              <td className="p-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button onClick={() => {
                                    const prepItem = { ...item };
                                    if (prepItem.support && typeof prepItem.support === 'string') {
                                      prepItem.support = prepItem.support.split(',').map(s => s.trim());
                                    }
                                    handleEdit(prepItem);
                                  }} className="p-1 text-slate-400 hover:text-orange-500 rounded transition"><Edit size={16} /></button>
                                  <button onClick={() => setDeleteModal({ show: true, item, menu: activeTab })} className="p-1 text-slate-400 hover:text-red-500 rounded transition"><Trash2 size={16} /></button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* CONFIRMATION MODALS */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 relative">
            <button onClick={() => setDeleteModal({ show: false, item: null, menu: '' })} className="absolute top-4 right-4 text-slate-500 hover:text-slate-300">
              <X size={20} />
            </button>
            <div className="flex items-center text-red-500 mb-4">
              <AlertCircle className="mr-2 text-red-500" size={24} />
              <h3 className="text-lg font-bold">Hapus Data Permanen?</h3>
            </div>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Tindakan ini tidak dapat dibatalkan. Menghapus item ini akan melenyapkan data terkait dari database cloud secara permanen.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteModal({ show: false, item: null, menu: '' })} className="px-4 py-2 bg-slate-800 text-slate-400 rounded-xl hover:text-slate-200 transition">Batal</button>
              <button onClick={executeDelete} className="px-4 py-2 bg-red-600 text-slate-100 rounded-xl font-bold hover:bg-red-500 transition">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {cancelConfirmModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 relative">
            <button onClick={() => setCancelConfirmModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-300">
              <X size={20} />
            </button>
            <div className="flex items-center text-amber-500 mb-4">
              <AlertCircle className="mr-2 text-amber-500" size={24} />
              <h3 className="text-lg font-bold">Batalkan Input Data?</h3>
            </div>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Anda sedang mengetik data baru. Apakah Anda yakin ingin membuang semua perubahan yang belum disimpan?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setCancelConfirmModal(false)} className="px-4 py-2 bg-slate-800 text-slate-400 rounded-xl hover:text-slate-200 transition">Kembali Lanjutkan</button>
              <button onClick={resetForm} className="px-4 py-2 bg-amber-600 text-slate-950 font-bold rounded-xl hover:bg-amber-500 transition">Ya, Batalkan</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
