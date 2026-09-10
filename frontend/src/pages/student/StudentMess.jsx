import React, { useState, useEffect } from 'react';
import { 
  Utensils, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  Coffee,
  MessageSquarePlus
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { messApi } from '../../api/services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import WeeklyMessTable from '../../components/mess/WeeklyMessTable';
import MealFeedbackModal from '../../components/mess/MealFeedbackModal';
import Skeleton from '../../components/common/Skeleton';

export const StudentMess = () => {
  const { showToast } = useToast();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackDay, setFeedbackDay] = useState(null);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const data = await messApi.getWeeklyMenu();
      setMenus(data || []);
    } catch (err) {
      console.error('Failed to load mess menu', err);
      showToast('Could not load dining menu', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleFeedbackSubmit = async (feedbackData) => {
    try {
      await messApi.submitFeedback(feedbackData);
      showToast('Thank you! Your dining feedback has been recorded for the Mess Committee.', 'success');
      setFeedbackDay(null);
    } catch (err) {
      showToast('Failed to submit meal feedback', 'error');
      throw err;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-surface-charcoal">Hostel Mess & Dining</h1>
          <p className="text-surface-muted text-sm mt-1">
            Nutritious, hygienic vegetarian & non-vegetarian meal plans prepared fresh daily.
          </p>
        </div>

        <Button 
          onClick={() => setFeedbackDay('TODAY')}
          variant="secondary"
          size="sm"
          className="shadow-sm"
        >
          <MessageSquarePlus className="w-4 h-4 mr-1.5" /> Rate Today's Meal
        </Button>
      </div>

      {/* Mess Timings Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-amber-500">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Breakfast</span>
          <p className="text-sm font-bold text-surface-charcoal mt-1">7:30 AM – 9:00 AM</p>
          <span className="text-[10px] text-surface-muted mt-0.5 block">Hot beverage, eggs & carbs</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-500">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Lunch</span>
          <p className="text-sm font-bold text-surface-charcoal mt-1">12:30 PM – 2:30 PM</p>
          <span className="text-[10px] text-surface-muted mt-0.5 block">Full thali, curd & salad</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-rose-500">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Hi-Tea / Snacks</span>
          <p className="text-sm font-bold text-surface-charcoal mt-1">5:00 PM – 6:00 PM</p>
          <span className="text-[10px] text-surface-muted mt-0.5 block">Evening tea & savory snacks</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-purple-500">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">Dinner</span>
          <p className="text-sm font-bold text-surface-charcoal mt-1">8:00 PM – 9:30 PM</p>
          <span className="text-[10px] text-surface-muted mt-0.5 block">Warm entree, dessert & milk</span>
        </Card>
      </div>

      {/* Weekly Menu Interactive View */}
      {loading ? (
        <Skeleton className="h-96 w-full rounded-3xl" />
      ) : (
        <WeeklyMessTable 
          menus={menus}
          isWarden={false}
          onOpenFeedback={(day) => setFeedbackDay(day)}
        />
      )}

      {/* Feedback Modal */}
      <MealFeedbackModal 
        isOpen={!!feedbackDay}
        onClose={() => setFeedbackDay(null)}
        dayOfWeek={feedbackDay}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
};

export default StudentMess;
