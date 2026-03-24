'use client';

import { useState } from 'react';
import { BookOpen, ChevronRight, ThumbsUp, ThumbsDown, ArrowLeft, Filter } from 'lucide-react';
import { researchTopics, categoryLabels } from '@/lib/research-data';
import type { ResearchTopic } from '@/lib/research-data';

const cardClass = 'bg-[#1a1d27] border border-[#2a2d37] rounded-xl';

function CategoryBadge({ category }: { category: string }) {
  const cat = categoryLabels[category];
  if (!cat) return null;
  return (
    <span
      className="text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
    >
      {cat.label}
    </span>
  );
}

function SnippetCard({ topic, onClick }: { topic: ResearchTopic; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`${cardClass} p-5 text-left hover:bg-[#22262f] hover:border-[#3b82f6]/30 transition-all group w-full`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{topic.icon}</span>
            <CategoryBadge category={topic.category} />
            <span className="text-xs text-gray-500">{topic.sourceYear}</span>
          </div>
          <h3 className="text-base font-semibold text-white group-hover:text-[#3b82f6] transition-colors">
            {topic.title}
          </h3>
          <p className="text-sm text-gray-400 mt-1.5 line-clamp-2">{topic.snippet}</p>
          <div className="flex items-center gap-3 mt-3">
            <div className="bg-[#0f1117] rounded-lg px-3 py-1.5">
              <p className="text-lg font-bold text-white">{topic.keyNumber}</p>
              <p className="text-xs text-gray-500">{topic.keyNumberLabel}</p>
            </div>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-[#3b82f6] shrink-0 mt-1 transition-colors" />
      </div>
      <p className="text-xs text-gray-500 mt-3">{topic.source}</p>
    </button>
  );
}

function TopicDetail({ topic, onBack }: { topic: ResearchTopic; onBack: () => void }) {
  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all research
      </button>

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{topic.icon}</span>
          <CategoryBadge category={topic.category} />
        </div>
        <h1 className="text-2xl font-bold text-white">{topic.title}</h1>
        <p className="text-gray-400 mt-2">{topic.snippet}</p>
      </div>

      {/* Key Number + Source */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={`${cardClass} p-5`}>
          <p className="text-sm text-gray-400">Key Finding</p>
          <p className="text-3xl font-bold text-white mt-1">{topic.keyNumber}</p>
          <p className="text-sm text-gray-500 mt-1">{topic.keyNumberLabel}</p>
        </div>
        <div className={`${cardClass} p-5`}>
          <p className="text-sm text-gray-400">Source</p>
          <p className="text-base font-medium text-white mt-1">{topic.source}</p>
          <p className="text-sm text-gray-500 mt-1">{topic.sourceYear}</p>
        </div>
      </div>

      {/* Context */}
      <div className={`${cardClass} p-6`}>
        <h2 className="text-lg font-semibold text-white mb-3">Background</h2>
        <p className="text-sm text-gray-300 leading-relaxed">{topic.context}</p>
      </div>

      {/* Arguments For & Against */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* For */}
        <div className={`${cardClass} p-6 border-[#10b981]/20`}>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#10b981]/10">
              <ThumbsUp className="h-4 w-4 text-[#10b981]" />
            </div>
            <h2 className="text-lg font-semibold text-[#10b981]">Arguments For</h2>
          </div>
          <div className="space-y-4">
            {topic.argumentsFor.map((arg, i) => (
              <div key={i}>
                <h3 className="text-sm font-semibold text-white">{arg.title}</h3>
                <p className="text-sm text-gray-400 mt-1 leading-relaxed">{arg.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Against */}
        <div className={`${cardClass} p-6 border-[#ef4444]/20`}>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ef4444]/10">
              <ThumbsDown className="h-4 w-4 text-[#ef4444]" />
            </div>
            <h2 className="text-lg font-semibold text-[#ef4444]">Arguments Against</h2>
          </div>
          <div className="space-y-4">
            {topic.argumentsAgainst.map((arg, i) => (
              <div key={i}>
                <h3 className="text-sm font-semibold text-white">{arg.title}</h3>
                <p className="text-sm text-gray-400 mt-1 leading-relaxed">{arg.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Balanced Takeaway */}
      <div className="bg-gradient-to-r from-[#3b82f6]/10 to-[#8b5cf6]/10 border border-[#3b82f6]/20 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-2">Balanced Takeaway</h2>
        <p className="text-sm text-gray-300 leading-relaxed">{topic.takeaway}</p>
      </div>
    </div>
  );
}

export default function ResearchHub() {
  const [selectedTopic, setSelectedTopic] = useState<ResearchTopic | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredTopics = activeFilter
    ? researchTopics.filter(t => t.category === activeFilter)
    : researchTopics;

  if (selectedTopic) {
    return <TopicDetail topic={selectedTopic} onBack={() => setSelectedTopic(null)} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3b82f6]/10">
          <BookOpen className="h-5 w-5 text-[#3b82f6]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Financial Research & Insights</h1>
          <p className="text-sm text-gray-400">
            Evidence-based perspectives on key financial decisions — both sides of every argument
          </p>
        </div>
      </div>

      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-[#3b82f6]/5 to-[#8b5cf6]/5 border border-[#3b82f6]/15 rounded-xl p-5">
        <p className="text-sm text-gray-300 leading-relaxed">
          Financial &quot;rules&quot; change as research evolves. What was standard advice 10 years ago may be outdated today.
          Each topic below presents the <span className="text-[#10b981] font-medium">arguments for</span> and{' '}
          <span className="text-[#ef4444] font-medium">arguments against</span> common financial decisions,
          backed by the latest studies. The goal isn&apos;t to tell you what to do — it&apos;s to help you
          think critically and make informed decisions that fit <em>your</em> life.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-gray-500" />
        <button
          onClick={() => setActiveFilter(null)}
          className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
            !activeFilter
              ? 'bg-[#3b82f6]/15 text-[#3b82f6] font-medium'
              : 'bg-[#1a1d27] text-gray-400 hover:text-white border border-[#2a2d37]'
          }`}
        >
          All ({researchTopics.length})
        </button>
        {Object.entries(categoryLabels).map(([key, val]) => {
          const count = researchTopics.filter(t => t.category === key).length;
          return (
            <button
              key={key}
              onClick={() => setActiveFilter(activeFilter === key ? null : key)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                activeFilter === key
                  ? 'font-medium'
                  : 'bg-[#1a1d27] text-gray-400 hover:text-white border border-[#2a2d37]'
              }`}
              style={activeFilter === key ? { backgroundColor: `${val.color}20`, color: val.color } : undefined}
            >
              {val.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Topic Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredTopics.map((topic) => (
          <SnippetCard
            key={topic.id}
            topic={topic}
            onClick={() => setSelectedTopic(topic)}
          />
        ))}
      </div>
    </div>
  );
}
