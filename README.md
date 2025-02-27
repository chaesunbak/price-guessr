# Price Guessr

Price Guessr는 사용자가 다양한 제품의 가격을 추측하는 재미있는 게임입니다. 실제 가격에 가까울수록 더 많은 점수를 얻을 수 있으며, 자신의 가격 감각을 테스트하고 향상시킬 수 있습니다.

## 주요 기능

- **가격 맞추기 게임**: 인터넷에서 수집한 실제 데이터를 기반으로 물건 가격 맞추기 게임을 진행할 수 있습니다.
- **점수 시스템**: 추측의 정확도에 따라 점수가 계산됩니다. 정확도가 높을수록 더 많은 점수를 얻습니다. 리더보드에 자신의 점수를 기록할 수 있습니다.
- **애니메이션 효과**: Framer Motion을 활용한 부드러운 애니메이션으로 사용자 경험을 향상시켰습니다.
- **반응형 디자인**: 모든 디바이스에서 최적화된 경험을 제공합니다.

## 기술 스택

- **프레임워크**: Next.js
- **스타일링**: Tailwind CSS
- **애니메이션**: Framer Motion
- **UI 컴포넌트**: Shadcn UI

## 로컬에서 구동하기

### 사전 요구사항

- Node.js 18.0.0 이상
- npm, yarn, pnpm 또는 bun 패키지 매니저

### 설치 및 실행

1. 저장소를 클론합니다:

   ```bash
   git clone https://github.com/yourusername/price-guessr.git
   cd price-guessr
   ```

2. 의존성을 설치합니다:

   ```bash
   npm install
   # 또는
   yarn install
   # 또는
   pnpm install
   # 또는
   bun install
   ```

3. 크롤러 디렉토리로 이동합니다:

   ```bash
   cd crawler
   ```

4. 크롤러 의존성을 설치합니다:

   ```bash
   npm install
   # 또는
   yarn install
   # 또는
   pnpm install
   # 또는
   bun install
   ```

5. 크롤러를 실행합니다: (수집된 데이터는 `/public/data` 디렉토리에 저장됩니다.)

   ```bash
   npm run start
   # 또는
   yarn start
   # 또는
   pnpm start
   # 또는
   bun start
   ```

6. 루트 디렉토리로 돌아갑니다:

   ```bash
   cd ..
   ```

7. 개발 서버를 실행합니다:

   ```bash
   npm run dev
   # 또는
   yarn dev
   # 또는
   pnpm dev
   # 또는
   bun dev
   ```

8. 브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 애플리케이션을 확인합니다.

### 빌드 및 배포

프로덕션 빌드를 생성하려면:

```bash
npm run build
# 또는
yarn build
# 또는
pnpm build
# 또는
bun build
```

빌드된 애플리케이션을 로컬에서 실행하려면:

```bash
npm run start
# 또는
yarn start
# 또는
pnpm start
# 또는
bun start
```
