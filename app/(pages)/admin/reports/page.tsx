import { fetchReports } from "@/app/lib/data";
import Link from 'next/link';

export default async function Page({ id }: { id: string }){
    const reports = await fetchReports()

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`text-2xl`}>Reports</h1>
            </div>
            <div className='flex flex-wrap items-center justify-center gap-4 mt-10'>
                {
                    reports.map(report => (
                        <Link href={`/admin/reports/${report.id}`} key={report.id} className='bg-blue-500 p-5 rounded-xl text-white w-[250px] h-[100px] text-center '>
                            <p>{report.month}</p>
                        </Link>
                    ))
                }
                <Link href={"/admin/reports/create"} className='bg-blue-800 p-5 rounded-xl text-white w-[250px] h-[100px] text-center flex flex-col justify-center gap-2 items-center'>
                    Add new report
                </Link>
            </div>
        </div>
    )
}