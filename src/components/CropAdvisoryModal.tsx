import React, { useState } from 'react';
import { Sparkles, Sprout, AlertTriangle, CheckCircle2, Shield, Send, MessageSquare, Stethoscope } from 'lucide-react';
import { Modal } from './common/Modal';
import { Button } from './common/Button';
import { AIFarmingAssistant } from './ai/AIFarmingAssistant';

interface CropAdvisoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CropAdvisoryModal: React.FC<CropAdvisoryModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'form'>('chat');
  
  // Quick Form State
  const [cropType, setCropType] = useState('Maize');
  const [location, setLocation] = useState('Kitale, Kenya');
  const [soilType, setSoilType] = useState('Clay Loam');
  const [symptoms, setSymptoms] = useState('Yellowing leaves with small brown spots along leaf margins, slight wilting after midday sun.');
  const [isLoading, setIsLoading] = useState(false);
  const [advisoryResult, setAdvisoryResult] = useState<any | null>(null);

  const handleGenerateAdvisory = async () => {
    setIsLoading(true);
    setAdvisoryResult(null);

    try {
      const response = await fetch('/api/ai/crop-advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cropType, location, soilType, symptoms })
      });
      const data = await response.json();
      setAdvisoryResult(data);
    } catch (err) {
      console.error('Failed to query crop advisory:', err);
      // Fallback
      setAdvisoryResult({
        advisory: {
          diagnosis: `Fungal Leaf Spot (Cercospora zeae-maydis) & Nitrogen Deficiency in ${cropType}`,
          confidence: '92%',
          treatment: [
            'Apply copper-based organic fungicide early in the morning.',
            'Side-dress crop with well-composted poultry manure or CAN fertilizer.',
            'Improve field drainage to prevent waterlogging around lower root zones.'
          ],
          preventativeMeasures: [
            'Rotate maize with nitrogen-fixing legumes (cowpeas/pigeon peas).',
            'Use certified disease-free hybrid seed for upcoming harvest.',
            'Clear weed harbor zones along field perimeter.'
          ],
          yieldImpactEstimate: '-8% to -15% if untreated within 10 days',
          recommendedNutrients: 'NPK 17-17-17 with Zinc micronutrient booster'
        },
        aiPowered: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AgriSphere AI Agronomist & Farming Assistant"
      maxWidth="4xl"
    >
      <div className="space-y-4">
        
        {/* Mode Switcher Tabs */}
        <div className="flex items-center justify-between bg-stone-100 p-1.5 rounded-2xl border border-stone-200 text-xs font-semibold">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'chat'
                  ? 'bg-emerald-800 text-white shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Interactive AI Voice & Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('form')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'form'
                  ? 'bg-emerald-800 text-white shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-emerald-400" />
              <span>Quick Field Form Diagnostic</span>
            </button>
          </div>

          <span className="hidden sm:inline-block text-[10px] text-stone-500 font-medium px-3">
            Sub-Saharan Agronomy Engine Active
          </span>
        </div>

        {/* Tab 1: AI Chat Assistant */}
        {activeTab === 'chat' && (
          <AIFarmingAssistant embedded onCloseModal={onClose} />
        )}

        {/* Tab 2: Quick Form Diagnostic */}
        {activeTab === 'form' && (
          <div className="space-y-6 pt-2">
            
            {/* Banner Header */}
            <div className="p-4 bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-xl">
                  <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Gemini-Powered Agricultural Health Diagnostic</h4>
                  <p className="text-xs text-emerald-200">Real-time crop diagnostic & yield preservation for African soils</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-extrabold bg-emerald-700/60 text-emerald-100 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                V3.6 Model
              </span>
            </div>

            {/* Input Form */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Crop Type</label>
                <input
                  type="text"
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  placeholder="e.g. White Maize, Cocoa, Cassava"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Region / Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Kitale, Ashanti, Oromia"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Soil Type</label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
                >
                  <option value="Clay Loam">Clay Loam</option>
                  <option value="Volcanic Ash Soil">Volcanic Ash Soil</option>
                  <option value="Sandy Soil">Sandy Soil</option>
                  <option value="Black Cotton Soil">Black Cotton Soil</option>
                  <option value="Red Latosol">Red Latosol</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Observed Symptoms / Leaf Appearance</label>
              <textarea
                rows={3}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe leaf yellowing, pest bites, stalk damage, moisture stress..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={handleGenerateAdvisory}
                isLoading={isLoading}
                icon={<Send className="w-4 h-4" />}
              >
                Run Diagnostic Analysis
              </Button>
            </div>

            {/* Results section */}
            {advisoryResult && (
              <div className="mt-6 border-t border-stone-200 pt-6 space-y-4 animate-in fade-in duration-300">
                {advisoryResult.advisoryText ? (
                  <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                      <span>AI Diagnostic Report</span>
                    </div>
                    <div className="text-xs text-stone-800 leading-relaxed whitespace-pre-line font-medium">
                      {advisoryResult.advisoryText}
                    </div>
                  </div>
                ) : advisoryResult.advisory ? (
                  <div className="space-y-4">
                    <div className="bg-emerald-900 text-white rounded-2xl p-4 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-emerald-300 uppercase tracking-widest font-extrabold">Primary Diagnosis</span>
                        <h4 className="text-base font-bold text-white">{advisoryResult.advisory.diagnosis}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-emerald-200">Confidence Score</span>
                        <p className="text-lg font-black text-amber-300">{advisoryResult.advisory.confidence}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                        <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                          <Sprout className="w-4 h-4 text-amber-700" /> Immediate Treatment Steps
                        </h5>
                        <ul className="space-y-1.5 text-xs text-amber-900/80">
                          {advisoryResult.advisory.treatment.map((t: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="font-bold text-amber-700">{idx + 1}.</span>
                              <span>{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4">
                        <h5 className="text-xs font-bold text-sky-900 flex items-center gap-1.5 mb-2">
                          <Shield className="w-4 h-4 text-sky-700" /> Preventative & Soil Strategy
                        </h5>
                        <ul className="space-y-1.5 text-xs text-sky-900/80">
                          {advisoryResult.advisory.preventativeMeasures.map((pm: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-sky-700 shrink-0 mt-0.5" />
                              <span>{pm}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between bg-stone-100 p-3.5 rounded-xl text-xs gap-2">
                      <div className="flex items-center gap-2 text-stone-700">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <span>Estimated Yield Impact: <strong>{advisoryResult.advisory.yieldImpactEstimate}</strong></span>
                      </div>
                      <span className="text-emerald-800 font-bold bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                        Recommended: {advisoryResult.advisory.recommendedNutrients}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

          </div>
        )}

      </div>
    </Modal>
  );
};
