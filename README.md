# Digital Mental Wellness Check-in Platform

Privacy-first, anonymous, student-focused MERN app with:

- UUID-based anonymous users
- JWT-backed anonymous sessions
- Mood check-ins with optional journal notes
- Rule-based suggestions
- Exam and assignment tracking
- Mood analytics and community insights
- Aggregate-only public statistics with privacy thresholds

## Folder Structure

```text
autonomous/
  backend/
    src/
      config/
        db.js
      controllers/
        authController.js
        checkInController.js
        communityController.js
        dashboardController.js
        suggestionController.js
        taskController.js
      middleware/
        authenticateAnonymous.js
        validateRequest.js
      models/
        CheckIn.js
        Task.js
        User.js
      routes/
        authRoutes.js
        checkInRoutes.js
        communityRoutes.js
        dashboardRoutes.js
        suggestionRoutes.js
        taskRoutes.js
      utils/
        AppError.js
        asyncHandler.js
        checkInService.js
        jwt.js
        moodAnalytics.js
        suggestionEngine.js
      validators/
        authValidators.js
        checkInValidators.js
        taskValidators.js
      server.js
    .env.example
    package.json
  frontend/
    public/
      index.html
    src/
      components/
      pages/
      state/
      api.js
      App.js
      index.js
      styles.css
    .env.example
    package.json
  README.md
```

## Required Dependencies

### Backend

- express
- mongoose
- cors
- dotenv
- uuid
- jsonwebtoken
- helmet
- express-rate-limit
- express-validator
- nodemon

### Frontend

- react
- react-dom
- react-router-dom
- react-chartjs-2
- chart.js
- react-scripts

## Environment Variables

### `backend/.env`

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/mental-wellness
CLIENT_URL=http://localhost:3000
NODE_ENV=development
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=30d
COMMUNITY_MIN_SAMPLE_SIZE=5
```

### `frontend/.env`

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Privacy-First Design

- The app stores only an anonymous UUID and product preferences.
- No names, emails, phone numbers, student IDs, or other direct identifiers are collected.
- Protected routes use signed JWTs instead of trusting a client-provided anonymous ID.
- Community endpoints expose only aggregate mood counts and percentages.
- Daily public summaries are hidden until the minimum anonymous sample size is reached.
- Community insights only include users who allow aggregation.

## Basic Security Practices

- `helmet` for common HTTP security headers
- `express-rate-limit` to reduce abuse and scraping pressure
- `express-validator` for request validation
- JWT bearer auth for anonymous sessions
- Centralized error handling for token, validation, and database errors

## API Overview

- `POST /api/auth/anonymous`
- `GET /api/check-ins`
- `POST /api/check-ins`
- `GET /api/check-ins/:id`
- `PUT /api/check-ins/:id`
- `DELETE /api/check-ins/:id`
- `GET /api/dashboard`
- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:id/toggle`
- `GET /api/community/insights`
- `POST /api/suggestions`

Authenticated routes expect:

```http
Authorization: Bearer <anonymous-jwt>
```

## Example Responses

### Create anonymous session

`POST /api/auth/anonymous`

```json
{
  "message": "Anonymous session created.",
  "data": {
    "anonymousId": "d9d91b3c-903f-4f58-9b9f-79d0ea1eb5f2",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "preferences": {
      "allowCommunityAggregation": true
    }
  }
}
```

### Create mood entry

`POST /api/check-ins`

Request:

```json
{
  "mood": "stressed",
  "journalNote": "Exam week is close and I slept badly."
}
```

Response:

```json
{
  "message": "Mood entry created.",
  "data": {
    "_id": "661d31c7a82db28d03781d72",
    "userId": "661d2f98a82db28d03781d5e",
    "mood": "stressed",
    "journalNote": "Exam week is close and I slept badly.",
    "suggestions": [
      "Try a 4-4-4 breathing cycle for 5 minutes before restarting work.",
      "Pick one study block of 25 minutes instead of tackling everything at once."
    ],
    "createdAt": "2026-04-15T09:00:00.000Z",
    "updatedAt": "2026-04-15T09:00:00.000Z"
  }
}
```

### Community insights

`GET /api/community/insights`

```json
{
  "message": "Community insights fetched.",
  "data": {
    "totalCheckIns": 42,
    "moodBreakdown": {
      "happy": 10,
      "neutral": 14,
      "stressed": 12,
      "sad": 6
    },
    "today": {
      "totalCheckIns": 10,
      "moodBreakdown": {
        "happy": 1,
        "neutral": 1,
        "stressed": 7,
        "sad": 1
      },
      "stressedPercent": 70,
      "publicSummary": "70% of users feel stressed today",
      "isPublicSampleReady": true
    }
  }
}
```

