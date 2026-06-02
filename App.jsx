import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Users, DollarSign, UserCheck, Plus, Trash2, Edit, Gauge, 
  Search, X, AlertCircle, Settings, TrendingUp, TrendingDown, Bell, Download, 
  Printer, Calendar, Filter, Lock, LogOut, Database, HelpCircle
} from 'lucide-react';

// Fungsi aman untuk memuat kredensial Supabase dari environment (.env) atau localStorage
const getSupabaseConfig = () => {
  let url = '';
  let key = '';
  
  try {
    // Safeguard penggunaan import.meta di lingkungan bundler es2015
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      url = import.meta.env.VITE_SUPABASE_URL || '';
      key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    }
  } catch (e) {
    // Abaikan jika terjadi error pada akses import.meta
  }

  // Jika env kosong, ambil cadangan dari localStorage
  url = url || localStorage.getItem('tk_supabase_url') || '';
  key = key || localStorage.getItem('tk_supabase_anon_key') || '';
  return { url, key };
};

const initialConfig = getSupabaseConfig();

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
            <button type="button" onClick={() => setViewDate(new Date(year, month - 1, 1))} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <span className="font-bold text-slate-200 text-sm tracking-wide">{monthNames[month]} {year}</span>
            <button type="button" onClick={() => setViewDate(new Date(year, month + 1, 1))} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition">
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
                      ? 'bg-orange-500 text-slate-950 font-black shadow-lg' 
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

