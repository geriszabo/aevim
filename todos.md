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
  - [ ] Modify sets table: replace weight, duration, distance columns with single value column
  - [ ] Create and run migration script to convert existing data
  - [ ] Update Set interface in packages/shared-types/set.ts
  - [ ] Update all related types that reference sets (workout, exercise types)
  - [ ] Update all database queries in apps/backend/src/db/queries/
  - [ ] Update route handlers and validation schemas
  - [ ] Update form components to use value field instead of separate fields
  - [ ] Update API hooks and data transformation logic
  - [ ] Test migration on staging, update tests, deploy to production

## 🎨 Frontend Improvements

### Components

- [ ] Delete EditWorkoutDialog after implementing update workout page

### Hooks

- [ ] Move workoutOverview api call and hook to completeWorkouts folder inside hooks

## 🧪 Testing & Quality

### Testing

- [ ] Add frontend tests

## 🔒 Security & Auth

### Authentication

- [ ] Add BetterAuth sometime
