import { firebaseConfig, syncRoom } from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';
import {
  getDatabase,
  ref,
  onValue,
  set,
  onDisconnect,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js';

const MAIN_STORAGE_KEY = 'sneage3';
const CLIENT_ID_KEY = 'baeipleFirebaseClientId';
const clientId = sessionStorage.getItem(CLIENT_ID_KEY) || crypto.randomUUID();
sessionStorage.setItem(CLIENT_ID_KEY, clientId);

let applyingRemote = false;
let connected = false;
let uploadTimer = 0;
const originalSetItem = Storage.prototype.setItem;

function configReady() {
  return firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('여기에_') &&
    firebaseConfig.databaseURL && !firebaseConfig.databaseURL.includes('여기에_');
}

function addStatusBadge() {
  const badge = document.createElement('div');
  badge.id = 'firebaseSyncStatus';
  badge.setAttribute('role', 'status');
  badge.textContent = configReady() ? '● 실시간 연결 중' : '○ Firebase 설정 필요';
  Object.assign(badge.style, {
    position: 'fixed', right: '14px', bottom: '14px', zIndex: '2147483647',
    padding: '8px 12px', borderRadius: '999px', font: '700 12px Arial',
    color: '#fff', background: configReady() ? '#8a6d2f' : '#9b3e4b',
    border: '1px solid rgba(255,255,255,.25)', boxShadow: '0 5px 16px #0008'
  });
  document.body.appendChild(badge);
  return badge;
}

const badge = addStatusBadge();
if (!configReady()) {
  console.info('[배이플스토리] firebase-config.js 설정 후 실시간 동기화가 시작됩니다.');
} else {
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const stateRef = ref(database, `rooms/${syncRoom}/state`);
  const presenceRef = ref(database, `rooms/${syncRoom}/presence/${clientId}`);

  function updateBadge(text, color) {
    badge.textContent = text;
    badge.style.background = color;
  }

  async function uploadLocalState() {
    if (applyingRemote) return;
    const raw = localStorage.getItem(MAIN_STORAGE_KEY);
    if (!raw) return;
    try {
      await set(stateRef, {
        data: JSON.parse(raw),
        updatedAt: serverTimestamp(),
        updatedBy: clientId
      });
      updateBadge('● 실시간 동기화됨', '#247a4a');
    } catch (error) {
      updateBadge('! 동기화 오류', '#a13c47');
      console.error('[배이플스토리] Firebase 저장 실패:', error);
    }
  }

  function queueUpload() {
    clearTimeout(uploadTimer);
    uploadTimer = setTimeout(uploadLocalState, 180);
  }

  Storage.prototype.setItem = function (key, value) {
    originalSetItem.call(this, key, value);
    if (this === localStorage && key === MAIN_STORAGE_KEY && !applyingRemote) queueUpload();
  };

  onValue(stateRef, snapshot => {
    connected = true;
    const remote = snapshot.val();
    if (!remote?.data) {
      uploadLocalState();
      return;
    }
    if (remote.updatedBy === clientId) {
      updateBadge('● 실시간 동기화됨', '#247a4a');
      return;
    }
    applyingRemote = true;

const normalizedData = {
  ...remote.data,
  names: Array.isArray(remote.data.names)
    ? remote.data.names
    : ['쪼치원', '오치원'],

  p: Array.isArray(remote.data.p)
    ? remote.data.p
    : [],

  l: Array.isArray(remote.data.l)
    ? remote.data.l
    : [],

  bonus: Array.isArray(remote.data.bonus)
    ? remote.data.bonus
    : [0, 0],

  master: Number(remote.data.master ?? 36000),
  masterRun: Boolean(remote.data.masterRun)
};

originalSetItem.call(
  localStorage,
  MAIN_STORAGE_KEY,
  JSON.stringify(normalizedData)
);

try {
  d = normalizedData;
      if (typeof render === 'function') render();
      updateBadge('● 새 데이터 수신', '#246b88');
    } catch (error) {
      console.error('[배이플스토리] 화면 갱신 실패:', error);
      location.reload();
    } finally {
      applyingRemote = false;
    }
  }, error => {
    connected = false;
    updateBadge('! Firebase 연결 실패', '#a13c47');
    console.error('[배이플스토리] Firebase 수신 실패:', error);
  });

  set(presenceRef, { online: true, connectedAt: serverTimestamp() });
  onDisconnect(presenceRef).remove();
  window.addEventListener('online', () => connected ? queueUpload() : location.reload());
}