### Mood analytics output

`GET /api/dashboard`

```json
{
  "analytics": {
    "weeklyTrend": [
      {
        "date": "2026-04-14",
        "label": "Tue 14",
        "moodCounts": {
          "happy": 1,
          "neutral": 0,
          "stressed": 2,
          "sad": 0
        },
        "total": 3
      }
    ],
    "monthlyDistribution": {
      "month": "Apr",
      "moodCounts": {
        "happy": 4,
        "neutral": 6,
        "stressed": 9,
        "sad": 2
      },
      "total": 21
    },
    "mostFrequentMood": {
      "mood": "stressed",
      "count": 9
    },
    "moodVsExamCorrelation": {
      "nearExam": {
        "happy": 1,
        "neutral": 2,
        "stressed": 6,
        "sad": 1
      },
      "noExamNearby": {
        "happy": 3,
        "neutral": 4,
        "stressed": 3,
        "sad": 1
      }
    },
    "insights": [
      "User is mostly stressed on Monday.",
      "Most frequent mood this period is stressed.",
      "Stress appears higher when exams are within the next 3 days."
    ]
  }
}
```

## Rule-Based Suggestion Engine

`POST /api/suggestions`

Request:

```json
{
  "mood": "stressed",
  "journalNote": "Exam tomorrow and I feel tired."
}
```

Response:

```json
{
  "message": "Suggestions generated.",
  "data": {
    "mood": "stressed",
    "journalNote": "Exam tomorrow and I feel tired.",
    "suggestions": [
      "Try a 4-4-4 breathing cycle for 5 minutes before restarting work.",
      "Pick one study block of 25 minutes instead of tackling everything at once.",
      "Energy may be affecting your mood. Consider rest, hydration, and a lighter study sprint.",
      "Try active recall or one timed practice set instead of rereading notes passively."
    ]
  }
}
```

## Testing Plan

### Unit tests

- `suggestionEngine`: stressed, sad, happy, workload, and note-based rules
- `jwt`: valid token, invalid token, expired token
- `authenticateAnonymous`: missing bearer token, wrong scope, deleted user, valid token
- `communityController`: safe aggregate totals, privacy threshold hiding, stressed percentage math
- validators: invalid mood, invalid event type, invalid dates, long journal note

### Manual test cases

1. Create an anonymous session and verify both `anonymousId` and `token` are returned.
2. Call `GET /api/dashboard` without a token and verify `401`.
3. Create mood entries with each mood and verify suggestions are stored correctly.
4. Create exam events within 3 days and verify stress-related suggestions and analytics react.
5. Create at least 5 anonymous check-ins today and verify the public summary appears.
6. Keep the sample below `COMMUNITY_MIN_SAMPLE_SIZE` and verify the summary is hidden.
7. Set `allowCommunityAggregation` to `false` for a user and verify their moods are excluded from community stats.
8. Submit invalid payloads and verify `400` validation responses.
9. Reset the frontend session and verify protected pages stop working until a new session is created.

## Deployment Steps

### MongoDB Atlas

1. Create an Atlas cluster and database user.
2. Add an IP access rule for your deployment provider.
3. Copy the Atlas connection string into `MONGODB_URI`.
4. Use a strong random `JWT_SECRET`.

Official docs:
- https://www.mongodb.com/docs/current/tutorial/getting-started/

### Backend on Render

1. Push the repository to GitHub.
2. Create a new Render Web Service for the backend.
3. Set the build command to `npm install`.
4. Set the start command to `npm start`.
5. Add environment variables:
   `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`, `COMMUNITY_MIN_SAMPLE_SIZE`, `NODE_ENV`
6. Deploy and verify `GET /api/health`.

### Frontend on Vercel

1. Import the frontend app into Vercel.
2. Set `REACT_APP_API_URL` to your backend URL plus `/api`.
3. Deploy and verify anonymous session creation, dashboard loading, and community summaries.

Official docs:
- https://vercel.com/docs/environment-variables/system-environment-variables

### Alternative frontend on Render

1. Create a static site for the frontend.
2. Build with `npm install && npm run build`.
3. Publish the `build` directory.
4. Set `REACT_APP_API_URL` before deploying.
