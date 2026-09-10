import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Edit3, 
  Pin, 
  Clock, 
  Sparkles, 
  Send, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { noticeApi } from '../../api/services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Skeleton from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';

export const NoticeCenter = () => {
  const { showToast } = useToast();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [content, setContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  const categories = [
    { value: 'GENERAL', label: 'General Announcement' },
    { value: 'CURFEW', label: 'Curfew & Gate Regulations' },
    { value: 'MESS', label: 'Mess & Dining Update' },
    { value: 'MAINTENANCE', label: 'Facility Maintenance Notice' },
    { value: 'EVENT', label: 'Hostel Cultural Event' },
    { value: 'EMERGENCY', label: 'High Priority / Emergency Notice' },
  ];

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const data = await noticeApi.getAll();
      setNotices(data || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load notices', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    setSubmitting(true);
    try {
      await noticeApi.create({
        title,
        category,
        content,
        isPinned
      });
      showToast('Notice published successfully to all resident portals!', 'success');
      setTitle('');
      setContent('');
      setIsPinned(false);
      setIsCreateModalOpen(false);
      fetchNotices();
    } catch (err) {
      showToast('Failed to publish notice', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNotice = async (id) => {
    if (!window.confirm('Are you sure you want to remove this notice?')) return;
    try {
      await noticeApi.delete(id);
      showToast('Notice deleted', 'success');
      fetchNotices();
    } catch (err) {
      showToast('Failed to delete notice', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-surface-charcoal">Notice & Broadcast Center</h1>
          <p className="text-surface-muted text-sm mt-1">
            Publish official hostel bulletins, emergency alerts, curfew updates, and cultural announcements.
          </p>
        </div>

        <Button onClick={() => setIsCreateModalOpen(true)} className="shadow-md">
          <Plus className="w-4 h-4 mr-2" /> Publish New Notice
        </Button>
      </div>

      {/* Notices List */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-36 w-full rounded-2xl" />
          <Skeleton className="h-36 w-full rounded-2xl" />
        </div>
      ) : notices.length === 0 ? (
        <EmptyState 
          icon={Bell}
          title="No notices published"
          description="Click Publish New Notice to post an announcement for hostel residents."
          action={
            <Button onClick={() => setIsCreateModalOpen(true)} size="sm">
              <Plus className="w-4 h-4 mr-1.5" /> Create Announcement
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <Card key={notice.id} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={
                        notice.category === 'EMERGENCY' ? 'danger' : 
                        notice.category === 'CURFEW' ? 'warning' : 'primary'
                      }
                    >
                      {notice.category}
                    </Badge>
                    {notice.isPinned && (
                      <span className="inline-flex items-center text-[11px] font-bold text-wine-800 bg-wine-100 px-2 py-0.5 rounded-full">
                        <Pin className="w-3 h-3 mr-1" /> Pinned
                      </span>
                    )}
                    <span className="text-xs text-surface-muted">
                      {new Date(notice.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-surface-charcoal">{notice.title}</h3>
                  <p className="text-xs text-surface-charcoal/80 whitespace-pre-line leading-relaxed">{notice.content}</p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    onClick={() => handleDeleteNotice(notice.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Publish Notice Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Broadcast Official Hostel Notice"
        subtitle="This announcement will be pushed to all student dashboards"
      >
        <form onSubmit={handleCreateNotice} className="space-y-4">
          <Input
            label="Notice Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Revised Curfew Hours for Cultural Festival"
            required
          />

          <Select
            label="Notice Category"
            options={categories}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-surface-charcoal">
              Detailed Bulletin Content
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the full announcement text..."
              required
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-surface-divider focus:outline-none focus:border-wine-600 focus:ring-1 focus:ring-wine-600"
            />
          </div>

          <label className="flex items-center space-x-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="w-4 h-4 text-wine-600 rounded border-gray-300 focus:ring-wine-500"
            />
            <span className="text-xs font-semibold text-surface-charcoal">
              📌 Pin notice to top of resident portals
            </span>
          </label>

          <div className="flex justify-end space-x-3 pt-4 border-t border-surface-divider">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              <Send className="w-4 h-4 mr-1.5" /> Broadcast Now
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NoticeCenter;
