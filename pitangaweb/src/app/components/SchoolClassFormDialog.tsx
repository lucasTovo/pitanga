import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { createSchoolClass, updateSchoolClass } from "@/infra/data/shcool.rest";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { SchoolClass } from "@/types/school-class.types";

const FormSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório."),
  description: z.string().optional(),
});

interface Props {
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (state: boolean) => void;
  initialData?: SchoolClass | null;
  onSuccess?: (data: any) => void;
}

export function SchoolClassFormDialog({
  mode,
  open,
  onOpenChange,
  initialData,
  onSuccess,
}: Props) {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Quando abrir no modo edição, popula os valores
  useEffect(() => {
    if (open && mode === "edit" && initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description ?? "",
      });
    }

    if (open && mode === "create") {
      form.reset({
        name: "",
        description: "",
      });
    }
  }, [open, mode, initialData, form]);

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      let result;

      if (mode === "create") {
        result = await createSchoolClass(values);
      } else {
        result = await updateSchoolClass(initialData!.id, values);
      }

      onSuccess?.(result);
      onOpenChange(false);

    } catch (err) {
      console.error("Erro ao salvar turma:", err);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Criar Nova Turma" : "Editar Turma"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Preencha os campos para criar uma turma."
              : "Altere os dados da turma."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-4"
          >
            {/* Campo Nome */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Programação 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo Descrição */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Turma focada em lógica"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botões */}
            <Button className="w-full" type="submit">
              {mode === "create" ? "Criar Turma" : "Salvar Alterações"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
