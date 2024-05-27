'use client';

import { Button } from '@/components/button';
import { buildGoals } from '@/lib/actions';
import { useParams } from 'next/navigation';
import { useState } from 'react';

interface FormData {
  goals_prompt: string;
  goals_transcript: string;
  goals_close: string;
}

export default function GoalGenerator({ threadId }: { threadId: any }) {
  const report_id = useParams().report_id as string;

  const [formData, setFormData] = useState<FormData>({
    goals_prompt:
      'le pedí al emprendedor que eligiera la(s) opción(es) que más correspondieran a sus metas actuales desde el punto de vista de las finanzas de su empresa y me dijo lo siguiente.',
    goals_transcript:
      'definitivamente necesito vender más, no necesariamente porque sí creo que soy muy eficiente. Por otro lado, también necesito mejorar mi flujo porque tengo muy poco dinero en el banco y eso tiene que cambiar.',
    goals_close: 'dame un resumen de esto',
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/message/create', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content:
          formData.goals_prompt +
          formData.goals_transcript +
          formData.goals_close,
        threadId: threadId,
      }),
    });

    if (!response.ok) {
      console.error('Error al agregar menssage al thread');
      return;
    }

    const result = await response.json();
    console.log('message creado con exito', result);
  };

  const handleCreateRun = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/run/create', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        threadId: threadId,
      }),
    });

    if (!response.ok) {
      console.error('Error al crear RUN');
      return;
    }

    const result = await response.json();
    console.log('Run creado con exito', result);
  };

  const handleRetrieveThreadMessages = async (e: React.FormEvent) => {
    e.preventDefault();
    const goals = document.getElementById('goals');

    const response = await fetch(`/api/thread/retrieve?threadId=${threadId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Error al obtener mensajes');
      return;
    }

    const result = await response.json();
    console.log('Mensajes obtenidos con exito', result);

    const responseBusinessResume = result.messagesData[3].content;

    if (!goals) {
      return;
    }

    goals.innerHTML = responseBusinessResume;
  };

  return (
    <div className="mt-3">
      <h1 className="my-3 text-center">Generador de informes</h1>

      <textarea
        name="goals_prompt"
        value={formData.goals_prompt}
        onChange={handleChange}
        className="w-full rounded-md bg-blue-100 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-600"
        autoFocus
      />
      <textarea
        name="goals_transcript"
        value={formData.goals_transcript}
        onChange={handleChange}
        rows={4}
        className="w-full rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-600"
        autoFocus
        placeholder=">>> ingresar el transcript del Q&A <<<"
      />
      <textarea
        name="goals_close"
        value={formData.goals_close}
        onChange={handleChange}
        rows={4}
        className="w-full rounded-md bg-blue-100 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-600"
        autoFocus
      />

      <div className="my-2 flex justify-between">
        <Button onClick={handleCreateMessage}>crear mensaje</Button>
        <Button onClick={handleCreateRun}>crear Run</Button>
        <Button onClick={handleRetrieveThreadMessages}>obtener mensajes</Button>
        <input type="text" defaultValue={threadId} name="thread_id" />
      </div>

      <h2 className="mt-5 text-center text-2xl font-bold text-blue-600">
        Actualizar metas financieras
      </h2>
      <form action={buildGoals}>
        <label htmlFor="goals" className="mt-3 block">
          Metas financieras
        </label>
        <textarea
          rows={9}
          id="goals"
          name="goals"
          className="w-full rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <input type="text" name="report_id" defaultValue={report_id} hidden />

        <div className="my-2 flex justify-end">
          <button className="rounded-md bg-blue-600 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50">
            continuar con P&L
          </button>
        </div>
      </form>
    </div>
  );
}
