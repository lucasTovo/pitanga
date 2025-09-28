import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createSchoolClass } from "@/infra/data/shcool.rest";
import { useAuth } from "@/auth/hook/useAuth";

export const CreateSchoolClass = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { userId } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
        const body = { name, description, creatorId: userId };
        const res = await createSchoolClass(body);
        console.log('School class created:', res);
        navigate("/classes/" + res.id);
    } catch (error) {
        console.error('Error creating school class:', error);   
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Criar Nova Turma</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nome</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ex: Turma de Programação 1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Descrição</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Turma focada em lógica de programação"
          />
        </div>

        <Button type="submit" className="w-full">
          Criar Turma
        </Button>

        <Button type="button" className="w-full" onClick={() => navigate(-1)} variant="outline">
          Cancelar
        </Button>
      </form>
    </div>
  );
}
