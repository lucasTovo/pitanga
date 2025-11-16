import { PlusIcon, Trash2Icon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { forwardRef } from "react";

interface IO {
  input: string;
  output: string;
}

interface IOListProps {
  value: IO[];
  onChange: (value: IO[]) => void;
}

export const IOList = forwardRef<HTMLDivElement, IOListProps>(
  ({ value, onChange }, ref) => {
    const addIOItem = () => {
      onChange([...value, { input: "", output: "" }]);
    };

    const removeIOItem = (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    };

    const updateIOItem = (
      index: number,
      field: keyof IO,
      newValue: string
    ) => {
      const updated = [...value];
      updated[index] = { ...updated[index], [field]: newValue };
      onChange(updated);
    };

    return (
      <div ref={ref} className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Validações</h3>
          <Button variant="default" onClick={addIOItem}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Adicionar validação
          </Button>
        </div>

        {value.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhuma validação adicionada ainda.
          </p>
        )}

        <div className="space-y-4">
          {value.map((validation, index) => (
            <Card key={index} className="relative">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Validação {index + 1}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"
                  onClick={() => removeIOItem(index)}
                >
                  <Trash2Icon className="w-4 h-4" />
                </Button>
              </CardHeader>

              <CardContent className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-muted-foreground mb-1">
                    Input esperado
                  </label>
                  <Input
                    value={validation.input}
                    placeholder="Ex: 5 10"
                    onChange={(e) =>
                      updateIOItem(index, "input", e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-muted-foreground mb-1">
                    Saída esperada
                  </label>
                  <Input
                    value={validation.output}
                    placeholder="Ex: 15"
                    onChange={(e) =>
                      updateIOItem(index, "output", e.target.value)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
);
