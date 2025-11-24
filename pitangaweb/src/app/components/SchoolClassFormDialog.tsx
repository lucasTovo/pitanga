import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { SchoolClass } from "@/types/school-class.types";

import { createSchoolClass, updateSchoolClass } from "@/infra/data/school.rest";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const FormSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório."),
  description: z.string().optional(),
});

interface SchoolClassFormDialogProps {
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (state: boolean) => void;
  initialData?: SchoolClass | null;
}

export function SchoolClassFormDialog({
  mode,
  open,
  onOpenChange,
  initialData,
}: SchoolClassFormDialogProps) {
  const queryClient = useQueryClient();

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

  // --- 🔥 MUTATION DO REACT QUERY ---
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof FormSchema>) => {
      return mode === "create"
        ? await createSchoolClass(values)
        : await updateSchoolClass(initialData!.id, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] }); // 🔥 Atualiza lista depois de criar/editar
      onOpenChange(false); // Fecha o dialog
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    mutation.mutate(values);
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
            className="flex flex-col gap-4"
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
            <div className="flex gap-4 mt-8">
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>

              <Button className="w-full" type="submit" disabled={mutation.isPending}>
                {mutation.isPending
                  ? "Salvando..."
                  : mode === "create"
                  ? "Criar Turma"
                  : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
