import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectFieldProps {
  label: string;
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function MultiSelectField({
  label,
  options,
  selected,
  onChange,
}: MultiSelectFieldProps) {
  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-border/30 hover:border-primary/50 transition-colors"
          >
            <Checkbox
              checked={selected.includes(option.value)}
              onCheckedChange={() => toggleOption(option.value)}
            />
            <span className="text-sm">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// Constants for motel options
export const PAYMENT_METHODS = [
  { value: "credit_card", label: "Cartão de Crédito" },
  { value: "debit_card", label: "Cartão de Débito" },
  { value: "pix", label: "PIX" },
  { value: "cash", label: "Dinheiro" },
  { value: "crypto", label: "Criptomoedas" },
];

export const SUITE_PERIODS = [
  { value: "2h", label: "2 horas" },
  { value: "4h", label: "4 horas" },
  { value: "6h", label: "6 horas" },
  { value: "12h", label: "12 horas (Pernoite)" },
  { value: "24h", label: "24 horas (Diária)" },
];

export const SERVICES = [
  { value: "breakfast", label: "Café da Manhã" },
  { value: "restaurant", label: "Restaurante" },
  { value: "frigobar", label: "Frigobar" },
  { value: "room_service", label: "Serviço de Quarto" },
  { value: "jacuzzi", label: "Jacuzzi/Hidro" },
  { value: "sauna", label: "Sauna" },
  { value: "pole_dance", label: "Pole Dance" },
  { value: "dungeon", label: "Dungeon/Masmorra" },
  { value: "swing", label: "Balanço" },
  { value: "bdsm_kit", label: "Kit BDSM" },
  { value: "adult_toys", label: "Toys Adultos" },
  { value: "streaming", label: "Streaming (Netflix etc)" },
  { value: "parking", label: "Estacionamento Privativo" },
  { value: "wifi", label: "Wi-Fi" },
];
