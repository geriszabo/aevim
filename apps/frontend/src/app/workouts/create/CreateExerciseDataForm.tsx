"use client";

import { FormInputField } from "@/components/Form/FormInputField";
import { CreateExerciseData } from "@/schemas/create-exercise-schema";
import {
  UseFormRegister,
  FieldErrors,
  Control,
  UseFieldArrayRemove,
  useFieldArray,
  UseFormGetValues,
  Controller,
} from "react-hook-form";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { WorkoutFormValues } from "./page";
import { ExerciseCardSetRow } from "../../../components/ExerciseCard/ExerciseCardSetRow";
import { ExerciseCardMetricSelect } from "../../../components/ExerciseCard/ExerciseCardMetricSelect";

interface CreateExerciseDataFormProps {
  register: UseFormRegister<WorkoutFormValues>;
  errors: FieldErrors<CreateExerciseData>;
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
      value: lastSet?.value ?? 0,
    });
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
            onClick={() => onDelete()}
          >
            <Trash2 className="text-red-600" />
          </Button>
        </div>

        <FormInputField
          id={`exercises.${id}.name`}
          label="Exercise name"
          type="text"
          register={register}
          placeholder="Pull ups"
          error={errors.name}
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
            <Controller
              control={control}
              name={`exercises.${id}.metric`}
              render={({ field }) => (
                <ExerciseCardMetricSelect
                  value={field.value}
                  onValueChange={field.onChange}
                />
              )}
            />
            <Button
              variant="outline"
              size="icon"
              className="h-6 ml-auto col-span-2"
              onClick={handleAddSet}
            >
              +
            </Button>
          </div>
          {setFields.map((_set, index) => (
            <ExerciseCardSetRow
              key={index}
              register={register}
              exerciseIndex={id}
              setIndex={index}
              onDelete={() => removeSet(index)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
