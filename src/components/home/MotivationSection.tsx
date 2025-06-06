export default function MotivationSection() {
  const currentHour = new Date().getHours();

  // 時間帯に応じたメッセージ
  const getTimeBasedMessage = () => {
    if (currentHour < 6) {
      return '夜更かしお疲れさまです。無理をせず、早めに休んでくださいね。';
    } else if (currentHour < 12) {
      return 'おはようございます！今日も一歩ずつ前進していきましょう。';
    } else if (currentHour < 18) {
      return 'お疲れさまです。午後も自分のペースで頑張りましょう。';
    } else {
      return '一日お疲れさまでした。今日の頑張りを振り返ってみませんか？';
    }
  };

  const motivationalQuotes = [
    {
      quote: '成功とは、失敗から失敗へと、情熱を失うことなく進むことである',
      author: 'ウィンストン・チャーチル',
    },
    {
      quote: '偉大な業績を成し遂げる唯一の方法は、自分の仕事を愛することだ',
      author: 'スティーブ・ジョブズ',
    },
    { quote: '未来は、今日何をするかにかかっている', author: 'マハトマ・ガンディー' },
    { quote: '夢を見ることができれば、それを実現することもできる', author: 'ウォルト・ディズニー' },
    { quote: '千里の道も一歩から', author: '老子' },
    { quote: '困難の中に、機会がある', author: 'アルベルト・アインシュタイン' },
    { quote: '成功の秘訣は、始めることにある', author: 'マーク・トウェイン' },
    { quote: '昨日は歴史、明日は謎、今日は贈り物', author: 'エレノア・ルーズベルト' },
    {
      quote: '小さなことを積み重ねることが、とんでもないところに行くただ一つの道',
      author: 'イチロー',
    },
    { quote: '変化を望むなら、自分自身がその変化になれ', author: 'マハトマ・ガンディー' },
    {
      quote:
        '人生で最も輝かしい時は、いわゆる栄光の瞬間ではなく、挫折や絶望の中で人生への挑戦と未来への完遂への展望がわき上がる時なのだ',
      author: 'ギュスターヴ・フローベール',
    },
    { quote: '自分を変えることができるのは自分だけである', author: 'ネルソン・マンデラ' },
  ];

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 text-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">{getTimeBasedMessage()}</h2>

      <blockquote className="text-gray-600 italic text-sm border-l-4 border-blue-300 pl-4 py-2 bg-white bg-opacity-50 rounded">
        <p className="mb-2">&quot;{randomQuote.quote}&quot;</p>
        <cite className="text-xs text-gray-500 not-italic">— {randomQuote.author}</cite>
      </blockquote>

      <div className="mt-4 text-xs text-gray-500">
        継続は力なり - あなたの努力は必ず実を結びます
      </div>
    </div>
  );
}
