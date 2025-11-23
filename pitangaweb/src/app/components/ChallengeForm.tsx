// React e bibliotecas externas
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { ChallengeLevel } from '@/types/challenges.types';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { IOList } from '@/app/components/IOList';
import { CodeEditor } from '@/app/components/CodeEditor';
import { TextEditor } from '@/app/components/TextEditor';

const DEFAULT_CODE = `public class Solution {
\tpublic static void main(String[] args) {
\t\t// Sua solução aqui
\t}
}`;

const validationSchema = z.object({
  input: z.string().min(1, 'O campo input é obrigatório'),
  output: z.string().min(1, 'O campo output é obrigatório')
});

export type IO = z.infer<typeof validationSchema>;

const challengeSchema = z.object({
  title: z.string().min(5, 'O título deve ter pelo menos 5 caracteres'),
  level: z.enum(ChallengeLevel),
  description: z.string(),
  baseCode: z.string(),
  validations: z.array(validationSchema),
});

export type ChallengeFormData = z.infer<typeof challengeSchema>;

export interface ChallengeFormProps {
  mode: 'create' | 'edit';
  initialValues?: ChallengeFormData;
  onSubmit: (data: ChallengeFormData) => Promise<void> | void;
}

export const ChallengeForm = ({ onSubmit, initialValues, mode }: ChallengeFormProps) => {
  const navigate = useNavigate();

  const form = useForm<ChallengeFormData>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      title: '',
      level: ChallengeLevel.EASY,
      description: '',
      baseCode: DEFAULT_CODE,
      validations: []
    },
    mode: 'all',
  });

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* TÍTULO */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-lg'>Título</FormLabel>
              <FormControl>
                <Input placeholder="Título do desafio" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* DESCRIÇÃO */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Descrição</FormLabel>
              <FormControl>
                <TextEditor {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* NÍVEL */}
        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem className='flex items-center space-y-0 gap-4'>
              <FormLabel className='text-lg'>Nível:</FormLabel>
              <FormControl>
                <ToggleGroup
                  type="single"
                  value={field.value}
                  onValueChange={(value) => {
                    if (value) field.onChange(value);
                  }}
                  className="flex gap-2 flex-wrap"
                >
                  <ToggleGroupItem
                    value="EASY"
                    className="
                      data-[state=on]:bg-success
                      data-[state=on]:border-transparent
                      data-[state=on]:text-success-foreground
                      rounded-full border px-4 py-1 text-sm transition-all
                    "
                  >
                    Fácil
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="MEDIUM"
                    className="
                      data-[state=on]:bg-warning
                      data-[state=on]:border-transparent
                      data-[state=on]:text-warning-foreground
                      rounded-full border px-4 py-1 text-sm transition-all
                    "
                  >
                    Médio
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="HARD"
                    className="
                      data-[state=on]:bg-accent
                      data-[state=on]:border-transparent
                      data-[state=on]:text-accent-foreground
                      rounded-full border px-4 py-1 text-sm transition-all
                    "
                  >
                    Difícil
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="PRO"
                    className="
                      data-[state=on]:bg-complementary
                      data-[state=on]:border-transparent
                      data-[state=on]:text-complementary-foreground
                      rounded-full border px-4 py-1 text-sm transition-all
                    "
                  >
                    PRO
                  </ToggleGroupItem>
                </ToggleGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* VALIDAÇÕES */}
        <FormField
          control={form.control}
          name="validations"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <IOList {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CÓDIGO BASE */}
        <FormField
          control={form.control}
          name="baseCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-lg'>Código base</FormLabel>
              <FormControl>
                <CodeEditor {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* BOTÃO CRIAR*/}
        <div className="flex justify-end gap-4 pt-4">
          <Button
            variant='ghost'
            onClick={() => navigate('/')}
          >
            Cancelar
          </Button>

          <Button type="submit">
            {mode === 'edit' ? 'Salvar alterações' : 'Criar'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
