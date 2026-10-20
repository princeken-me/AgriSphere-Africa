import React from 'react';
import { CloudSun, Sun, CloudRain, Wind, Droplets, Thermometer, ShieldAlert, Sparkles } from 'lucide-react';
import { WEATHER_FORECAST, FARM_PLOTS } from '../../data/mockData';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface WeatherWidgetViewProps {
  onOpenAIAgronomist: () => void;
}

export const WeatherWidgetView: React.FC<WeatherWidgetViewProps> = ({ onOpenAIAgronomist }) => {
  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-stone-900 via-emerald-950 to-stone-900 text-white rounded-3xl p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 border border-amber-500/30">
                <Sun className="w-3.5 h-3.5" /> Regional Weather Station
              </span>
              <span className="text-xs text-stone-400">Kitale / Trans-Nzoia North</span>
            </div>
            <h2 className="text-2xl font-bold font-display text-white">28°C • Partly Sunny</h2>
            <p className="text-xs text-stone-300 mt-0.5">Humidity: 68% • Wind: 14 km/h • Precipitation: 15%</p>
          </div>

          <Button variant="outline" size="sm" onClick={onOpenAIAgronomist} icon={<Sparkles className="w-4 h-4 text-amber-400" />}>
            Ask AI Agronomist Advisory
          </Button>
        </div>

        {/* 5-Day Forecast Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {WEATHER_FORECAST.map((w, idx) => (
            <div key={idx} className="p-3.5 bg-stone-950/60 rounded-2xl border border-stone-800 text-center space-y-1">
              <p className="text-xs font-bold text-stone-300">{w.day}</p>
              <div className="my-1 text-amber-300 flex items-center justify-center">
                {w.condition.includes('Rain') ? (
                  <CloudRain className="w-6 h-6 text-sky-400" />
                ) : (
                  <CloudSun className="w-6 h-6 text-amber-300" />
                )}
              </div>
              <p className="text-sm font-black text-white">{w.tempMax}° / {w.tempMin}°</p>
              <p className="text-[10px] text-stone-400 font-semibold">{w.precipitationChance}% Rain</p>
            </div>
          ))}
        </div>
      </div>

      {/* Agronomic Recommendations & Soil Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Spray & Chemical Advisory */}
        <Card className="p-5 space-y-4">
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-600" /> Spray & Irrigation Advisory
          </h4>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
              <span className="font-bold text-amber-900 block">Thursday Afternoon Rain Warning</span>
              <p className="text-amber-800">
                Heavy localized downpour (~24mm) predicted on Thursday. Avoid applying foliar fertilizers or pesticides within 24 hours prior.
              </p>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
              <span className="font-bold text-emerald-900 block">Optimal Solar Drying Window</span>
              <p className="text-emerald-800">
                Tuesday & Wednesday offer peak solar irradiance (6.8 kWh/m²). Ideal window to dry yellow maize batch #001 to under 13% moisture.
              </p>
            </div>
          </div>
        </Card>

        {/* Real-time Soil Telemetry */}
        <Card className="p-5 space-y-4">
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-sky-600" /> Soil Moisture & pH Sensors
          </h4>

          <div className="space-y-3">
            {FARM_PLOTS.map((plot) => (
              <div key={plot.id} className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between items-center font-bold text-stone-900">
                  <span>{plot.name} ({plot.crop})</span>
                  <span className="text-emerald-800">Health: {plot.healthScore}/100</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600">
                  <div>Moisture: <strong>{plot.soilMoisture}%</strong> (Target: 60-75%)</div>
                  <div>Soil pH: <strong>{plot.soilpH}</strong> (Optimal)</div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-1.5 rounded-full"
                    style={{ width: `${plot.healthScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>

    </div>
  );
};
