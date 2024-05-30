"use client"

import { createUser } from "@/lib/actions";

export default function CreateUserPage() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const users = [
      { name: formData.get('name-1'), email: formData.get('email-1') },
      { name: formData.get('name-2'), email: formData.get('email-2') },
      { name: formData.get('name-3'), email: formData.get('email-3') },
    ];
    await createUser(users);
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-[100%] p-6 bg-gray-100 rounded-xl'>
      <h2 className='text-lg font-semibold'>Usuarios</h2>
      <div className='flex flex-col gap-2 p-4 bg-white rounded-xl shadow-md'>
        <input type="text" name="name-1" placeholder='Nombre' className='rounded-xl bg-slate-100 px-2 py-1'/>
        <input type="email" name="email-1" placeholder='Email' className='rounded-xl bg-slate-100 px-2 py-1'/>
      </div>
      <div className='flex flex-col gap-2 p-4 bg-white rounded-xl shadow-md'>
        <input type="text" name="name-2" placeholder='Nombre' className='rounded-xl bg-slate-100 px-2 py-1'/>
        <input type="email" name="email-2" placeholder='Email' className='rounded-xl bg-slate-100 px-2 py-1'/>
      </div>
      <div className='flex flex-col gap-2 p-4 bg-white rounded-xl shadow-md'>
        <input type="text" name="name-3" placeholder='Nombre' className='rounded-xl bg-slate-100 px-2 py-1'/>
        <input type="email" name="email-3" placeholder='Email' className='rounded-xl bg-slate-100 px-2 py-1'/>
      </div>
      <button type="submit" className='p-3 rounded-xl bg-blue-500 text-white mt-4'>Invitar usuarios a negocio</button>
    </form>
  );
}
