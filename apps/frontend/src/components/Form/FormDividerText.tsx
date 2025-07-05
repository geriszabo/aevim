import { Typography } from "@/components/ui/typography";

interface FormDividerProps {
  text: string;
}

export const FormDividerText = ({ text }: FormDividerProps) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <Typography
          variant="muted"
          size="xs"
          className="uppercase px-2 bg-card"
        >
          {text}
        </Typography>
      </div>
    </div>
  );
};
