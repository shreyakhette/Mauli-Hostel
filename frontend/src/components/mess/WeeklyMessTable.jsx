import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Utensils, MessageSquarePlus, Edit3, Sparkles } from 'lucide-react';

export const WeeklyMessTable = ({
  menus = [],
  isWarden = false,
  onEditMenu,
  onOpenFeedback,
}) => {
  const [selectedDay, setSelectedDay] = useState(() => {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    return days[new Date().getDay()];
  });

  const activeMenu = menus.find((m) => m.dayOfWeek?.toUpperCase() === selectedDay) || menus[0];

  return (
    <div className="space-y-6">
      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {menus.map((menu) => {
          const isSelected = menu.dayOfWeek?.toUpperCase() === selectedDay;
          return (
            <button
              key={menu.dayOfWeek}
              onClick={() => setSelectedDay(menu.dayOfWeek.toUpperCase())}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all duration-150 ${
                isSelected
                  ? 'bg-wine-900 text-white shadow-soft scale-105'
                  : 'bg-white border border-gray-200/80 text-gray-600 hover:text-wine-900 hover:bg-wine-50'
              }`}
            >
              {menu.dayOfWeek}
            </button>
          );
        })}
      </div>

      {activeMenu && (
        <Card className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Daily Nutrition Schedule
              </span>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight mt-0.5">
                {activeMenu.dayOfWeek} MENU
              </h3>
            </div>

            <div className="flex items-center gap-2.5">
              {!isWarden && (
                <Button
                  variant="secondary"
                  size="sm"
                  icon={MessageSquarePlus}
                  onClick={() => onOpenFeedback && onOpenFeedback(activeMenu.dayOfWeek)}
                >
                  Give Meal Feedback
                </Button>
              )}

              {isWarden && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={Edit3}
                  onClick={() => onEditMenu && onEditMenu(activeMenu)}
                >
                  Edit Menu
                </Button>
              )}
            </div>
          </div>

          {/* 4 Meal Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Breakfast */}
            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100/80 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                  Breakfast (7:30 - 9:30 AM)
                </span>
                <p className="text-sm font-bold text-gray-900 mt-2 leading-relaxed">
                  {activeMenu.breakfast}
                </p>
              </div>
            </div>

            {/* Lunch */}
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100/80 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  Lunch (12:30 - 2:30 PM)
                </span>
                <p className="text-sm font-bold text-gray-900 mt-2 leading-relaxed">
                  {activeMenu.lunch}
                </p>
              </div>
            </div>

            {/* Snacks */}
            <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100/80 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-800">
                  Evening Snacks (5:00 - 6:00 PM)
                </span>
                <p className="text-sm font-bold text-gray-900 mt-2 leading-relaxed">
                  {activeMenu.snacks}
                </p>
              </div>
            </div>

            {/* Dinner */}
            <div className="p-5 rounded-2xl bg-wine-50/50 border border-wine-100/80 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-wine-900">
                  Dinner (8:00 - 9:45 PM)
                </span>
                <p className="text-sm font-bold text-gray-900 mt-2 leading-relaxed">
                  {activeMenu.dinner}
                </p>
              </div>
            </div>
          </div>

          {activeMenu.specialNotes && (
            <div className="mt-6 p-4 rounded-xl bg-surface-50 border border-gray-100 text-xs text-gray-600 flex items-center gap-2">
              <span className="font-bold text-gray-900">Special Diet / Chef Note:</span>
              <span>{activeMenu.specialNotes}</span>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default WeeklyMessTable;