export default function App() {
  const [config, setConfig] = useState(initialConfig);
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
  // Supabase Client States
  const [supabaseLoaded, setSupabaseLoaded] = useState(false);
  const [supabaseClient, setSupabaseClient] = useState(null);

  // Login input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Supabase Portal input config states
  const [inputUrl, setInputUrl] = useState(initialConfig.url);
  const [inputKey, setInputKey] = useState(initialConfig.key);

  // Tab & CRUD state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showFormPanel, setShowFormPanel] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [deleteModal, setDeleteModal] = useState({ show: false, item: null, menu: '' });
  const [cancelConfirmModal, setCancelConfirmModal] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCrew, setFilterCrew] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');
  const [filterPaket, setFilterPaket] = useState('');

  // Main Database State
  const [dbData, setDbData] = useState({
    customers: [],
    crews: [],
    finance: [],
    panduan: []
  });

  // Load Supabase script dynamically to bypass import issues in sandbox runtime
  useEffect(() => {
    const loadScript = () => {
      if (window.supabase) {
        setSupabaseLoaded(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.async = true;
      script.onload = () => setSupabaseLoaded(true);
      script.onerror = () => console.error('Gagal memuat Supabase CDN script');
      document.head.appendChild(script);
    };
    loadScript();
  }, []);

  // Initialize Supabase Client once script is loaded and credentials are set
  useEffect(() => {
    if (supabaseLoaded && config.url && config.key && window.supabase) {
      try {
        const client = window.supabase.createClient(config.url, config.key);
        setSupabaseClient(client);
      } catch (err) {
        console.error('Inisialisasi Supabase gagal:', err);
      }
    }
  }, [supabaseLoaded, config]);

  // Set Auth loading to false if no configuration found
  useEffect(() => {
    if (!config.url || !config.key) {
      setIsAuthLoading(false);
    }
  }, [config]);

  // Handle active session and auth changes
  useEffect(() => {
    if (!supabaseClient) return;

    setIsAuthLoading(true);
    // Cek sesi aktif saat ini
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAuthLoading(false);
    }).catch(() => setIsAuthLoading(false));

    // Dengarkan perubahan auth (login / logout)
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthLoading(false);
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [supabaseClient]);

  const fetchAllData = async () => {
    if (!supabaseClient || !user) return;
    
    try {
      const [resCust, resCrews, resFin, resPan] = await Promise.all([
        supabaseClient.from('customers').select('*').order('tanggal', { ascending: false }),
        supabaseClient.from('crews').select('*').order('nama'),
        supabaseClient.from('finance').select('*').order('tanggal', { ascending: false }),
        supabaseClient.from('panduan').select('*').order('nama')
      ]);

      setDbData({
        customers: resCust.data || [],
        crews: resCrews.data || [],
        finance: resFin.data || [],
        panduan: resPan.data || []
      });
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [user, activeTab, supabaseClient]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!supabaseClient) {
      setAuthError('Hubungkan konfigurasi Supabase Anda terlebih dahulu di sebelah kanan!');
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await supabaseClient.auth.signUp({ email, password });
        if (error) throw error;
        setAuthError('Pendaftaran sukses! Silakan periksa email verifikasi Anda.');
      } else {
        const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setAuthError(err.message);
    }
  };

 const handleSaveConfig = () => {
  // Ambil input user
  let rawUrl = inputUrl; 

  // OTOMATIS BERSIHKAN URL (Hapus /rest/v1/ atau / di akhir)
  const cleanUrl = rawUrl
    .replace(/\/rest\/v1\/?$/, '') 
    .replace(/\/$/, '');

  // Simpan ke local storage
  localStorage.setItem('tk_supabase_url', cleanUrl);
  localStorage.setItem('tk_supabase_anon_key', inputKey);

  // Reload halaman
  window.location.reload();
};

  const handleLogout = async () => {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    setUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };

    // Otomatisasi Menu Keuangan berdasarkan data terpilih
    if (activeTab === 'finance') {
      if (name === 'plat') {
        const customer = dbData.customers.find(c => c.plat === value);
        if (customer) {
          newFormData.crew = customer.crew;
          const paket = dbData.panduan.find(p => p.id === customer.paket_id);
          
          if (paket) {
            if (newFormData.tipe === 'Benefit') {
              newFormData.amount = paket.benefit;
            } else if (newFormData.tipe === 'Pemasukan') {
              newFormData.amount = paket.harga_remap;
            }
          }
        }
      }
      
      if (name === 'tipe' && newFormData.plat) {
        const customer = dbData.customers.find(c => c.plat === newFormData.plat);
        if (customer) {
          const paket = dbData.panduan.find(p => p.id === customer.paket_id);
          if (paket) {
            if (value === 'Benefit') {
              newFormData.amount = paket.benefit;
            } else if (value === 'Pemasukan') {
              newFormData.amount = paket.harga_remap;
            } else {
              newFormData.amount = '';
            }
          }
        }
      }
    }

    setFormData(newFormData);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!supabaseClient) return;

    try {
      // Menyesuaikan struktur kolom PostgreSQL Supabase
      const payload = { ...formData };
      
      // Bersihkan data kosong agar tidak crash saat konversi tipe data
      if (payload.amount) payload.amount = Number(payload.amount);
      if (payload.harga_remap) payload.harga_remap = Number(payload.harga_remap);
      if (payload.benefit) payload.benefit = Number(payload.benefit);

      if (editingId) {
        const { error } = await supabaseClient.from(activeTab).update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabaseClient.from(activeTab).insert([payload]);
        if (error) throw error;
      }
      
      setFormData({});
      setEditingId(null);
      setShowFormPanel(false);
      fetchAllData();
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const startEdit = (item) => {
    setFormData(item);
    setEditingId(item.id);
    setShowFormPanel(true);
  };

  const executeDelete = async () => {
    if (!supabaseClient) return;
    const { item, menu } = deleteModal;
    try {
      const { error } = await supabaseClient.from(menu).delete().eq('id', item.id);
      if (error) throw error;
      setDeleteModal({ show: false, item: null, menu: '' });
      fetchAllData();
    } catch (err) {
      console.error("Delete failed:", err);
    }
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

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  };

  const calculateCrewBenefit = (crewName) => {
    return dbData.finance
      .filter(f => f.crew === crewName && f.tipe === 'Benefit')
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
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

  const getFilteredItems = () => {
    const list = dbData[activeTab] || [];
    
    if (activeTab === 'customers') {
      return list.filter(item => {
        const matchesSearch = 
          item.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.plat?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.mobil?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.crew?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCrew = !filterCrew || item.crew === filterCrew;
        const matchesPaket = !filterPaket || item.paket_id === filterPaket;
        const matchesDate = (!filterDateStart || item.tanggal >= filterDateStart) &&
                            (!filterDateEnd || item.tanggal <= filterDateEnd);
        
        return matchesSearch && matchesCrew && matchesPaket && matchesDate;
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
        
        const matchesCrew = !filterCrew || item.crew === filterCrew;
        const matchesType = !filterType || item.tipe === filterType;
        const matchesDate = (!filterDateStart || item.tanggal >= filterDateStart) &&
                            (!filterDateEnd || item.tanggal <= filterDateEnd);
        
        return matchesSearch && matchesCrew && matchesType && matchesDate;
      });
    }

    if (activeTab === 'panduan') {
      return list.filter(item => {
        return item.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
               String(item.harga_remap).includes(searchQuery) ||
               String(item.benefit).includes(searchQuery);
      });
    }

    return list;
  };

  const filteredItems = getFilteredItems();

  const exportToCSV = (tabName, items) => {
    let headers = [];
    let rows = [];
    
    if (tabName === 'customers') {
      headers = ['Tanggal', 'Nama Pelanggan', 'No. Plat', 'Tipe Mobil', 'Paket Remap', 'Crew Bertugas'];
      rows = items.map(item => {
        const p = dbData.panduan.find(x => x.id === item.paket_id);
        return [item.tanggal || '', item.nama || '', item.plat || '', item.mobil || '', p ? p.nama : '-', item.crew || ''];
      });
    } else if (tabName === 'crews') {
      headers = ['Nama Crew', 'Posisi', 'Akumulasi Benefit'];
      rows = items.map(item => [item.nama || '', item.posisi || '', calculateCrewBenefit(item.nama)]);
    } else if (tabName === 'finance') {
      headers = ['Tanggal', 'Tipe', 'Plat', 'Crew', 'Keterangan', 'Nominal'];
      rows = items.map(item => [item.tanggal || '', item.tipe || '', item.plat || '-', item.crew || '-', item.keterangan || '', item.amount || 0]);
    } else if (tabName === 'panduan') {
      headers = ['Nama Paket', 'Harga Remap', 'Benefit'];
      rows = items.map(item => [item.nama || '', item.harga_remap || 0, item.benefit || 0]);
    }
    
    const csvContent = "\uFEFF" + [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `TuningKhan_${tabName}_Cloud.csv`);
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
      tableHeadersHTML = '<tr><th>Tanggal</th><th>Nama</th><th>No. Plat</th><th>Mobil</th><th>Paket</th><th>Crew</th></tr>';
      tableRowsHTML = items.map(item => {
        const p = dbData.panduan.find(x => x.id === item.paket_id);
        return `<tr>
          <td>${formatDateDisplay(item.tanggal)}</td>
          <td><b>${item.nama}</b></td>
          <td><span style="font-family: monospace; background: #1e293b; color: #f8fafc; padding: 3px 6px; border-radius: 4px;">${item.plat}</span></td>
          <td>${item.mobil}</td>
          <td>${p ? p.nama : '-'}</td>
          <td>${item.crew}</td>
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
        <td><span style="font-size: 11px; font-weight: bold; padding: 2px 6px; border-radius: 4px; ${
          item.tipe === 'Pemasukan' ? 'background: #d1fae5; color: #065f46;' : 
          item.tipe === 'Pengeluaran' ? 'background: #fee2e2; color: #991b1b;' : 
          'background: #fef3c7; color: #92400e;'
        }">${item.tipe}</span></td>
        <td><span style="font-family: monospace;">${item.plat || '-'}</span></td>
        <td>${item.crew || '-'}</td>
        <td>${item.keterangan}</td>
        <td style="font-weight: bold; ${item.tipe === 'Pengeluaran' ? 'color: #ef4444;' : 'color: #10b981;'}">
          ${item.tipe === 'Pengeluaran' ? '-' : '+'}${formatRupiah(item.amount)}
        </td>
      </tr>`).join('');
    } else if (tabName === 'panduan') {
      tableHeadersHTML = '<tr><th>Nama Paket</th><th>Harga Remap</th><th>Benefit</th></tr>';
      tableRowsHTML = items.map(item => `<tr>
        <td><b>${item.nama}</b></td>
        <td style="color: #f97316; font-weight: bold;">${formatRupiah(item.harga_remap)}</td>
        <td style="color: #10b981; font-weight: bold;">${formatRupiah(item.benefit)}</td>
      </tr>`).join('');
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>TuningKhan Cloud Report - ${tabName.toUpperCase()}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #0f172a; background: #fff; }
            h1 { font-size: 24px; color: #f97316; margin: 0; }
            p { font-size: 12px; color: #64748b; margin: 5px 0 25px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
            th { background-color: #f8fafc; color: #475569; font-weight: 600; text-transform: uppercase; font-size: 10px; }
            .header-container { border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header-container">
            <h1>TuningKhan Performance</h1>
            <p>Laporan Resmi Manajemen ${tabName} | Dicetak: ${new Date().toLocaleDateString('id-ID')}</p>
          </div>
          <table>
            <thead>${tableHeadersHTML}</thead>
            <tbody>${tableRowsHTML}</tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const renderDashboardStats = () => {
    const totalCustomers = dbData.customers.length;
    const totalPemasukan = dbData.finance.filter(f => f.tipe === 'Pemasukan').reduce((sum, f) => sum + Number(f.amount || 0), 0);
    const totalPengeluaran = dbData.finance.filter(f => f.tipe === 'Pengeluaran').reduce((sum, f) => sum + Number(f.amount || 0), 0);
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Pelanggan</p>
            <div className="flex items-center justify-between mt-2">
              <h3 className="text-3xl font-extrabold text-orange-500">{totalCustomers} Unit</h3>
              <Users size={32} className="text-slate-700" />
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Pemasukan</p>
            <div className="flex items-center justify-between mt-2">
              <h3 className="text-2xl font-extrabold text-emerald-400">{formatRupiah(totalPemasukan)}</h3>
              <TrendingUp size={32} className="text-slate-700" />
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Pengeluaran</p>
            <div className="flex items-center justify-between mt-2">
              <h3 className="text-2xl font-extrabold text-red-400">{formatRupiah(totalPengeluaran)}</h3>
              <TrendingDown size={32} className="text-slate-700" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Aktivitas Remap Terbaru</h3>
          {dbData.customers.length === 0 ? (
            <p className="text-slate-600 italic text-sm">Belum ada riwayat aktivitas terbaru.</p>
          ) : (
            <div className="space-y-4">
              {dbData.customers.slice(0, 3).map((item, index) => {
                const pkg = dbData.panduan.find(p => p.id === item.paket_id);
                return (
                  <div key={index} className="flex justify-between items-center border-b border-slate-850 pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-bold text-slate-200">{item.mobil} <span className="text-slate-500 font-normal">({item.plat})</span></p>
                      <p className="text-xs text-slate-500">Pelanggan: {item.nama} | Teknisi: {item.crew}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-orange-400">{pkg ? pkg.nama : '-'}</p>
                      <p className="text-xs text-slate-500 font-mono">{formatDateDisplay(item.tanggal)}</p>
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

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200">
        <Gauge className="animate-spin text-orange-500 mb-4" size={48} />
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">Loading Supabase Cloud...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row text-slate-200">
        <div className="flex-1 flex flex-col justify-center p-8 lg:p-16 border-r border-slate-900 bg-slate-900/30">
          <div className="max-w-md mx-auto w-full space-y-8">
            <div>
              <h1 className="text-3xl font-black text-orange-500 tracking-tight flex items-center">
                <Gauge className="mr-3 text-orange-500" size={36} /> TuningKhan <span className="text-white font-normal ml-1">Cloud</span>
              </h1>
              <p className="text-slate-400 mt-2">Login ke sistem manajemen bengkel terpusat berbasis Supabase.</p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Admin</label>
                <input 
                  type="email" 
                  required 
                  placeholder="admin@tuningkhan.com" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-3 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label>
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-3 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              {authError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
                  {authError}
                </div>
              )}

              <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-slate-950 font-black py-3 rounded-xl transition duration-300 shadow-lg shadow-orange-500/20">
                {isSignUp ? 'Daftar Akun Baru' : 'Masuk Dashboard'}
              </button>
            </form>

            <div className="text-center">
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-slate-400 hover:text-orange-500 transition font-medium"
              >
                {isSignUp ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Buat akun baru'}
              </button>
            </div>
          </div>
        </div>

        {/* SETUP SUPABASE PORTAL */}
        <div className="flex-1 flex flex-col justify-center p-8 lg:p-16">
          <div className="max-w-md mx-auto w-full space-y-6">
            <div className="flex items-center space-x-3 text-slate-400">
              <Database className="text-orange-500" size={24} />
              <h2 className="text-lg font-bold">Koneksi Database Supabase</h2>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Hubungkan aplikasi TuningKhan Pro Anda ke akun **Supabase** milik Anda sendiri untuk penyimpanan cloud yang aman dan gratis.
            </p>

            <form onSubmit={handleSaveConfig} className="space-y-3 bg-slate-900 border border-slate-850 p-6 rounded-2xl">
              <h3 className="text-sm font-bold uppercase text-slate-400 mb-2">Konfigurasi API</h3>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">SUPABASE URL</label>
                <input type="text" required placeholder="https://xxxx.supabase.co" value={inputUrl} onChange={e => setInputUrl(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-2.5 text-xs rounded-lg text-slate-300 focus:border-orange-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">SUPABASE ANON KEY</label>
                <input type="password" required placeholder="eyJhbGciOi..." value={inputKey} onChange={e => setInputKey(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-2.5 text-xs rounded-lg text-slate-300 focus:border-orange-500 focus:outline-none" />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition mt-2">
                Simpan & Hubungkan Database
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

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
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[8px]">SUPABASE</span>
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

        <div className="p-4 border-t border-slate-800 flex flex-col gap-2">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 bg-slate-950 hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-slate-850 py-2.5 rounded-xl text-xs font-bold transition"
          >
            <LogOut size={14} /> Keluar Sistem
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-slate-900 border-b border-slate-800 h-16 flex items-center justify-between px-8 shadow-md">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full animate-pulse bg-emerald-500"></span>
            <h2 className="text-lg font-bold text-slate-200 uppercase tracking-wider">{activeTab} Panel</h2>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-200">Admin</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{user.email}</p>
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
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl">
                <h3 className="text-base font-bold text-slate-100 border-b border-slate-850 pb-3 mb-4 flex items-center">
                  {editingId ? <Edit size={18} className="mr-2 text-orange-500" /> : <Plus size={18} className="mr-2 text-orange-500" />}
                  {editingId ? 'Edit Item' : 'Tambah Baru'} - <span className="capitalize text-orange-500 ml-1">{activeTab}</span>
                </h3>

                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {activeTab === 'panduan' && (
                    <>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nama Paket / Layanan</label>
                        <input type="text" name="nama" value={formData.nama || ''} onChange={handleInputChange} placeholder="Stage 1 Honda Brio" required className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Harga Remap (Rp)</label>
                        <input type="number" name="harga_remap" value={formData.harga_remap || ''} onChange={handleInputChange} placeholder="1500000" required className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none" />
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
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">No. HP Pelanggan</label>
                        <input type="text" name="phone" value={formData.phone || ''} onChange={handleInputChange} placeholder="08123xxxxxx" required className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Lokasi Remap</label>
                        <input type="text" name="location" value={formData.location || ''} onChange={handleInputChange} placeholder="Bengkel Utama" required className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pilihan Paket Remap</label>
                        <select name="paket_id" value={formData.paket_id || ''} onChange={handleInputChange} required className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none">
                          <option value="">-- Pilih Paket Panduan --</option>
                          {dbData.panduan.map(p => (
                            <option key={p.id} value={p.id}>{p.nama} (Remap: {formatRupiah(p.harga_remap)})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Crew Bertugas</label>
                        <select name="crew" value={formData.crew || ''} onChange={handleInputChange} required className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none">
                          <option value="">-- Pilih Anggota Crew --</option>
                          {dbData.crews.map(c => (
                            <option key={c.id} value={c.nama}>{c.nama}</option>
                          ))}
                        </select>
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
                        <input type="text" name="posisi" value={formData.posisi || ''} onChange={handleInputChange} placeholder="Tuner / Teknisi / Admin" required className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none" />
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
                          <option value="Benefit">Benefit (Bonus Crew)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Hubungkan No. Plat Customer</label>
                        <select name="plat" value={formData.plat || ''} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none">
                          <option value="">-- Non Plat / Hubungkan Plat --</option>
                          {dbData.customers.map(c => (
                            <option key={c.id} value={c.plat}>{c.plat} ({c.nama})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Crew Penerima (Auto)</label>
                        <select name="crew" value={formData.crew || ''} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:border-orange-500 focus:outline-none">
                          <option value="">-- Pilih Crew --</option>
                          {dbData.crews.map(c => (
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

            {/* Render Dashboard Tab */}
            {activeTab === 'dashboard' ? (
              renderDashboardStats()
            ) : (
              /* Render Other Tabs with filters and lists */
              <div className="space-y-6">
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
                          {dbData.crews.map(c => <option key={c.id} value={c.nama}>{c.nama}</option>)}
                        </select>
                      )}

                      {activeTab === 'finance' && (
                        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-slate-950 border border-slate-850 rounded-xl p-2 text-xs text-slate-300">
                          <option value="">Semua Tipe</option>
                          <option value="Pemasukan">Pemasukan</option>
                          <option value="Pengeluaran">Pengeluaran</option>
                          <option value="Benefit">Benefit (Bonus Crew)</option>
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
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-850 border-b border-slate-850 text-slate-400 uppercase text-[10px] font-bold tracking-widest">
                        {activeTab === 'customers' && (
                          <>
                            <th className="p-4">Tanggal</th>
                            <th className="p-4">Nama Pelanggan</th>
                            <th className="p-4">No. Plat</th>
                            <th className="p-4">Kendaraan</th>
                            <th className="p-4">Crew</th>
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
                                <td className="p-4 text-slate-400 text-sm">{item.crew}</td>
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
                                      item.tipe === 'Pengeluaran' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
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
                                <td className="p-4 text-orange-400 font-bold">{formatRupiah(item.harga_remap)}</td>
                                <td className="p-4 text-emerald-400 font-bold">{formatRupiah(item.benefit)}</td>
                              </>
                            )}

                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => startEdit(item)} className="p-1 text-slate-400 hover:text-orange-500 rounded transition"><Edit size={16} /></button>
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
            )}

          </div>
        </div>
      </main>

      {/* CUSTOM CONFIRMATION MODALS (No alert/confirm used) */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 relative">
            <button onClick={() => setDeleteModal({ show: false, item: null, menu: '' })} className="absolute top-4 right-4 text-slate-500 hover:text-slate-300">
              <X size={20} />
            </button>
            <div className="flex items-center text-red-500 mb-4">
              <AlertCircle className="mr-2" size={24} />
              <h3 className="text-lg font-bold">Hapus Data Permanen?</h3>
            </div>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Tindakan ini tidak dapat dibatalkan. Menghapus item ini akan melenyapkan data terkait dari database cloud Supabase secara permanen.
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
              <AlertCircle className="mr-2" size={24} />
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
