import React from 'react';
import {
  LayoutGrid,
  PlusSquare,
  TrendingUp,
  SlidersHorizontal,
  Compass,
  AlertTriangle,
} from 'lucide-react';

export type TabType = 'dashboard' | 'resources' | 'forecast' | 'optimization' | 'simulator' | 'alerts';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  unreadAlertCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onChangeTab,
  unreadAlertCount,
}) => {
  const tabs = [
    {
      id: 'dashboard' as TabType,
      label: 'Dashboard',
      icon: LayoutGrid,
    },
    {
      id: 'resources' as TabType,
      label: 'Resources',
      icon: PlusSquare,
    },
    {
      id: 'forecast' as TabType,
      label: 'Forecast',
      icon: TrendingUp,
    },
    {
      id: 'optimization' as TabType,
      label: 'Optimization',
      icon: SlidersHorizontal,
    },
    {
      id: 'simulator' as TabType,
      label: 'Simulator',
      icon: Compass,
    },
    {
      id: 'alerts' as TabType,
      label: 'Alerts',
      icon: AlertTriangle,
      badge: unreadAlertCount,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg">
      <div className="max-w-md mx-auto px-2 py-1.5 sm:max-w-xl md:max-w-3xl flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-1.5 min-w-[50px] relative transition-all ${
                isActive
                  ? 'text-sky-700 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-sky-600' : 'text-slate-500'
                  }`}
                  strokeWidth={isActive ? 2.3 : 1.8}
                />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 px-1 min-w-[14px] h-[14px] rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span className={`text-[10px] tracking-tight mt-1 ${isActive ? 'text-sky-700 font-semibold' : 'text-slate-500'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-sky-600 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
