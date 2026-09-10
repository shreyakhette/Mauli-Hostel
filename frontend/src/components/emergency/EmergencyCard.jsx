import React from 'react';
import { Card } from '../common/Card';
import { Phone, ShieldAlert, Building2, Flame, HeartPulse, Siren, Radio, Edit3 } from 'lucide-react';

export const EmergencyCard = ({ contact, isWarden = false, onEdit }) => {
  const getVisuals = (title) => {
    const key = (title || '').toUpperCase();
    if (key.includes('WARDEN')) {
      return {
        icon: Siren,
        bg: 'bg-wine-900 text-white',
        cardBorder: 'border-wine-200 shadow-card',
        btnBg: 'bg-wine-900 hover:bg-wine-800 text-white'
      };
    }
    if (key.includes('POLICE')) {
      return {
        icon: ShieldAlert,
        bg: 'bg-rose-900 text-white',
        cardBorder: 'border-rose-200 shadow-card',
        btnBg: 'bg-rose-900 hover:bg-rose-800 text-white'
      };
    }
    if (key.includes('HOSPITAL') || key.includes('AMBULANCE')) {
      return {
        icon: HeartPulse,
        bg: 'bg-emerald-700 text-white',
        cardBorder: 'border-emerald-200 shadow-soft',
        btnBg: 'bg-emerald-700 hover:bg-emerald-800 text-white'
      };
    }
    if (key.includes('FIRE')) {
      return {
        icon: Flame,
        bg: 'bg-amber-600 text-white',
        cardBorder: 'border-amber-200 shadow-soft',
        btnBg: 'bg-amber-600 hover:bg-amber-700 text-white'
      };
    }
    if (key.includes('SECURITY')) {
      return {
        icon: Radio,
        bg: 'bg-purple-800 text-white',
        cardBorder: 'border-purple-200 shadow-soft',
        btnBg: 'bg-purple-800 hover:bg-purple-700 text-white'
      };
    }
    return {
      icon: Building2,
      bg: 'bg-gray-800 text-white',
      cardBorder: 'border-gray-200 shadow-soft',
      btnBg: 'bg-gray-900 hover:bg-gray-800 text-white'
    };
  };

  const visuals = getVisuals(contact.title);
  const Icon = visuals.icon;

  return (
    <Card className={`p-6 flex flex-col justify-between ${visuals.cardBorder}`}>
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${visuals.bg}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-gray-900 tracking-tight uppercase">
                {contact.title}
              </h4>
              {contact.contactPerson && (
                <p className="text-xs font-semibold text-gray-600">{contact.contactPerson}</p>
              )}
            </div>
          </div>

          {isWarden && onEdit && (
            <button
              onClick={() => onEdit(contact)}
              className="p-1.5 text-gray-400 hover:text-wine-900 hover:bg-wine-50 rounded-lg transition"
              title="Edit Contact"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
        </div>

        {contact.description && (
          <p className="text-xs text-gray-500 mb-3">{contact.description}</p>
        )}

        {contact.location && (
          <p className="text-[11px] font-medium text-gray-400 mb-4">
            📍 {contact.location}
          </p>
        )}
      </div>

      <div className="pt-2">
        <a
          href={`tel:${contact.phoneNumber.replace(/[^0-9+]/g, '')}`}
          className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98 ${visuals.btnBg}`}
        >
          <Phone className="w-4 h-4" />
          <span>Call: {contact.phoneNumber}</span>
        </a>

        {contact.altPhone && (
          <div className="text-center mt-2">
            <a
              href={`tel:${contact.altPhone.replace(/[^0-9+]/g, '')}`}
              className="text-[11px] font-semibold text-gray-500 hover:text-wine-900 transition"
            >
              Alt: {contact.altPhone}
            </a>
          </div>
        )}
      </div>
    </Card>
  );
};

export default EmergencyCard;
