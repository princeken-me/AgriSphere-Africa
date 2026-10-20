import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  User,
  History,
  Plus,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  Lightbulb,
  X
} from 'lucide-react';
import {
  TopicCategory,
  AIMessage,
  AIConversation,
  QUICK_TOPICS,
  SUGGESTED_QUESTIONS_BY_TOPIC,
  generateAIFarmingResponse,
  saveConversationToSupabase,
  saveMessageToSupabase,
  fetchConversationsFromSupabase
} from '../../services/aiAgronomist';
import { useSpeechRecognition, useSpeechSynthesis } from '../../utils/useSpeech';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface AIFarmingAssistantProps {
  currentUserId?: string;
  embedded?: boolean;
  onCloseModal?: () => void;
}

export const AIFarmingAssistant: React.FC<AIFarmingAssistantProps> = ({
  currentUserId = 'usr_farmer_001',
  embedded = false,
  onCloseModal
}) => {
  // Topics & Chat State
  const [selectedTopic, setSelectedTopic] = useState<TopicCategory>('General');
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [autoVoiceOutput, setAutoVoiceOutput] = useState(false);
  const [isHistorySidebarOpen, setIsHistorySidebarOpen] = useState(false);

  // Conversations Storage State
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>('');

  // Speech Hooks
  const {
    isSupported: isSpeechRecSupported,
    isListening,
    transcript,
    error: speechError,
    startListening,
    stopListening,
    setTranscript
  } = useSpeechRecognition();

  const {
    isSupported: isSpeechSynthSupported,
    isSpeaking,
    activeMessageId: speakingMessageId,
    speakText,
    stopSpeaking
  } = useSpeechSynthesis();

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize or load past conversations from Supabase / localStorage
  useEffect(() => {
    async function loadData() {
      const supabaseConvs = await fetchConversationsFromSupabase(currentUserId);
      if (supabaseConvs.length > 0) {
        setConversations(supabaseConvs);
        setActiveConversationId(supabaseConvs[0].id);
      } else {
        // Create initial default welcome session
        const initialSession: AIConversation = {
          id: `conv_${Date.now()}`,
          userId: currentUserId,
          title: 'AgriSphere Agronomy Consultation',
          topic: 'General',
          updatedAt: new Date().toISOString(),
          messages: [
            {
              id: 'msg_welcome',
              sender: 'assistant',
              content: `👋 Hello! I am your **AgriSphere AI Farming Assistant**. 

I am trained on soil science, crop diagnostics, sub-Saharan weather patterns, and regional market indices across Africa.

How can I help you increase crop yields or resolve farming challenges today? Select a topic below or ask any question!`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              topic: 'General',
              keyTakeaways: [
                'Instant crop disease diagnosis & treatment steps',
                'Soil fertility & fertilizer application advice (DAP, CAN, NPK)',
                'Regional wholesale grain & commodity market price tracking'
              ],
              suggestedFollowups: [
                'What is the ideal plant spacing for SC719 hybrid maize?',
                'How to treat yellowing leaves with brown fungal spots?',
                'What are current maize wholesale prices in Nairobi & Nakuru?'
              ]
            }
          ]
        };
        setConversations([initialSession]);
        setActiveConversationId(initialSession.id);
      }
    }

    loadData();
  }, [currentUserId]);

  // Sync speech recognition transcript into input query
  useEffect(() => {
    if (transcript) {
      setInputQuery(transcript);
    }
  }, [transcript]);

  // Scroll to bottom when messages update
  const activeConversation = conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const messages = activeConversation?.messages || [];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handlers: Send message & run AI assistant
  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isTyping) return;

    // Reset input & speech transcript
    setInputQuery('');
    setTranscript('');
    if (isListening) stopListening();

    const userMessageId = `msg_user_${Date.now()}`;
    const userMessage: AIMessage = {
      id: userMessageId,
      sender: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      topic: selectedTopic,
      isVoiceInput: Boolean(transcript && textToSend === transcript)
    };

    // Update state immediately with user message
    let convId = activeConversationId;
    if (!convId) {
      convId = await saveConversationToSupabase(currentUserId, textToSend.slice(0, 30), selectedTopic);
      setActiveConversationId(convId);
    }

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === convId
          ? {
              ...conv,
              title: conv.messages.length <= 1 ? textToSend.slice(0, 35) + '...' : conv.title,
              updatedAt: new Date().toISOString(),
              messages: [...conv.messages, userMessage]
            }
          : conv
      )
    );

    saveMessageToSupabase(convId, userMessage);

    // Trigger AI response typing state
    setIsTyping(true);

    try {
      const aiResult = await generateAIFarmingResponse(textToSend, selectedTopic);

      const assistantMessageId = `msg_ai_${Date.now()}`;
      const assistantMessage: AIMessage = {
        id: assistantMessageId,
        sender: 'assistant',
        content: aiResult.responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        topic: aiResult.topicCategory,
        keyTakeaways: aiResult.keyTakeaways,
        suggestedFollowups: aiResult.suggestedFollowUps
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === convId
            ? {
                ...conv,
                updatedAt: new Date().toISOString(),
                messages: [...conv.messages, assistantMessage]
              }
            : conv
        )
      );

      saveMessageToSupabase(convId, assistantMessage);

      // Speak AI response if auto-voice is enabled
      if (autoVoiceOutput && isSpeechSynthSupported) {
        speakText(aiResult.responseText, assistantMessageId);
      }
    } catch (err) {
      console.error('AI Agronomist Error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  // Create New Chat Session
  const handleStartNewChat = async () => {
    stopSpeaking();
    const newId = await saveConversationToSupabase(currentUserId, 'New Farming Consultation', selectedTopic);
    const newConv: AIConversation = {
      id: newId,
      userId: currentUserId,
      title: `${selectedTopic} Consultation`,
      topic: selectedTopic,
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg_welcome_${Date.now()}`,
          sender: 'assistant',
          content: `🌱 New session started for **${selectedTopic}**! Ask a question or select a quick topic question below.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          topic: selectedTopic,
          keyTakeaways: ['Select suggested questions for fast diagnosis'],
          suggestedFollowups: SUGGESTED_QUESTIONS_BY_TOPIC[selectedTopic]?.slice(0, 3) || []
        }
      ]
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newId);
  };

  // Clear Chat Messages
  const handleClearMessages = () => {
    stopSpeaking();
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConversationId ? { ...c, messages: [] } : c))
    );
  };

  // Delete Conversation Session
  const handleDeleteConversation = (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    stopSpeaking();
    setConversations((prev) => prev.filter((c) => c.id !== convId));
    if (activeConversationId === convId) {
      const remaining = conversations.filter((c) => c.id !== convId);
      if (remaining.length > 0) setActiveConversationId(remaining[0].id);
    }
  };

  // Copy Message Content to Clipboard
  const handleCopyMessage = (messageId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const suggestedQuestions = SUGGESTED_QUESTIONS_BY_TOPIC[selectedTopic] || SUGGESTED_QUESTIONS_BY_TOPIC.General;

  return (
    <div className={`flex flex-col ${embedded ? 'h-[72vh]' : 'h-[calc(100vh-8rem)] min-h-[580px]'} max-w-6xl mx-auto bg-stone-950 text-stone-100 rounded-3xl border border-stone-800 shadow-2xl overflow-hidden relative`}>
      
      {/* Top Navigation Bar */}
      <div className="bg-stone-900/90 border-b border-stone-800 px-4 py-3 flex items-center justify-between gap-3 shrink-0 backdrop-blur-md z-10">
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsHistorySidebarOpen(!isHistorySidebarOpen)}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Toggle Conversation History"
          >
            <History className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">History</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">AI Farming Assistant</h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  AGRONOMIST ONLINE
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block">AgriSphere Sub-Saharan Farming & Crop Intelligence</p>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          
          {/* Auto Voice Readout Toggle */}
          <button
            onClick={() => setAutoVoiceOutput(!autoVoiceOutput)}
            className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              autoVoiceOutput
                ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-600/50'
                : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
            }`}
            title="Auto-read AI responses using browser Speech Synthesis"
          >
            {autoVoiceOutput ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden md:inline text-[11px]">{autoVoiceOutput ? 'Voice On' : 'Voice Off'}</span>
          </button>

          {/* Start New Session */}
          <button
            onClick={handleStartNewChat}
            className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Chat</span>
          </button>

          {/* Embedded Modal Close */}
          {embedded && onCloseModal && (
            <button
              onClick={onCloseModal}
              className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}

        </div>

      </div>

      {/* Main Body Grid with History Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Conversation History Sidebar Overlay */}
        {isHistorySidebarOpen && (
          <div className="w-72 bg-stone-900 border-r border-stone-800 flex flex-col justify-between shrink-0 p-3 z-20 transition-all animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-3 px-1">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-emerald-400" /> Saved Consultations
                </span>
                <button
                  onClick={handleStartNewChat}
                  className="text-emerald-400 hover:text-emerald-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  + New
                </button>
              </div>

              <div className="space-y-1.5 max-h-[calc(100vh-16rem)] overflow-y-auto pr-1">
                {conversations.map((conv) => {
                  const isActive = conv.id === activeConversationId;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => {
                        setActiveConversationId(conv.id);
                        setIsHistorySidebarOpen(false);
                      }}
                      className={`p-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-between group ${
                        isActive
                          ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-800/60 font-semibold'
                          : 'text-stone-300 hover:bg-stone-800/70'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-400' : 'text-stone-500'}`} />
                        <span className="truncate">{conv.title || 'Farming Consultation'}</span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteConversation(conv.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-rose-400 transition-opacity"
                        title="Delete session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-800 text-[11px] text-stone-500 px-1 flex items-center justify-between">
              <span>Supabase Cloud Sync</span>
              <span className="text-emerald-400 font-bold">READY</span>
            </div>
          </div>
        )}

        {/* Primary Chat Canvas Area */}
        <div className="flex-1 flex flex-col justify-between overflow-hidden bg-stone-950">
          
          {/* Top Quick Topic Buttons */}
          <div className="bg-stone-900/40 border-b border-stone-800/80 px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider shrink-0 mr-1">
              Topics:
            </span>

            <button
              onClick={() => setSelectedTopic('General')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                selectedTopic === 'General'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-900 text-stone-400 hover:bg-stone-800 hover:text-white border border-stone-800'
              }`}
            >
              <span>✨</span>
              <span>All Topics</span>
            </button>

            {QUICK_TOPICS.map((topic) => {
              const isSelected = selectedTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? `${topic.bgColor} ${topic.color} border ${topic.borderColor} font-bold shadow-xs`
                      : 'bg-stone-900 text-stone-400 hover:bg-stone-800 hover:text-stone-200 border border-stone-800'
                  }`}
                >
                  <span>{topic.icon}</span>
                  <span>{topic.name}</span>
                </button>
              );
            })}
          </div>

          {/* Messages Scroll View */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {messages.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center mx-auto text-emerald-400">
                  <Sparkles className="w-8 h-8 animate-pulse" />
                </div>
                <h4 className="text-base font-bold text-stone-200">Start Your Agronomy Consultation</h4>
                <p className="text-xs text-stone-400 max-w-md mx-auto">
                  Ask questions about planting density, crop diseases, fertilizer application ratios, or market pricing.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isUser = msg.sender === 'user';
                const isSpeakingThisMsg = isSpeaking && speakingMessageId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''} group`}
                  >
                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                      isUser
                        ? 'bg-emerald-800 text-white'
                        : 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white'
                    }`}>
                      {isUser ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
                    </div>

                    {/* Message Bubble Content */}
                    <div className={`space-y-2 max-w-[88%] sm:max-w-[80%] ${
                      isUser
                        ? 'bg-emerald-800/90 text-white rounded-2xl rounded-tr-xs p-4 border border-emerald-700/60 shadow-md'
                        : 'bg-stone-900 text-stone-100 rounded-2xl rounded-tl-xs p-4 border border-stone-800/80 shadow-md'
                    }`}>
                      
                      {/* Bubble Header */}
                      <div className="flex items-center justify-between text-[11px] gap-2 border-b border-white/10 pb-1.5 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold">{isUser ? 'You (Farmer)' : 'AgriSphere AI Agronomist'}</span>
                          {msg.topic && (
                            <span className="text-[10px] bg-stone-800 text-emerald-400 px-2 py-0.5 rounded-md border border-stone-700 font-semibold">
                              {msg.topic}
                            </span>
                          )}
                          {msg.isVoiceInput && (
                            <span className="text-[10px] text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <Mic className="w-3 h-3" /> Voice
                            </span>
                          )}
                        </div>
                        <span className="text-stone-400 text-[10px]">{msg.timestamp}</span>
                      </div>

                      {/* Text Content */}
                      <div className="text-xs leading-relaxed space-y-2 whitespace-pre-line font-medium text-stone-200">
                        {msg.content}
                      </div>

                      {/* Key Takeaways Highlight Box (Assistant Only) */}
                      {!isUser && msg.keyTakeaways && msg.keyTakeaways.length > 0 && (
                        <div className="mt-3 bg-stone-950/60 border border-emerald-900/60 rounded-xl p-3 space-y-1.5">
                          <span className="text-[10px] uppercase font-extrabold text-emerald-400 tracking-wider flex items-center gap-1">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Key Agronomic Takeaways
                          </span>
                          <ul className="space-y-1 text-xs text-stone-300">
                            {msg.keyTakeaways.map((kt, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-emerald-400 font-bold">•</span>
                                <span>{kt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Suggested Follow-ups (Assistant Only) */}
                      {!isUser && msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-stone-800 space-y-1.5">
                          <span className="text-[10px] font-bold text-stone-400">Suggested Follow-up Questions:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.suggestedFollowups.map((q, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSendMessage(q)}
                                className="text-[11px] bg-stone-800 hover:bg-emerald-900/60 hover:text-emerald-300 text-stone-300 px-2.5 py-1 rounded-xl border border-stone-700/80 transition-all cursor-pointer text-left flex items-center gap-1"
                              >
                                <span>{q}</span>
                                <ArrowRight className="w-3 h-3 shrink-0 text-emerald-400" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Message Control Bar (Copy / Read Aloud) */}
                      {!isUser && (
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800/80 text-stone-400">
                          <button
                            onClick={() => handleCopyMessage(msg.id, msg.content)}
                            className="p-1 hover:text-emerald-400 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                            title="Copy response"
                          >
                            {copiedMessageId === msg.id ? (
                              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                                <Check className="w-3.5 h-3.5" /> Copied!
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Copy className="w-3.5 h-3.5" /> Copy
                              </span>
                            )}
                          </button>

                          {isSpeechSynthSupported && (
                            <button
                              onClick={() => {
                                if (isSpeakingThisMsg) {
                                  stopSpeaking();
                                } else {
                                  speakText(msg.content, msg.id);
                                }
                              }}
                              className={`p-1 text-[11px] flex items-center gap-1 transition-colors cursor-pointer ${
                                isSpeakingThisMsg ? 'text-amber-400 font-bold animate-pulse' : 'hover:text-emerald-400'
                              }`}
                              title={isSpeakingThisMsg ? 'Stop Voice Output' : 'Read Aloud via Voice'}
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>{isSpeakingThisMsg ? 'Stop Voice' : 'Speak'}</span>
                            </button>
                          )}
                        </div>
                      )}

                    </div>
                  </div>
                );
              })
            )}

            {/* Typing Indicator Animation */}
            {isTyping && (
              <div className="flex gap-3 max-w-3xl animate-in fade-in duration-200">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 animate-spin" />
                </div>
                <div className="bg-stone-900 border border-stone-800 rounded-2xl rounded-tl-xs p-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-xs font-semibold text-stone-400 ml-2">AgriSphere Agronomist analyzing query...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Suggested Questions Pills Section */}
          <div className="bg-stone-900/60 border-t border-stone-800 px-4 py-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Suggested Questions ({selectedTopic}):
              </span>
              <button
                onClick={handleClearMessages}
                className="text-[10px] text-stone-500 hover:text-stone-300 underline cursor-pointer"
              >
                Clear History
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  disabled={isTyping}
                  className="px-3 py-1.5 rounded-xl bg-stone-800/80 hover:bg-stone-800 hover:text-emerald-300 text-stone-300 text-xs transition-all whitespace-nowrap border border-stone-700/60 cursor-pointer disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Chat Input Form & Speech Controls */}
          <div className="bg-stone-900 p-4 border-t border-stone-800 space-y-2">
            
            {/* Speech error indicator */}
            {speechError && (
              <p className="text-[11px] text-amber-400 bg-amber-950/80 border border-amber-800 px-3 py-1 rounded-lg">
                {speechError}
              </p>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              
              {/* Voice Input Microphone Button */}
              {isSpeechRecSupported && (
                <button
                  type="button"
                  onClick={() => {
                    if (isListening) {
                      stopListening();
                    } else {
                      startListening();
                    }
                  }}
                  className={`p-3 rounded-2xl transition-all cursor-pointer relative ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/30'
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                  }`}
                  title={isListening ? 'Click to stop listening' : 'Click to start voice input'}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  {isListening && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-400 animate-ping" />
                  )}
                </button>
              )}

              {/* Text Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder={
                    isListening
                      ? '🎙️ Listening... speak your farming question...'
                      : `Ask AgriSphere AI about ${selectedTopic.toLowerCase()}...`
                  }
                  className="w-full bg-stone-950 border border-stone-800 text-stone-100 rounded-2xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-emerald-500 placeholder-stone-500"
                />
              </div>

              {/* Submit Button */}
              <Button
                variant="primary"
                type="submit"
                disabled={!inputQuery.trim() || isTyping}
                icon={<Send className="w-4 h-4" />}
                className="rounded-2xl px-4 py-3"
              >
                Send
              </Button>

            </form>

            <div className="flex items-center justify-between text-[10px] text-stone-500 px-1">
              <span>Powered by AgriSphere AI Engine • Web Speech API Integrated</span>
              <span>Supabase History Active</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
