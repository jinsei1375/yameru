import { Heart, Star, Smile } from 'lucide-react';

export default function MotivationSection() {
  const currentHour = new Date().getHours();
  
  // 時間帯に応じたメッセージ
  const getTimeBasedMessage = () => {
    if (currentHour < 6) {
      return "夜更かしお疲れさまです。無理をせず、早めに休んでくださいね。";
    } else if (currentHour < 12) {
      return "おはようございます！今日も一歩ずつ前進していきましょう。";
    } else if (currentHour < 18) {
      return "お疲れさまです。午後も自分のペースで頑張りましょう。";
    } else {
      return "一日お疲れさまでした。今日の頑張りを振り返ってみませんか？";
    }
  };

  const motivationalQuotes = [
    "小さな一歩も、続けることで大きな変化を生みます",
    "完璧である必要はありません。継続することが大切です",
    "今日のあなたは、昨日のあなたより成長しています",
    "挫折は成長のための重要なステップです",
    "自分を信じて、今日もできることから始めましょう"
  ];

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 text-center">
      <div className="flex justify-center mb-4">
        <div className="flex space-x-2">
          <Heart className="text-pink-500" size={20} />
          <Star className="text-yellow-500" size={20} />
          <Smile className="text-green-500" size={20} />
        </div>
      </div>
      
      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        {getTimeBasedMessage()}
      </h2>
      
      <blockquote className="text-gray-600 italic text-sm border-l-4 border-blue-300 pl-4 py-2 bg-white bg-opacity-50 rounded">
        "{randomQuote}"
      </blockquote>
      
      <div className="mt-4 text-xs text-gray-500">
        継続は力なり - あなたの努力は必ず実を結びます
      </div>
    </div>
  );
}
