"use client";

import { FormInputField } from "@/components/Form/FormInputField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { WorkoutFormValues } from "@/types/form";
import exercises from "@aevim/shared-types/exercises.json";
import { ExerciseData } from "@aevim/shared-types/schemas/exercise-schema";
import { Trash2 } from "lucide-react";
import {
  Control,
  Controller,
  FieldErrors,
  useFieldArray,
  UseFieldArrayRemove,
  useFormContext,
  UseFormGetValues,
  UseFormRegister,
  useWatch,
} from "react-hook-form";

import { ExerciseCardSetRow } from "../../../components/ExerciseCard/ExerciseCardSetRow";
import { ExerciseSelectComboBox } from "./ExerciseSelectCombobox";
import { SetMetrics } from "@aevim/shared-types";
import { toSentenceCase } from "@/lib/utils";

interface CreateExerciseDataFormProps {
  register: UseFormRegister<WorkoutFormValues>;
  errors: FieldErrors<ExerciseData>;
  control: Control<WorkoutFormValues>;
  id: number;
  onDelete: UseFieldArrayRemove;
  onNewSetAppending: UseFormGetValues<WorkoutFormValues>;
}

export const CreateExerciseDataForm = ({
  control,
  errors,
  register,
  onDelete,
  id,
  onNewSetAppending,
}: CreateExerciseDataFormProps) => {
  const {
    fields: setFields,
    append: appendSet,
    remove: removeSet,
    replace: replaceSets,
  } = useFieldArray({
    control,
    name: `exercises.${id}.sets`,
  });

  const handleAddSet = () => {
    const data = onNewSetAppending();
    const sets = data.exercises[id].sets;
    const lastSet = sets[sets.length - 1];

    appendSet({
      reps: lastSet?.reps ?? 0,
      metric_value: lastSet?.metric_value ?? 0,
    });
  };
  const exerciseId = useWatch({
    control,
    name: `exercises.${id}.code`,
  });
  const exercise = exercises.find((ex) => ex.id === exerciseId);
  const metric = exercise?.metrics;
  const { setValue } = useFormContext<WorkoutFormValues>();

  const handleExerciseSelect = (
    selectedExerciseId: string,
    exerciseName: string
  ) => {
    const selectedExercise = exercises.find(
      (ex) => ex.id === selectedExerciseId
    );
    if (!selectedExercise) return;

    setValue(`exercises.${id}.name`, exerciseName);
    setValue(`exercises.${id}.code`, selectedExerciseId);
    setValue(`exercises.${id}.metric`, selectedExercise?.metrics);
    replaceSets([
      { reps: "" as unknown as number, metric_value: "" as unknown as number },
    ]);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between">
          <Typography variant="heading" size="lg">
            Exercise nr. {id + 1}
          </Typography>
          <Button
            className="ml-auto"
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => onDelete()}
          >
            <Trash2 className="text-red-600" />
          </Button>
        </div>
        <Controller
          control={control}
          name={`exercises.${id}.name`}
          render={({ field: { value } }) => (
            <ExerciseSelectComboBox
              value={value}
              onChangeValue={handleExerciseSelect}
              exerciseList={exercises}
            />
          )}
        />
        <FormInputField
          id={`exercises.${id}.category`}
          label="Exercise category"
          type="text"
          register={register}
          placeholder="cardio"
          error={errors.category}
        />
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <div className="grid grid-cols-5 gap-2 text-xs text-muted-foreground font-medium px-2 items-center">
            <span>Set</span>
            <span>Reps</span>
            <span>{metric === "reps" ? "" : toSentenceCase(metric)}</span>

            <Button
              variant="outline"
              size="icon"
              className="h-6 ml-auto col-span-2"
              onClick={handleAddSet}
              type="button"
            >
              +
            </Button>
          </div>
          {setFields.map((field, index) => (
            <ExerciseCardSetRow
              key={field.id}
              register={register}
              exerciseIndex={id}
              setIndex={index}
              onDelete={() => removeSet(index)}
              metric={metric as SetMetrics}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
