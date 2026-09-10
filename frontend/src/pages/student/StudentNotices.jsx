import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Pin, 
  Calendar, 
  Tag, 
  ShieldAlert, 
  Clock,
  Sparkles
} from 'lucide-react';
import { noticeApi } from '../../api/services';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Skeleton from '../../components/common/Skeleton';

export const StudentNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        const data = await noticeApi.getActive();
        setNotices(data || []);
      } catch (err) {
        console.error('Failed to load notices', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const categories = ['ALL', 'GENERAL', 'MESS', 'CURFEW', 'EVENT', 'EMERGENCY', 'MAINTENANCE'];

  const filteredNotices = notices.filter((n) => {
    const matchesCat = activeCategory === 'ALL' || n.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Sort pinned first
  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (a.isPinned === b.isPinned) return new Date(b.createdAt) - new Date(a.createdAt);
    return a.isPinned ? -1 : 1;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-surface-charcoal">Hostel Notice Board</h1>
        <p className="text-surface-muted text-sm mt-1">
          Official bulletins, curfew updates, event notices, and meal schedule announcements from Warden Kranti Bhoyar.
        </p>
      </div>

      {/* Filter and Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-surface-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search notices by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-surface-divider focus:outline-none focus:border-wine-600 focus:ring-1 focus:ring-wine-600"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === cat 
                    ? 'bg-wine-900 text-white shadow-sm' 
                    : 'bg-surface text-surface-muted hover:text-surface-charcoal hover:bg-wine-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Notices Grid */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      ) : sortedNotices.length === 0 ? (
        <EmptyState 
          icon={Bell}
          title="No notices found"
          description="There are currently no active announcements matching your selection."
        />
      ) : (
        <div className="space-y-4">
          {sortedNotices.map((notice) => (
            <Card 
              key={notice.id} 
              className={`p-6 transition-all ${
                notice.isPinned 
                  ? 'border-2 border-wine-200 bg-gradient-to-r from-wine-50/40 via-white to-white' 
                  : 'hover:border-wine-100'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge 
                      variant={
                        notice.category === 'EMERGENCY' ? 'danger' : 
                        notice.category === 'CURFEW' ? 'warning' : 'primary'
                      }
                    >
                      {notice.category}
                    </Badge>
                    {notice.isPinned && (
                      <span className="inline-flex items-center text-[11px] font-bold text-wine-800 bg-wine-100 px-2.5 py-0.5 rounded-full">
                        <Pin className="w-3 h-3 mr-1 transform -rotate-45" /> Pinned Bulletin
                      </span>
                    )}
                    <span className="text-xs text-surface-muted flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(notice.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-surface-charcoal pt-1">{notice.title}</h3>
                  <p className="text-xs text-surface-charcoal/80 leading-relaxed whitespace-pre-line">{notice.content}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-medium text-surface-muted block">Published By</span>
                  <span className="text-xs font-bold text-wine-900 block mt-0.5">Warden Kranti Bhoyar</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentNotices;
