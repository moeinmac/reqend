import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Body } from "@/db/models.type";
import { useRequestStore } from "@/store/useRequestStore";
import { FC } from "react";
import { useShallow } from "zustand/react/shallow";

interface BodyTypeProps {
  value: Body["type"];
}

const BodyType: FC<BodyTypeProps> = ({ value }) => {
  const { updateBodyType } = useRequestStore(
    useShallow((state) => ({
      updateBodyType: state.updateBodyType,
    }))
  );
  return (
    <RadioGroup
      value={value}
      onValueChange={async (value: Body["type"]) => await updateBodyType(value)}
      className="flex items-center gap-4 px-4 py-1"
    >
      <div className="flex items-center gap-2">
        <RadioGroupItem value="none" id="none" />
        <Label htmlFor="none">None</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="json" id="json" />
        <Label htmlFor="json">Json</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="formData" id="formData" />
        <Label htmlFor="formData">Form Data</Label>
      </div>
    </RadioGroup>
  );
};

export default BodyType;
