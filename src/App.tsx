/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { DashboardTab } from './components/tabs/DashboardTab';
import { ResourcesTab } from './components/tabs/ResourcesTab';
import { ForecastTab } from './components/tabs/ForecastTab';
import { OptimizationTab } from './components/tabs/OptimizationTab';
import { SimulatorTab } from './components/tabs/SimulatorTab';
import { AlertsTab } from './components/tabs/AlertsTab';
import { AllocationModal } from './components/modals/AllocationModal';
import { DayDetailModal } from './components/modals/DayDetailModal';
import { NotificationDrawer } from './components/modals/NotificationDrawer';
import { UserProfileModal } from './components/modals/UserProfileModal';
import {
  initialFacility,
  alternateFacilities,
  initial7DayForecast,
  initialProtocolInterventions,
  initialIcuBeds,
  operatingTheatersList,
  staffRoster,
  initialAlerts,
} from './data/mockData';
import { DayForecast, HospitalFacility, BedItem, ProtocolIntervention } from './types/hospital';
import { Smartphone, Monitor } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [currentFacility, setCurrentFacility] = useState<HospitalFacility>(initialFacility);
  const [isSimulated, setIsSimulated] = useState<boolean>(true);
  const [forecast, setForecast] = useState<DayForecast[]>(initial7DayForecast);
  const [interventions, setInterventions] = useState<ProtocolIntervention[]>(initialProtocolInterventions);
  const [icuBeds, setIcuBeds] = useState<BedItem[]>(initialIcuBeds);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [isAllocationExecuted, setIsAllocationExecuted] = useState(false);

  // Modals
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);
  const [selectedDayDetail, setSelectedDayDetail] = useState<DayForecast | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Layout View mode: allows viewing in Mobile Phone frame or Responsive Desktop
  const [viewLayout, setViewLayout] = useState<'mobile' | 'responsive'>('mobile');

  // Live clock simulation
  const [currentTime, setCurrentTime] = useState('10:42 AM');
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 is 12
      // Default initial matches screenshot (10:42 AM), but can advance
    };
    const timer = setInterval(updateClock, 60000);
    return () => clearInterval(timer);
  }, []);

  // Toggle protocol checkbox
  const handleToggleIntervention = (id: string) => {
    setInterventions(prev =>
      prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  // Execute Allocation Order
  const handleExecuteAllocation = () => {
    setIsAllocationExecuted(true);
    // Mark the 4 step-down beds as successfully transferred to Ward C
    setIcuBeds(prev =>
      prev.map((b, idx) => (idx < 4 ? { ...b, status: 'available' as const, patientId: undefined } : b))
    );
    // Update facility metrics
    setCurrentFacility(prev => ({
      ...prev,
      icuOccupied: Math.max(28, prev.icuOccupied - 4),
    }));
    // Add confirmation alert
    setAlerts(prev => [
      {
        id: `alt-exec-${Date.now()}`,
        timestamp: 'Just now',
        severity: 'info',
        title: 'Step-Down Transfer Dispatch Confirmed',
        message: '4 stabilized telemetry patients transferred from ICU to Ward C. 4 ICU acute bays sanitized and recovered.',
        location: 'ICU & Ward C',
        acknowledged: false,
      },
      ...prev,
    ]);
  };

  // Acknowledge alert
  const handleAcknowledgeAlert = (id: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const handleAcknowledgeAll = () => {
    setAlerts(prev => prev.map(a => ({ ...a, acknowledged: true })));
  };

  const unreadAlertCount = alerts.filter(a => !a.acknowledged).length;
  const stepDownBeds = icuBeds.filter(b => b.status === 'step-down-ready');

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans">
      {/* Top Device View Switcher Banner for testing */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 flex items-center justify-between z-40 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-medium text-slate-200">Clinical Command System</span>
          <span className="hidden sm:inline text-slate-400">| Metro Health System v4.2</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 hidden xs:inline">View Preset:</span>
          <div className="flex bg-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setViewLayout('mobile')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                viewLayout === 'mobile'
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile Device Preview (Exact match to screenshot)"
            >
              <Smartphone className="w-3 h-3" />
              <span>Mobile View</span>
            </button>
            <button
              onClick={() => setViewLayout('responsive')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                viewLayout === 'responsive'
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Wide Desktop View"
            >
              <Monitor className="w-3 h-3" />
              <span>Full Screen</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex justify-center w-full">
        <div
          className={`w-full transition-all duration-300 ${
            viewLayout === 'mobile'
              ? 'max-w-md bg-white shadow-2xl min-h-screen border-x border-slate-200/80 relative'
              : 'max-w-5xl px-3 sm:px-6 relative'
          }`}
        >
          {/* Header */}
          <Header
            currentFacility={currentFacility}
            facilities={alternateFacilities}
            onSelectFacility={(fac) => setCurrentFacility(fac)}
            isSimulated={isSimulated}
            onToggleSimulated={() => setIsSimulated(!isSimulated)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
            unreadAlertCount={unreadAlertCount}
          />

          {/* Active Screen Tab Content */}
          <main className="p-3 sm:p-4">
            {currentTab === 'dashboard' && (
              <DashboardTab
                facility={currentFacility}
                forecast={forecast}
                interventions={interventions}
                onToggleIntervention={handleToggleIntervention}
                onSelectDayForecast={(day) => setSelectedDayDetail(day)}
                onOpenAllocationModal={() => setIsAllocationModalOpen(true)}
                onNavigateToSimulator={() => setCurrentTab('simulator')}
              />
            )}

            {currentTab === 'resources' && (
              <ResourcesTab
                facility={currentFacility}
                icuBeds={icuBeds}
                operatingTheaters={operatingTheatersList}
                staff={staffRoster}
                onSelectBed={(bed) => {}}
              />
            )}

            {currentTab === 'forecast' && (
              <ForecastTab
                forecast={forecast}
                onSelectDay={(day) => setSelectedDayDetail(day)}
              />
            )}

            {currentTab === 'optimization' && (
              <OptimizationTab
                interventions={interventions}
                onToggleIntervention={handleToggleIntervention}
                stepDownBeds={stepDownBeds}
                onExecuteAll={handleExecuteAllocation}
                isExecuted={isAllocationExecuted}
              />
            )}

            {currentTab === 'simulator' && (
              <SimulatorTab
                facility={currentFacility}
                onApplyMitigations={() => {
                  setInterventions(prev => prev.map(i => ({ ...i, checked: true })));
                  setCurrentTab('dashboard');
                }}
              />
            )}

            {currentTab === 'alerts' && (
              <AlertsTab
                alerts={alerts}
                onAcknowledgeAlert={handleAcknowledgeAlert}
                onAcknowledgeAll={handleAcknowledgeAll}
                onNavigateToOptimization={() => setCurrentTab('optimization')}
              />
            )}
          </main>

          {/* Bottom Navigation */}
          <BottomNav
            currentTab={currentTab}
            onChangeTab={(t) => setCurrentTab(t)}
            unreadAlertCount={unreadAlertCount}
          />
        </div>
      </div>

      {/* Modals & Slide-outs */}
      <AllocationModal
        isOpen={isAllocationModalOpen}
        onClose={() => setIsAllocationModalOpen(false)}
        stepDownBeds={stepDownBeds}
        interventions={interventions}
        onExecuteAllocation={handleExecuteAllocation}
        isExecuted={isAllocationExecuted}
      />

      <DayDetailModal
        day={selectedDayDetail}
        onClose={() => setSelectedDayDetail(null)}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        alerts={alerts}
        onAcknowledgeAlert={handleAcknowledgeAlert}
        onAcknowledgeAll={handleAcknowledgeAll}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        isSimulated={isSimulated}
        onToggleSimulated={() => setIsSimulated(!isSimulated)}
      />
    </div>
  );
}
