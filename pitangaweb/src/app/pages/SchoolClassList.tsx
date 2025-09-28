import { Link, useLoaderData } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface SchoolClass {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
} 

export const SchoolClassList = () => {
  const classes = useLoaderData() as SchoolClass[];

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Minhas Turmas</h1>
        <Link to="/create-class">
          <Button>Nova Turma</Button>
        </Link>
      </div>

      {classes.length === 0 ? (
        <p className="text-gray-500">Nenhuma turma encontrada.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classes.map((cls) => (
            <Card key={cls.id} className="shadow-md">
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold">{cls.name}</h2>
                <p className="text-gray-600">{cls.description || "Sem descrição"}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Criada em {new Date(cls.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
