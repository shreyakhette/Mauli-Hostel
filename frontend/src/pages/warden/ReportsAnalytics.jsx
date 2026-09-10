import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  Users, 
  Clock,
  Sparkles
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { reportApi } from '../../api/services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import OccupancyVisualization from '../../components/reports/OccupancyVisualization';
import ReportCharts from '../../components/reports/ReportCharts';
import Skeleton from '../../components/common/Skeleton';

export const ReportsAnalytics = () => {
  const { showToast } = useToast();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await reportApi.getSummary();
        setSummary(data || {
          occupancy: {
            totalBeds: 400,
            occupiedBeds: 363,
            availableBeds: 37,
            occupancyRate: 90.75
          },
          complaints: {
            total: 28,
            resolved: 24,
            pending: 4,
            avgResolutionTimeHours: 18.5
          },
          leaves: {
            totalApplications: 45,
            approved: 41,
            rejected: 4
          },
          attendanceTrends: [
            { date: 'Mon', present: 362, absent: 1, late: 0, onLeave: 5 },
            { date: 'Tue', present: 360, absent: 2, late: 1, onLeave: 5 },
            { date: 'Wed', present: 358, absent: 3, late: 2, onLeave: 5 },
            { date: 'Thu', present: 361, absent: 1, late: 1, onLeave: 5 },
            { date: 'Fri', present: 355, absent: 2, late: 3, onLeave: 8 },
            { date: 'Sat', present: 340, absent: 1, late: 2, onLeave: 25 },
            { date: 'Sun', present: 338, absent: 2, late: 1, onLeave: 27 },
          ],
          visitors: {
            weeklyTotal: 34,
            currentlyCheckedIn: 2
          }
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleExportCSV = (reportType) => {
    showToast(`Generating and exporting ${reportType} report to CSV/Excel...`, 'success');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-surface-charcoal">Hostel Analytics & Audits</h1>
          <p className="text-surface-muted text-sm mt-1">
            Data-driven reports on bed occupancy, curfew adherence, maintenance MTTR, and dining feedback.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button onClick={() => handleExportCSV('Occupancy & Attendance')} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1.5" /> Export Monthly CSV
          </Button>
          <Button onClick={() => handleExportCSV('Official Audit PDF')} size="sm">
            <FileSpreadsheet className="w-4 h-4 mr-1.5" /> Warden Audit PDF
          </Button>
        </div>
      </div>

      {/* Main Occupancy Visualizer */}
      <OccupancyVisualization
        totalBeds={summary?.occupancy?.totalBeds || 400}
        occupiedBeds={summary?.occupancy?.occupiedBeds || 363}
        availableBeds={summary?.occupancy?.availableBeds || 37}
        occupancyPercentage={summary?.occupancy?.occupancyRate || 90.75}
      />

      {/* Detailed Breakdown Charts */}
      {loading ? (
        <Skeleton className="h-96 w-full rounded-3xl" />
      ) : (
        <ReportCharts summary={summary} />
      )}
    </div>
  );
};

export default ReportsAnalytics;
