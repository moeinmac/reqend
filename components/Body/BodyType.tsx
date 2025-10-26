import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const BodyType = () => {
  return (
    <RadioGroup defaultValue="none" className="flex items-center gap-4 px-4 py-1">
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
