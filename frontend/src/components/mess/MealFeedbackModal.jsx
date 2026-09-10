import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { Star } from 'lucide-react';

export const MealFeedbackModal = ({ isOpen, onClose, dayOfWeek, onSubmit }) => {
  const [mealType, setMealType] = useState('LUNCH');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const mealOptions = [
    { value: 'BREAKFAST', label: 'Breakfast' },
    { value: 'LUNCH', label: 'Lunch' },
    { value: 'SNACKS', label: 'Evening Snacks' },
    { value: 'DINNER', label: 'Dinner' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        dayOfWeek: dayOfWeek || 'MONDAY',
        mealType,
        rating,
        comment,
      });
      setComment('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Mess Meal Feedback — ${dayOfWeek}`}
      subtitle="Help the mess committee maintain high culinary hygiene and nutrition standards"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Meal Session"
          options={mealOptions}
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
        />

        {/* Rating Stars */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700 uppercase">
            Quality Rating
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 text-amber-400 hover:scale-125 transition-transform focus:outline-none"
              >
                <Star
                  className={`w-7 h-7 ${
                    star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
            <span className="text-xs font-bold text-gray-600 ml-2">
              {rating === 5 ? 'Excellent ✨' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : 'Needs Improvement'}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700 uppercase">
            Comments or Specific Dish Feedback
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Taste was great, need more salads, or food temperature remarks..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full rounded-xl border border-gray-200 p-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800 resize-none"
          />
        </div>

        <div className="flex justify-end gap-2.5 pt-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
            Submit Feedback
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default MealFeedbackModal;
