import { fetchFilteredBusiness} from '@/lib/data';
import { BriefcaseIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export type BussinesTableProps = {
  query: string;
  currentPage: number;
};

export default async function BusinessTable({query, currentPage}:BussinesTableProps) {
  const businesses = await fetchFilteredBusiness(query, currentPage)

  if (businesses.length === 0) {
    return ( <div className='mt-6 border-2 border-slate-200 p-2 rounded-xl'><p>No se encontraron resultados para la búsqueda.</p></div>
    )
  }
  return (
    <div className="mt-6 flow-root">
        <div className='flex flex-col gap-2 w-full border-1 bg-gray-50 rounded-xl p-4'>
          {
            businesses.map(business => (
              <div key={business.id} className='border-2 border-slate-200 p-2 rounded-xl'>
                <Link href={`/admin/businesses/${business.id}`} className='flex items-center gap-2'>
                  <BriefcaseIcon className='w-7 h-7'/>
                  <p>{business.name}</p>
                </Link>
              </div>
            ))
          }
      </div>
    </div>
  );
}
