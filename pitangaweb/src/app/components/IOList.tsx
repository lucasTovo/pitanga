import { forwardRef, Fragment } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { PlusIcon, Trash2Icon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChallengeFormData } from "./ChallengeForm";

export const IOList = forwardRef<HTMLDivElement>((_, ref) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<ChallengeFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "validations",
  });

    return (
      <div ref={ref} className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Validações</h3>

          <Button
            type="button"
            variant="default"
            onClick={() => append({ input: "", output: "" })}
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Adicionar validação
          </Button>
        </div>

        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhuma validação adicionada ainda.
          </p>
        )}

        <div className="space-y-4">
          {fields.map((item, index) => {
            const hasError =
              !!errors?.validations?.[index]?.input ||
              !!errors?.validations?.[index]?.output;

            return (
              <Fragment key={item.id}>
                <Card className={
                  cn(
                    'relative',
                    hasError && 'border-error'
                  )
                }>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">
                      Validação {index + 1}
                    </CardTitle>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => remove(index)}
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </Button>
                  </CardHeader>

                  <CardContent className="flex flex-col gap-3">
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-muted-foreground mb-1">
                        Input esperado
                      </label>
                      <Controller
                        control={control}
                        name={`validations.${index}.input`}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Ex: 5 10"
                          />
                        )}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-muted-foreground mb-1">
                        Saída esperada
                      </label>
                      <Controller
                        control={control}
                        name={`validations.${index}.output`}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Ex: 15"
                          />
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {hasError && (
                  <span className="text-sm text-destructive font-medium mt-1">
                    Preencha os campos
                  </span>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    );
  }
);
