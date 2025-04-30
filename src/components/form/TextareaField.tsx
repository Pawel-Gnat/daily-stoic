import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

import { Textarea } from "../ui/textarea";

interface TextareaFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  description: string;
  placeholder: string;
  disabled?: boolean;
  dataTestId?: string;
}

export const TextareaField = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  control,
  name,
  label,
  description,
  placeholder,
  disabled = false,
  dataTestId,
}: TextareaFieldProps<TFieldValues, TName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="relative">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              {...field}
              className="bg-paper"
              disabled={disabled}
              data-testid={dataTestId}
            />
          </FormControl>
          <FormDescription className="text-right absolute right-2 bottom-1">{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
