# YCHStudio 개발자 웹사이트

Public developer website and app-ads.txt for Evistory.

## 앱 추가 방법

1. 프로덕션 출시를 확인한 앱만 소개합니다. 현재는 **에브스토리만 공개**합니다.
   마주마음은 비공개 테스트 중이며 프로덕션 전환 후 별도로 추가합니다.
2. `assets/`에 앱 아이콘을 넣습니다.
3. `apps.json`의 기존 항목을 복사해 ID, 이름, 설명, 아이콘 경로, 기능 목록,
   데이터 안내, Google Play 주소와 해당 앱의 개인정보처리방침 주소를 수정합니다.
4. `published: true`인 항목만 페이지에 표시됩니다. 배열 순서가 카드 표시 순서입니다.
   공개 저장소이므로 `false` 항목에도 비밀 정보를 넣지 않습니다.
5. 아래 명령으로 정적 HTML을 생성·확인하고 변경 파일을 커밋·푸시합니다.

```sh
node scripts/build.mjs
node scripts/build.mjs --check
```

공통 화면은 `templates/index.html`, 디자인은 `styles.css`에서 관리합니다.
**생성된 `index.html`은 직접 수정하지 않습니다.** 방문자는 JavaScript 없이
앱 소개와 링크를 이용할 수 있습니다. 별도 패키지 설치는 필요하지 않습니다.
앱 수에 맞춰 데스크톱 최대 2열, 모바일 1열로 자동 배치합니다.

개인정보처리방침은 앱마다 별도로 연결합니다. `app-ads.txt`는 앱 카드 추가 시
변경하거나 이동하지 않습니다. 새 앱은 별도로 AdMob 스토어 연결·인증을 확인합니다.

## 운영 정보

- Repository: https://github.com/katimere15/katimere15.github.io
- Website: https://katimere15.github.io/
- Advertising authorization: https://katimere15.github.io/app-ads.txt
- Local source: `C:\project\dailmi\website`

Publish the `main` branch root using GitHub Pages. `.nojekyll` keeps the site static.
Only public website content belongs in this repository. No credentials or app user data.

Evistory's Google Play store contact website must point to the website above.
The privacy policy remains managed separately in `dailmi/evistory/privacy` and
published at https://katimere15.github.io/dailmi-evistory-privacy/.

After publication, verify that `/app-ads.txt` returns the exact Google publisher
record shown in AdMob, then request an update check in AdMob. Website publication,
app-ads.txt verification, and AdMob app readiness review are separate steps.
