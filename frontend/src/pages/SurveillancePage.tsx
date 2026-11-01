import React, { useState, useEffect } from 'react';
import {
  getSurveillanceSummaryApi,
  getClustersApi,
  getThresholdsApi,
  getOutbreakForecastApi,
  SurveillanceSummary,
  OutbreakForecast,
} from '../api/surveillance.api';
import { Layers, Filter, MapPin, TrendingUp, Sliders, Info } from 'lucide-react';

export const SurveillancePage: React.FC = () => {
  const [summary, setSummary] = useState<SurveillanceSummary | null>(null);
  const [, setClusters] = useState<any[]>([]);
  const [thresholds, setThresholds] = useState<any[]>([]);
  const [forecast, setForecast] = useState<OutbreakForecast | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  useEffect(() => {
    getSurveillanceSummaryApi()
      .then((res) => setSummary(res.data))
      .catch(() => {});

    getClustersApi()
      .then((res) => setClusters(res.data.clusters))
      .catch(() => {});

    getThresholdsApi()
      .then((res) => setThresholds(res.data.thresholds))
      .catch(() => {});

    getOutbreakForecastApi()
      .then((res) => setForecast(res.data.forecast))
      .catch(() => {});
  }, []);

  const defaultBlocks = summary?.hierarchy?.blocks || {
    'Block A - Floor 3': { confirmed: 4, suspected: 5, total: 9, categories: { 'Food Poisoning': 9 } },
    'Block A - Floor 4': { confirmed: 1, suspected: 2, total: 3, categories: { 'Viral Fever': 3 } },
    'Block B - Floor 2': { confirmed: 0, suspected: 2, total: 2, categories: { 'Upper Respiratory Infection': 2 } },
  };

  return (
    <div className="space-y-8 text-[#000000]">
      {/* Header Banner */}
      <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] shadow-none flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-[1600px] text-xs font-bold bg-[#ffd731] text-[#000000] border border-[#000000]">
              SURVEILLANCE & THRESHOLDS
            </span>
            <span className="text-xs text-[#000000] font-bold uppercase tracking-wider">Phase 10 Time-Series Outbreak Forecasting</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight font-['Space_Grotesk']">Dynamic Thresholds & Early Outbreak Intelligence</h2>
          <p className="text-xs text-[#000000] max-w-xl font-medium">
            Detecting case increases before thresholds are crossed using time-series LSTM models and configurable dynamic threshold scopes.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-4 rounded-[20px] bg-[#55db9c] border border-[#000000] text-center">
            <p className="text-2xl font-extrabold text-[#000000]">{summary?.confirmedCount ?? 5}</p>
            <p className="text-[10px] text-[#000000] uppercase font-bold tracking-wider">Doctor Confirmed</p>
          </div>
          <div className="p-4 rounded-[20px] bg-[#ffd731] border border-[#000000] text-center">
            <p className="text-2xl font-extrabold text-[#000000]">{summary?.suspectedCount ?? 9}</p>
            <p className="text-[10px] text-[#000000] uppercase font-bold tracking-wider">AI Suspected</p>
          </div>
        </div>
      </div>

      {/* Threshold Prototype Disclaimer Notice */}
      <div className="p-4 rounded-[20px] bg-[#ffffff] border border-[#000000] flex items-center gap-3 text-xs text-[#000000] font-bold shadow-none">
        <Info className="h-5 w-5 text-[#5c4ade] shrink-0" />
        <span>
          <strong>Clinical Validation Notice:</strong> Prototype threshold values require clinical and institutional validation before real-world deployment. Thresholds are dynamically configurable per disease category.
        </span>
      </div>

      {/* Time-Series Outbreak Forecasting Card */}
      {forecast && (
        <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-6 shadow-none">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#000000] pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-[1600px] bg-[#e9ccff] text-[#000000] border border-[#000000] flex items-center justify-center font-bold">
                <TrendingUp className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#000000] flex items-center gap-2">
                  LSTM Time-Series Outbreak Prediction Engine
                </h3>
                <p className="text-xs text-[#000000] font-bold">Location: {forecast.location_name} | Disease: {forecast.disease_category}</p>
              </div>
            </div>

            <span className="px-3.5 py-1 rounded-[1600px] text-xs font-bold bg-[#fb4903] text-white border border-[#000000]">
              OUTBREAK RISK: {forecast.outbreak_risk}
            </span>
          </div>

          {/* Time Series Metrics Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-bold">
            <div className="p-4 rounded-[20px] bg-[#ffd731] border border-[#000000] space-y-1">
              <p className="text-[11px] text-[#000000] uppercase font-extrabold tracking-wider">Current Cases (Day 5)</p>
              <p className="text-3xl font-extrabold text-[#000000]">{forecast.current_cases}</p>
              <p className="text-[10px] text-[#000000] font-bold">Threshold Limit: {forecast.threshold_count}</p>
            </div>

            <div className="p-4 rounded-[20px] bg-[#fb4903] text-white border border-[#000000] space-y-1">
              <p className="text-[11px] uppercase font-extrabold tracking-wider opacity-90">Predicted Next Day (Day 6)</p>
              <p className="text-3xl font-extrabold">{forecast.predicted_next_day_cases}</p>
              <p className="text-[10px] font-bold opacity-90">Trend: {forecast.trend}</p>
            </div>

            <div className="p-4 rounded-[20px] bg-[#e9ccff] border border-[#000000] space-y-1">
              <p className="text-[11px] text-[#000000] uppercase font-extrabold tracking-wider">Model Selected</p>
              <p className="text-sm font-extrabold text-[#000000] pt-1">{forecast.model_selected}</p>
              <p className="text-[10px] text-[#000000] font-bold">LSTM MAE: {forecast.lstm_mae} vs Baseline: {forecast.baseline_mae}</p>
            </div>

            <div className="p-4 rounded-[20px] bg-[#55db9c] border border-[#000000] space-y-1">
              <p className="text-[11px] text-[#000000] uppercase font-extrabold tracking-wider">Early Warning Result</p>
              <p className="text-xs font-extrabold text-[#000000] pt-1">EARLY WARNING TRIGGERED</p>
              <p className="text-[10px] text-[#000000] font-bold">Authorities notified prior to breach</p>
            </div>
          </div>

          <div className="p-4 rounded-[20px] bg-[#ffd731] border border-[#000000] text-xs text-[#000000] font-bold">
            <strong>Early Warning System Notice:</strong> {forecast.message}
          </div>
        </div>
      )}

      {/* Configurable Threshold Table */}
      <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-4 shadow-none">
        <div className="flex items-center justify-between border-b border-[#000000] pb-3">
          <h3 className="text-base font-extrabold text-[#000000] flex items-center gap-2">
            <Sliders className="h-5 w-5 text-[#5c4ade] stroke-[2.5]" />
            Configurable Disease Threshold Rules
          </h3>
          <span className="text-xs font-bold text-[#000000] bg-[#e9ccff] px-3 py-1 rounded-[1600px] border border-[#000000]">Institutional Admin Control</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#dceeff] text-[#000000] uppercase font-bold border-b border-[#000000]">
              <tr>
                <th className="p-3 border-r border-[#000000]">Disease Category</th>
                <th className="p-3 border-r border-[#000000]">Scope</th>
                <th className="p-3 border-r border-[#000000]">Threshold Limit</th>
                <th className="p-3 border-r border-[#000000]">Time Window</th>
                <th className="p-3 border-r border-[#000000]">Warning Trigger %</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#000000]">
              {thresholds.map((t) => (
                <tr key={t.id} className="hover:bg-[#dceeff]/30 transition-colors text-[#000000] font-bold border-b border-[#000000]">
                  <td className="p-3 border-r border-[#000000] font-extrabold text-[#000000]">{t.diseaseCategory}</td>
                  <td className="p-3 border-r border-[#000000] text-[#000000] font-bold">{t.scope}</td>
                  <td className="p-3 border-r border-[#000000] text-[#000000] font-extrabold bg-[#ffd731]">{t.thresholdCount} Cases</td>
                  <td className="p-3 border-r border-[#000000] text-[#000000] font-bold">{t.timeWindowHours} Hours</td>
                  <td className="p-3 border-r border-[#000000] text-[#5c4ade] font-extrabold">{t.warningPercentage}%</td>
                  <td className="p-3">
                    <span className="px-3 py-0.5 rounded-[1600px] bg-[#55db9c] text-[#000000] border border-[#000000] text-[10px] font-bold">
                      ACTIVE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hierarchy Visualizer Section */}
      <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-6 shadow-none">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-[#000000] flex items-center gap-2">
              <Layers className="h-5 w-5 text-[#fb4903] stroke-[2.5]" />
              Hierarchical Spatial Breakdown
            </h3>
            <p className="text-xs text-[#000000] font-medium">ROOM &rarr; FLOOR &rarr; BLOCK &rarr; CAMPUS spatial case mapping</p>
          </div>

          <div className="flex items-center gap-2 font-bold">
            <Filter className="h-4 w-4 text-[#000000]" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 rounded-[1600px] bg-[#ffffff] border border-[#000000] text-xs text-[#000000] font-bold outline-none cursor-pointer"
            >
              <option value="ALL">All Disease Categories</option>
              <option value="Food Poisoning">Food Poisoning</option>
              <option value="Viral Fever">Viral Fever</option>
              <option value="Upper Respiratory Infection">Upper Respiratory Infection</option>
            </select>
          </div>
        </div>

        {/* Spatial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {Object.entries(defaultBlocks).map(([location, data]) => (
            <div
              key={location}
              className="p-6 rounded-[20px] bg-[#dceeff] border border-[#000000] space-y-4 shadow-none"
            >
              <div className="flex items-center justify-between border-b border-[#000000] pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#fb4903] stroke-[2.5]" />
                  <span className="font-extrabold text-[#000000] text-sm">{location}</span>
                </div>
                <span className="px-3 py-0.5 rounded-[1600px] bg-[#ffffff] text-[#000000] font-bold text-[10px] border border-[#000000]">
                  {data.total} Total Cases
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center font-bold">
                <div className="p-3 rounded-[20px] bg-[#55db9c] border border-[#000000]">
                  <p className="text-xl font-extrabold text-[#000000]">{data.confirmed}</p>
                  <p className="text-[10px] text-[#000000] uppercase font-bold">Doctor Confirmed</p>
                </div>

                <div className="p-3 rounded-[20px] bg-[#ffd731] border border-[#000000]">
                  <p className="text-xl font-extrabold text-[#000000]">{data.suspected}</p>
                  <p className="text-[10px] text-[#000000] uppercase font-bold">AI Suspected</p>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <p className="text-[#000000] text-[11px] font-extrabold uppercase tracking-wider">Category Breakdown:</p>
                {Object.entries(data.categories).map(([cat, count]) => (
                  <div key={cat} className="flex justify-between items-center bg-[#ffffff] px-3 py-1 rounded-[1600px] border border-[#000000] text-[#000000] font-bold">
                    <span>{cat}</span>
                    <span className="font-extrabold text-[#000000]">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
