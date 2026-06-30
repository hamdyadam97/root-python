import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Plus, ChevronRight, Home } from 'lucide-react';
import { toast } from 'sonner';
import { entityConfig, adminMenu } from '@/config/adminEntities';
import { generateMockRows } from '@/components/admin/mockData';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import { FiltersBar } from '@/components/admin/FiltersBar';
import { BulkActions } from '@/components/admin/BulkActions';
import { DataTable } from '@/components/admin/DataTable';
import { Pagination } from '@/components/admin/Pagination';
import { EntityModal } from '@/components/admin/EntityModal';
import { ConfirmationDialog } from '@/components/admin/ConfirmationDialog';

export function EntityManager() {
  const { entity } = useParams<{ entity: string }>();
  const { t } = useTranslation();
  const config = entity ? entityConfig[entity] : undefined;

  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [confirm, setConfirm] = useState<{ open: boolean; title: string; message: string; onConfirm: () => void } | null>(null);

  useEffect(() => {
    if (!config) return;
    setLoading(true);
    setSelected([]);
    setPage(1);
    const timer = setTimeout(() => {
      setRows(generateMockRows(config.id, 55));
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [config, entity]);

  const filteredRows = useMemo(() => {
    let data = rows.filter((r) => {
      const matchesSearch = JSON.stringify(r).toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || r.status?.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
    data = [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === 'number') return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      return sortDir === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
    });
    return data;
  }, [rows, search, statusFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filteredRows.length / pageSize);
  const paginatedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  const stats = useMemo(() => {
    if (!config) return [];
    return config.stats.map((s) => ({
      ...s,
      value: Math.floor(Math.random() * 5000) + 100,
    }));
  }, [config, rows]);

  if (!config) {
    return (
      <div className="flex h-96 flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Module not found</h2>
        <Link to="/admin" className="mt-4 text-primary hover:underline">Back to Dashboard</Link>
      </div>
    );
  }

  const toggleSelect = (id: number) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    const allSelected = paginatedRows.every((r) => selected.includes(r.id));
    setSelected((prev) => {
      const others = prev.filter((id) => !paginatedRows.some((r) => r.id === id));
      return allSelected ? others : [...others, ...paginatedRows.map((r) => r.id)];
    });
  };

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const handleDelete = (row: any) => {
    setConfirm({
      open: true,
      title: t('admin.actions.delete'),
      message: t('admin.actions.confirmDelete'),
      onConfirm: () => {
        setRows((prev) => prev.filter((r) => r.id !== row.id));
        toast.success('Deleted successfully');
        setConfirm(null);
      },
    });
  };

  const handleBulkDelete = () => {
    setConfirm({
      open: true,
      title: t('admin.actions.delete'),
      message: t('admin.actions.confirmDelete'),
      onConfirm: () => {
        setRows((prev) => prev.filter((r) => !selected.includes(r.id)));
        setSelected([]);
        toast.success('Deleted successfully');
        setConfirm(null);
      },
    });
  };

  const handleArchive = (row: any) => {
    setRows((prev) => prev.map((r) => r.id === row.id ? { ...r, status: 'archived' } : r));
    toast.success('Archived');
  };

  const handleBulkArchive = () => {
    setRows((prev) => prev.map((r) => selected.includes(r.id) ? { ...r, status: 'archived' } : r));
    setSelected([]);
    toast.success('Archived');
  };

  const handleBulkRestore = () => {
    setRows((prev) => prev.map((r) => selected.includes(r.id) ? { ...r, status: 'active' } : r));
    setSelected([]);
    toast.success('Restored');
  };

  const handleDuplicate = (row: any) => {
    setRows((prev) => [{ ...row, id: Date.now(), name: row.name + ' (Copy)' }, ...prev]);
    toast.success('Duplicated');
  };

  const handleSave = (form: any) => {
    if (editingRow) {
      setRows((prev) => prev.map((r) => r.id === editingRow.id ? { ...r, ...form } : r));
      toast.success('Updated successfully');
    } else {
      setRows((prev) => [{ id: Date.now(), ...form, created_at: new Date().toISOString().split('T')[0] }, ...prev]);
      toast.success('Created successfully');
    }
    setModalOpen(false);
    setEditingRow(null);
  };

  const parentItem = config.parent ? adminMenu.find((m) => m.id === config.parent) : null;
  const currentMenu = adminMenu.find((m) => m.to === `/admin/${entity}`);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <nav className="mb-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Link to="/admin" className="flex items-center gap-1 hover:text-primary"><Home size={14} /> {t('admin.modules.dashboard')}</Link>
            {parentItem && <><ChevronRight size={14} /> <span>{t(parentItem.labelKey)}</span></>}
            <ChevronRight size={14} />
            <span className="font-bold text-slate-800 dark:text-white">{currentMenu ? t(currentMenu.labelKey) : config.pluralKey}</span>
          </nav>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">{t(config.pluralKey)}</h1>
        </div>
        <button
          type="button"
          onClick={() => { setEditingRow(null); setModalOpen(true); }}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-primary/90"
        >
          <Plus size={18} /> {t('admin.actions.create')}
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <AdminStatCard key={s.key} icon={s.icon} label={t(s.labelKey)} value={s.value} color={s.color} delay={i * 0.05} />
        ))}
      </div>

      <FiltersBar search={search} onSearch={setSearch} status={statusFilter} onStatus={setStatusFilter} />

      <BulkActions
        count={selected.length}
        onArchive={handleBulkArchive}
        onRestore={handleBulkRestore}
        onDelete={handleBulkDelete}
        onClear={() => setSelected([])}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <DataTable
          columns={config.columns}
          rows={paginatedRows}
          loading={loading}
          selected={selected}
          onSelect={toggleSelect}
          onSelectAll={toggleSelectAll}
          onEdit={(row) => { setEditingRow(row); setModalOpen(true); }}
          onDelete={handleDelete}
          onArchive={handleArchive}
          onDuplicate={handleDuplicate}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
        />
      </motion.div>

      <Pagination
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
      />

      <EntityModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingRow(null); }}
        config={config}
        initialData={editingRow}
        onSave={handleSave}
      />

      {confirm && (
        <ConfirmationDialog
          open={confirm.open}
          title={confirm.title}
          message={confirm.message}
          onCancel={() => setConfirm(null)}
          onConfirm={confirm.onConfirm}
        />
      )}
    </div>
  );
}
