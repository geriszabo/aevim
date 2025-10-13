import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {type StaticExerciseList} from "@aevim/shared-types"

interface ExerciseSelectComboBoxProps {
  value?: string;
  onChangeValue: (value: string) => void;
  exerciseList: StaticExerciseList
}


export const ExerciseSelectComboBox = ({
  onChangeValue,
  value,
  exerciseList
}: ExerciseSelectComboBoxProps) => {
  const [open, setOpen] = useState(false);
  const exerciseOptions = exerciseList.map((ex) => ({ id: ex.id, label: ex.name }));

  return (
    <>
      <Label>Exercise name</Label>
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild className="w-full">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-10"
          >
            {value
              ? exerciseOptions.find((ex) => ex.label === value)?.label
              : "Select exercise..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search workout..." className="h-9" />
            <CommandList>
              <CommandEmpty>No workout found.</CommandEmpty>
              <CommandGroup>
                {exerciseOptions.map((ex) => (
                  <CommandItem
                    key={ex.id}
                    value={ex.label}
                    onSelect={() => {
                      onChangeValue(ex.label === value ? "" : ex.label);
                      setOpen(false);
                    }}
                  >
                    {ex.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === ex.label ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};
