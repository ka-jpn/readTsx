// 別のTSXファイルを相対パスでインポート可能
import { MyButton } from './components/Button.tsx';

const isPremiumUser = false;
const handleHello = () => alert("動的にトランスパイルしたTSXのボタンが押されました！");

const app = (
  <div style="text-align:center;">
    <h1>メイン画面</h1>
    <div>ボタンアクションテスト</div>
    <div>(コンポーネントのイベントのテスト)</div>
    <div>ボタンを押してダイアログが表示されればOK</div>
    {/* 自作コンポーネント関数の呼び出し */}
    {MyButton({ label: "ダイアログを表示する", onClick: handleHello })}
    <div style="height:30px;"></div>
    <div>アイテムリストテスト</div>
    <div>(ネストされた要素とfalseの要素のテスト)</div>
    <div>3つアイテムが表示され、false表示がなければOK</div>
    {/* 配列のループ展開可能 */}
    <ul style="margin:0;width:80px;place-self:center;">
      {["リンゴ", "バナナ", "ミカン"].map(item => <li>{item}</li>)}
    </ul>

    {/* falseの文字が画面に出ない */}
    {isPremiumUser && <div class="badge">プレミアム</div>}
  </div>
);

document.body.append(app);
