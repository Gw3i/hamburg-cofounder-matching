import { FOUNDER_SKILLS } from "@/lib/founderSkills";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SkillPickerProps {
  selectedSkills: string[];
  onChange: (skills: string[]) => void;
}

export function SkillPicker({ selectedSkills, onChange }: SkillPickerProps) {
  const toggleSkill = (skillValue: string) => {
    if (selectedSkills.includes(skillValue)) {
      onChange(selectedSkills.filter(s => s !== skillValue));
    } else {
      onChange([...selectedSkills, skillValue]);
    }
  };

  return (
    <div className="space-y-3">
      {FOUNDER_SKILLS.map(skill => (
        <div key={skill.value} className="flex items-start space-x-3">
          <Checkbox
            id={skill.value}
            checked={selectedSkills.includes(skill.value)}
            onCheckedChange={() => toggleSkill(skill.value)}
          />
          <div className="grid gap-1 leading-none">
            <Label
              htmlFor={skill.value}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {skill.label}
            </Label>
            <p className="text-sm text-muted-foreground">{skill.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
