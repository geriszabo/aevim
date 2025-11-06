# TODO List

## Features Improvements

### New Features

- [ ] Progress Charts: Visualize strength gains over time (weight lifted, volume, reps)
- [ ] Personal Records (PRs): Track max weight, max reps, best time for each exercise
- [ ] Volume Tracking: Total volume (weight × reps) per workout/week/month
- [ ] Workout Frequency: Calendar view showing workout days
- [ ] Exercise Progress: Line charts for individual exercises showing progression
- [ ] Bodyweight Progress: Track bodyweight changes over time (if user inputs it)
- [ ] Workout Streaks: Calculate actual workout streaks (currently hardcoded)
- [ ] Muscle Group Distribution: Pie chart showing which muscle groups are trained most

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
- [x] Refactor sets metrics
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
- [ ] Clean up
  - [x] Move DELETE /workouts/:id to completeWorkouts and rename accordingly
  - [x] Delete /workouts/:id and replace the path in the FE hooks
  - [x] Rename deleteWorkoutById to deleteCompleteWorkoutById
  - [x] Delete getWorkout, hook, and delete endpoint: GET /workouts/:id
  - [x] Delete useCreateExerciseToWorkout, postExerciseToWorkout and endpoint: POST workouts/:id/exercises
  - [x] Delete useDeleteExerciseOfWorkout, deleteExerciseOfWorkout, endpoint: DELETE workouts/:id/exercises/:exerciseId
  - [x] Delete useGetExercisesToWorkout, getExercisesToWorkout, endpoint: GET workouts/:id/exercises/:exerciseId
  - [x] Delete useCreateWorkout, postWorkout, endpoint: POST workouts/
  - [x] Delete useUpdateWorkout, putWorkout, endpoint: PUT /workouts/:id
  - [x] Delete all unused exercise endpoints: POST/GET/PUT/DELETE /exercises
  - [x] Fix failing tests that depend on deleted endpoints
  - [ ] Remove test helper functions for deleted endpoints

## 🎨 Frontend Improvements

### Pages

- [ ] Delete workouts/[id] because its not needed anymore
- [ ] Convert Dashboard to SSR where possible

### Components

- [x] Delete EditWorkoutDialog after implementing update workout page
- [ ] Forms sometime use PageContainer / ContentContainer rationalise the use of these containers

### Hooks

- [ ] Move workoutOverview api call and hook to completeWorkouts folder inside hooks
- [ ] Check all hooks if they are necessary, remove whats not needed
- [ ] Rename hooks / api functions to be more appropriate

## 🧪 Testing & Quality

### Testing

- [ ] Add frontend tests

## 🔒 Security & Auth

### Authentication

- [ ] Add BetterAuth sometime
