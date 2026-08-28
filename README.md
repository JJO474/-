# 배이플스토리 GitHub Pages + Firebase 실시간 공유

이 폴더는 GitHub Pages에 바로 올릴 수 있는 정적 홈페이지입니다. 학생 EXP, 팀 설정, 강화 상태 등 `sneage3`에 저장되는 핵심 데이터가 Firebase Realtime Database를 통해 접속자 사이에서 자동 동기화됩니다.

## 1. Firebase 설정

1. [Firebase Console](https://console.firebase.google.com/)에서 프로젝트를 만듭니다.
2. 프로젝트 개요에서 **웹 앱(</>) 추가**를 누릅니다.
3. **빌드 > Realtime Database > 데이터베이스 만들기**를 선택합니다.
4. 생성된 데이터베이스의 **규칙** 탭에서 `database.rules.json` 내용을 붙여넣고 게시합니다.
5. **프로젝트 설정 > 내 앱 > SDK 설정 및 구성 > 구성**에 표시되는 값을 `firebase-config.js`에 복사합니다.
6. 특히 `databaseURL`은 Realtime Database 화면에 표시된 실제 URL과 정확히 같아야 합니다.

> 현재 규칙은 링크를 아는 사람이 읽고 쓸 수 있는 수업용 간편 공유 설정입니다. 개인정보나 민감한 자료는 넣지 마세요. 외부 공개를 막으려면 Firebase Authentication을 추가해야 합니다.

## 2. GitHub에 올리기

저장소 최상위에 이 폴더 안의 파일을 모두 올립니다. 핵심 파일명은 반드시 `index.html`이어야 합니다.

```text
index.html
firebase-config.js
firebase-sync.js
database.rules.json
.nojekyll
README.md
```

GitHub 저장소에서 다음을 설정합니다.

1. **Settings > Pages**로 이동합니다.
2. **Build and deployment > Source**에서 `Deploy from a branch`를 선택합니다.
3. Branch는 `main`, 폴더는 `/(root)`를 선택하고 저장합니다.
4. 배포가 끝나면 `https://사용자명.github.io/저장소명/` 주소로 접속합니다.

## 3. 확인 방법

1. 배포 주소를 PC와 휴대폰에서 각각 엽니다.
2. 한쪽에서 EXP를 변경합니다.
3. 다른 쪽 화면이 새로고침 없이 바뀌고 오른쪽 아래에 `실시간 동기화됨`이 표시되는지 확인합니다.

## 동기화 방식과 주의점

- 여러 사람이 동시에 수정하면 가장 마지막에 저장된 전체 상태가 기준이 됩니다.
- 인터넷이 끊기면 현재 브라우저에는 계속 저장되며, 연결 복구 시 다시 동기화합니다.
- 로그인 화면의 기존 아이디·비밀번호는 HTML 안에 들어 있는 화면 잠금 수준입니다. 중요한 개인정보 보호용 인증 수단은 아닙니다.
- Firebase 설정이 비어 있으면 홈페이지는 기존처럼 로컬 저장 방식으로 정상 작동합니다.
