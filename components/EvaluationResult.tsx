'use client';

import { useState } from 'react';

// 评估维度接口
interface EvaluationDimension {
  name: string;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

// 完整评估结果接口
interface InterviewEvaluation {
  overallScore: number;
  dimensions: EvaluationDimension[];
  summary: string;
  recommendations: string[];
}

interface EvaluationResultProps {
  evaluation: InterviewEvaluation | null;
  onClose: () => void;
}

export default function EvaluationResult({ evaluation, onClose }: EvaluationResultProps) {
  if (!evaluation) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getDimensionIcon = (name: string) => {
    switch (name) {
      case '专业能力': return '💼';
      case '逻辑思维': return '🧠';
      case '沟通表达': return '💬';
      case '性格特质': return '👤';
      default: return '📊';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">📊 面试评估报告</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 max-h-[60vh]">
          {/* 总分 */}
          <div className="text-center mb-6">
            <div className={`text-5xl font-bold ${getScoreColor(evaluation.overallScore)}`}>
              {evaluation.overallScore}
            </div>
            <div className="text-gray-500 mt-2">总分（满分100）</div>
          </div>

          {/* 各维度评分 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {evaluation.dimensions.map((dim, index) => (
              <div key={index} className={`p-4 rounded-lg ${getScoreBgColor(dim.score)}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{getDimensionIcon(dim.name)}</span>
                  <div>
                    <div className="font-medium">{dim.name}</div>
                    <div className={`text-2xl font-bold ${getScoreColor(dim.score)}`}>
                      {dim.score}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{dim.feedback}</p>
              </div>
            ))}
          </div>

          {/* 整体评价 */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">📝 整体评价</h3>
            <p className="text-gray-600">{evaluation.summary}</p>
          </div>

          {/* 优势和改进建议 */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">✅ 优势</h4>
              <ul className="space-y-1">
                {evaluation.dimensions.flatMap(d => d.strengths).map((s, i) => (
                  <li key={i} className="text-sm text-green-700">• {s}</li>
                ))}
              </ul>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">💡 改进建议</h4>
              <ul className="space-y-1">
                {evaluation.recommendations.map((r, i) => (
                  <li key={i} className="text-sm text-orange-700">• {r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
