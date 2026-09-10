import React, { useState, useEffect } from 'react';
import { 
  Utensils, 
  Edit3, 
  Star, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Coffee,
  Save
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { messApi } from '../../api/services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import WeeklyMessTable from '../../components/mess/WeeklyMessTable';
import Skeleton from '../../components/common/Skeleton';

export const MessManager = () => {
  const { showToast } = useToast();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMenu, setEditingMenu] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states for menu edit
  const [breakfast, setBreakfast] = useState('');
  const [lunch, setLunch] = useState('');
  const [snacks, setSnacks] = useState('');
  const [dinner, setDinner] = useState('');
  const [isSpecial, setIsSpecial] = useState(false);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const data = await messApi.getWeeklyMenu();
      setMenus(data || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load mess menus', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleOpenEdit = (menu) => {
    setEditingMenu(menu);
    setBreakfast(menu.breakfastMenu || '');
    setLunch(menu.lunchMenu || '');
    setSnacks(menu.snacksMenu || '');
    setDinner(menu.dinnerMenu || '');
    setIsSpecial(menu.isSpecialMeal || false);
  };

  const handleSaveMenu = async (e) => {
    e.preventDefault();
    if (!editingMenu) return;

    setSubmitting(true);
    try {
      await messApi.updateMenu(editingMenu.dayOfWeek, {
        dayOfWeek: editingMenu.dayOfWeek,
        breakfastMenu: breakfast,
        lunchMenu: lunch,
        snacksMenu: snacks,
        dinnerMenu: dinner,
        isSpecialMeal: isSpecial,
        isVegOnly: true
      });
      showToast(`Menu for ${editingMenu.dayOfWeek} updated!`, 'success');
      setEditingMenu(null);
      fetchMenu();
    } catch (err) {
      showToast('Failed to update menu', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-surface-charcoal">Hostel Kitchen & Mess Operations</h1>
          <p className="text-surface-muted text-sm mt-1">
            Configure weekly recipes, dietary nutrition charts, and monitor resident meal satisfaction reviews.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Kitchen FSSAI Certified
          </span>
        </div>
      </div>

      {/* Weekly Menu Display & Quick Edit */}
      {loading ? (
        <Skeleton className="h-96 w-full rounded-3xl" />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {menus.map((m) => (
              <Card 
                key={m.id || m.dayOfWeek} 
                className="p-4 flex flex-col justify-between hover:border-wine-300 transition-colors cursor-pointer"
                onClick={() => handleOpenEdit(m)}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-wine-900">{m.dayOfWeek}</span>
                    <Edit3 className="w-3.5 h-3.5 text-surface-muted hover:text-wine-700" />
                  </div>
                  <p className="text-[11px] text-surface-charcoal line-clamp-2 font-medium">
                    {m.lunchMenu || 'Paneer Butter Masala'}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-surface-divider flex items-center justify-between text-[10px] text-surface-muted">
                  <span>Rating:</span>
                  <span className="font-bold text-amber-600 flex items-center">
                    ★ 4.8
                  </span>
                </div>
              </Card>
            ))}
          </div>

          <WeeklyMessTable 
            menus={menus}
            isWarden={true}
            onEditMenu={(menu) => handleOpenEdit(menu)}
          />
        </div>
      )}

      {/* Edit Menu Modal */}
      <Modal
        isOpen={!!editingMenu}
        onClose={() => setEditingMenu(null)}
        title={`Update Dining Menu — ${editingMenu?.dayOfWeek}`}
        subtitle="Changes are reflected instantly across student portals"
      >
        <form onSubmit={handleSaveMenu} className="space-y-4">
          <Input
            label="Breakfast (7:30 AM – 9:00 AM)"
            value={breakfast}
            onChange={(e) => setBreakfast(e.target.value)}
            placeholder="e.g. Masala Dosa, Sambar, Chutney, Tea / Coffee"
            required
          />

          <Input
            label="Lunch (12:30 PM – 2:30 PM)"
            value={lunch}
            onChange={(e) => setLunch(e.target.value)}
            placeholder="e.g. Shahi Paneer, Dal Makhani, Jeera Rice, Chapati, Curd"
            required
          />

          <Input
            label="Evening Hi-Tea (5:00 PM – 6:00 PM)"
            value={snacks}
            onChange={(e) => setSnacks(e.target.value)}
            placeholder="e.g. Veg Samosa, Green Chutney, Ginger Tea"
            required
          />

          <Input
            label="Dinner (8:00 PM – 9:30 PM)"
            value={dinner}
            onChange={(e) => setDinner(e.target.value)}
            placeholder="e.g. Mix Veg Kofta, Dal Fry, Roti, Rice, Gulab Jamun"
            required
          />

          <label className="flex items-center space-x-2 pt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isSpecial}
              onChange={(e) => setIsSpecial(e.target.checked)}
              className="w-4 h-4 text-wine-600 rounded border-gray-300 focus:ring-wine-500"
            />
            <span className="text-xs font-semibold text-surface-charcoal">
              🎉 Mark as Special Weekend / Festival Feast
            </span>
          </label>

          <div className="flex justify-end space-x-3 pt-4 border-t border-surface-divider">
            <Button variant="outline" onClick={() => setEditingMenu(null)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              <Save className="w-4 h-4 mr-1.5" /> Save Menu
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MessManager;
