export default function FeaturesSection() {
  return (
    <section className="max-w-4xl mx-auto px-4 text-left space-y-10">
      {/* 現在の機能 */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">主な機能</h2>
        <ul className="space-y-4">
          <li>
            <h3 className="text-lg font-medium">📝 やめたい行動を記録</h3>
            <p>何を、いつからやめているのかをカウントします。</p>
          </li>
          <li>
            <h3 className="text-lg font-medium">⏳ 継続日数を自動カウント</h3>
            <p>やめ続けている日数をリアルタイムで表示します。</p>
          </li>
          <li>
            <h3 className="text-lg font-medium">💰 節約した時間・お金を可視化</h3>
            <p>やめることで得られた成果が一目でわかります。</p>
          </li>
        </ul>
      </div>

      {/* 今後の予定 */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">今後のアップデート予定</h2>
        <ul className="space-y-4">
          <li>
            <h3 className="text-lg font-medium">🎯 やめる理由・目標の記入</h3>
            <p>自分自身の目的を可視化し、やめるモチベーションを高めます。</p>
          </li>
          <li>
            <h3 className="text-lg font-medium">🎁 報酬リスト管理</h3>
            <p>やめられたご褒美を事前に設定して、楽しみながら継続。</p>
          </li>
          <li>
            <h3 className="text-lg font-medium">📓 衝動ログ</h3>
            <p>やめたくなる瞬間を記録し、パターンを可視化します。</p>
          </li>
          <li>
            <h3 className="text-lg font-medium">🧑‍🤝‍🧑 バディ機能</h3>
            <p>一緒にがんばる仲間とつながることで挫折を防ぎます。</p>
          </li>
          {/* <li>
            <h3 className="text-lg font-medium">🚫 アクセスブロック</h3>
            <p>やめたい行動を誘発するサイト・アプリへのアクセスを制限。</p>
          </li> */}
          <li>
            <h3 className="text-lg font-medium">🤖 AIサポート（予定）</h3>
            <ul className="ml-5 list-disc text-sm space-y-1">
              <li>衝動パターンの分析</li>
              <li>代替行動の提案</li>
            </ul>
          </li>
        </ul>
      </div>
    </section>
  );
}
