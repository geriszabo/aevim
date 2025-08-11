# TODO List

## 🫩 Shared Improvements

### Types

- [ ] Fix in apps/backend/src/db/schemas/complete-workout-schema.ts: createCompleteWorkoutSchema points to node modules
- [ ] Move setSchema from apps/backend/src/db/schemas/set-schema.ts to shared
- [ ] Add setSchema to all related schemas to keep single source of truth:
  - [ ] packages/shared-types/schemas/complete-workout-schema.ts

## 🔧 Backend Improvements

### API Endpoints

- [ ] Create completeWorkouts route
- [ ] Move workouts/create to completeWorkouts route (PUT & POST)

## 🎨 Frontend Improvements

### Components

- [ ] Delete EditWorkoutDialog after implementing update workout page

## 🧪 Testing & Quality

### Testing

- [ ] Add frontend tests

## 🔒 Security & Auth

### Authentication

- [ ] Add BetterAuth sometime
