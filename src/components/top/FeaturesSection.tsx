'use client';

import { PenLine, Clock, Wallet, Target, BarChart3, Trophy, Bot, Users } from 'lucide-react';

export default function FeaturesSection() {
  return (
    <div className="text-center pt-0">
      <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
        主な機能
      </div>
      <div className="space-y-8">
        <div className="flex items-start space-x-4 group">
          <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
            <PenLine className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2 group-hover:text-yellow-600 transition-colors">
              やめたい行動を記録
            </h3>
            <p className="text-gray-600">何を、いつからやめているのかをカウントします。</p>
          </div>
        </div>

        <div className="flex items-start space-x-4 group">
          <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2 group-hover:text-yellow-600 transition-colors">
              継続日数を自動カウント
            </h3>
            <p className="text-gray-600">やめ続けている日数をリアルタイムで表示します。</p>
          </div>
        </div>

        <div className="flex items-start space-x-4 group">
          <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
            <Wallet className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2 group-hover:text-yellow-600 transition-colors">
              節約した時間・お金を可視化
            </h3>
            <p className="text-gray-600">やめることで得られた成果が一目でわかります。</p>
          </div>
        </div>

        <div className="flex items-start space-x-4 group">
          <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
            <Target className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2 group-hover:text-yellow-600 transition-colors">
              目標設定と達成度管理
            </h3>
            <p className="text-gray-600">具体的な目標を設定し、達成度を可視化します。</p>
          </div>
        </div>
        <div className="flex items-start space-x-4 group">
          <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
            <Trophy className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
              達成バッジとモチベーション
            </h3>
            <p className="text-gray-600">
              目標達成時にバッジを獲得し、モチベーションを維持します。
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <div className="inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
          今後のアップデート予定
        </div>
        <div className="space-y-8">
          <div className="flex items-start space-x-4 group">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                詳細な統計と分析
              </h3>
              <p className="text-gray-600">継続状況や節約効果をグラフで確認できます。</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 group">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <Bot className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                AIアシスト機能
              </h3>
              <p className="text-gray-600">
                AIがあなたの継続をサポートし、モチベーションを維持するためのアドバイスを提供します。
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 group">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                バディ機能
              </h3>
              <p className="text-gray-600">
                同じ目標を持つ仲間と励まし合い、一緒に目標達成を目指します。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
