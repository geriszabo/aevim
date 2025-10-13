# TODO List

## 🫩 Shared Improvements

### Types

- [x] Fix in apps/backend/src/db/schemas/complete-workout-schema.ts: createCompleteWorkoutSchema points to node modules
- [ ] Move setSchema from apps/backend/src/db/schemas/set-schema.ts to shared
- [ ] Add setSchema to all related schemas to keep single source of truth:
  - [ ] packages/shared-types/schemas/complete-workout-schema.ts

## 🔧 Backend Improvements

### API Endpoints

- [x] Create completeWorkouts route
- [x] Move workouts/create and / or workouts/overview to completeWorkouts route (PUT & POST)
- [ ] Remove newWorkout temporary variable that gets returned in /completeWorkouts/:id
- [ ] Refactor sets metrics
  - [x] Modify sets table: replace weight, duration, distance columns with single value column
  - [x] Update Set interface in packages/shared-types/set.ts
  - [x] Update all related types that reference sets (workout, exercise types)
  - [x] Update all database queries in apps/backend/src/db/queries/
  - [x] Update route handlers and validation schemas
  - [x] Update form components to use value field instead of separate fields
  - [x] Update API hooks and data transformation logic
  - [x] Update tests to use new metric_value property
- [ ] Extend complete workout api with workout id
- [ ] Make sets able to accept reps only as metrics

## 🎨 Frontend Improvements

### Components

- [x] Delete EditWorkoutDialog after implementing update workout page
- [ ] Forms sometime use PageContainer / ContentContainer rationalise the use of these containers

### Hooks

- [ ] Move workoutOverview api call and hook to completeWorkouts folder inside hooks
- [ ] Check all hooks if they are necessary, remove whats not needed

## 🧪 Testing & Quality

### Testing

- [ ] Add frontend tests

## 🔒 Security & Auth

### Authentication

- [ ] Add BetterAuth sometime
