import { fetchReportById } from '@/lib/data';
import { translateChartType } from '@/lib/utils';
import { Libre_Baskerville } from 'next/font/google';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import '../../../../globals.css';
import BannerSection from '@/components/bannerSection';
import Logo from '@/components/icons/Logo';
import BannerReferidos from '@/components/bannerReferidos';
import reporte from '../../../../../components/images/header-reporte.png';
import Image from 'next/image';
import WaterfallTooltip from '@/components/tooltips/waterfall';
import SalesTooltip from '@/components/tooltips/sales';
import CostsExpensesTooltip from '@/components/tooltips/costs-expenses';
import ProfitMarginsTooltip from '@/components/tooltips/profit-margins';
import MarginsTooltip from '@/components/tooltips/margins';
import ExpensesTooltip from '@/components/tooltips/detailed-expenses';
import ReportsIndexNavbar from '@/components/reports-index-navbar';
import CompareResultsTooltip from '@/components/tooltips/compare-results';
import CompareMarginsTooltip from '@/components/tooltips/compare-margins';
import MarkdownRenderer from '@/components/markdownRendered';


const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
});

const chartOrder = [
  'waterfall',
  'actual_vs_average',
  'actual_vs_average_2',
  'sales',
  'costs_and_expenses',
  'net_profit_and_margins',
  'margins',
  'detailed_expenses',
];

const reorderCharts = (charts: any) => {
  return charts.sort((a: any, b: any) => {
    return chartOrder.indexOf(a.type) - chartOrder.indexOf(b.type);
  });
};

export default async function ReportPage({
  params,
}: {
  params: { id: string; month: string };
}) {
  const id = params.id;
  const report = await fetchReportById(id);
  console.log(report);

  const orderedCharts = reorderCharts(report.charts);

  return (
    <div className="flex flex-col gap-3 xl:px-2">
      <ReportsIndexNavbar business_id={report.business_id} />

      <Image
        width={3000}
        height={3000}
        src={reporte}
        alt="image"
        className="w-full"
      />

      <h1
        className={`mx-auto mt-16 text-2xl font-semibold text-[#003E52] max-xl:w-[90%] xl:w-[80%] ${libreBaskerville.className}`}
      >
        Reporte de{' '}
        <span className="capitalize">
          {report.month} {report.created_at.slice(0, 4)}
        </span>
      </h1>

      <div>
        <p
          className={`mx-auto mb-4 text-xl font-semibold text-[#003E52] max-xl:w-[90%] xl:w-[80%] xl:text-4xl ${libreBaskerville.className}`}
        >
          {report.business.name}
        </p>
      </div>

      <div className="mx-auto mb-24 max-xl:w-[90%] max-md:mb-14 xl:w-[80%]">
        <div
          id="resumen"
          className="section-margin mb-20 mt-10 flex flex-col gap-10"
          key={'resumen'}
        >
          <div>
            <div>
              {!report.business_resume ? (
                <p className="mb-4 text-2xl font-semibold text-[#003E52]">
                  Resumen de las operaciones de{' '}
                  <span className="capitalize">{report.month}</span>
                </p>
              ) : (
                <p className="mb-4 text-2xl font-semibold text-[#003E52]">
                  Perfil de mi empresa
                </p>
              )}
            </div>
            <div className="rounded-xl bg-[#003E52]/10 p-3 text-[#003E52]">
              {!report.business_resume ? (
                <div>
                  <MarkdownRenderer markdown={report.operations_resume} />
                </div>
              ) : (
                <div><MarkdownRenderer markdown={report.business_resume} /></div>
              )}
            </div>
          </div>
          <div>
            <p className="mb-4 text-2xl font-semibold text-[#003E52]">
              Metas financieras
            </p>
            <div className="rounded-xl bg-[#003E52]/10 p-3 text-[#003E52]">
              <MarkdownRenderer markdown={report.goals} />
            </div>
          </div>
        </div>
      </div>

      <BannerSection text="Resumen financiero" />
      <div className="px-3">
        <div className="mt-10 flex flex-col gap-36">
          {orderedCharts.map((chart: any) => (
            <div
              className={`section-margin flex items-center justify-between rounded-xl bg-[#003E52]/10 px-3 py-4 max-xl:flex-col 2xl:px-7`}
              id={chart.type}
              key={chart.id}
            >
              <div className="max-xl:w-full">
                <div className="flex items-center gap-2">
                  <p className="text-xl font-semibold text-[#003E52] xl:text-2xl">
                    {' '}
                    Gráfica de <span>{translateChartType(chart.type)}</span>
                  </p>
                  {chart.type === 'waterfall' ? (
                    <WaterfallTooltip />
                  ) : chart.type === 'actual_vs_average' ? (
                    <CompareResultsTooltip />
                  ) : chart.type === 'actual_vs_average_2' ? (
                    <CompareMarginsTooltip />
                  ) : chart.type === 'sales' ? (
                    <SalesTooltip />
                  ) : chart.type === 'costs_and_expenses' ? (
                    <CostsExpensesTooltip />
                  ) : chart.type === 'net_profit_and_margins' ? (
                    <ProfitMarginsTooltip />
                  ) : chart.type === 'margins' ? (
                    <MarginsTooltip />
                  ) : chart.type === 'detailed_expenses' ? (
                    <ExpensesTooltip />
                  ) : (
                    <p>Este grafico no tiene tooltip</p>
                  )}
                </div>
                <div className="flex items-center gap-10 max-xl:flex-col">
                  <Dialog>
                    <DialogTrigger>
                      <Image
                        src={chart.graphy_url}
                        alt={chart.type}
                        width={1000}
                        height={1000}
                        className="mx-auto my-5 h-[100%] rounded-xl max-xl:w-full xl:w-[1000px]"
                      />
                    </DialogTrigger>
                    <DialogContent>
                      <Image
                        src={chart.graphy_url}
                        alt={chart.type}
                        width={2000}
                        height={1000}
                        className="mx-auto h-full w-full rounded-xl"
                      />
                    </DialogContent>
                  </Dialog>
                  <div className="w-full rounded-lg bg-white px-3 py-5 max-md:h-[400px] max-md:overflow-y-auto xl:h-[450px] xl:w-[50%] xl:overflow-y-auto 2xl:h-full 2xl:w-[40%]">
                    {chart.insights && (
                      <div className="flex flex-col justify-between">
                        <h3 className="mb-5 text-center text-2xl font-medium">
                          Análisis
                        </h3>

                        <div className="whitespace-pre-wrap text-[#003E52]">
                          <MarkdownRenderer markdown={chart.insights} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="my-28 flex flex-col gap-28">
        <div className="mx-auto xl:w-[80%]" key={'conclusiones'}>
          <BannerSection
            text="Conclusiones financieras"
            id="conclusiones"
            key={'conclusiones'}
          />
          {/* <p className="mb-4 text-2xl font-semibold text-[#003E52]">Conclusiones</p> */}
          <div className="mt-16 rounded-xl bg-[#003E52]/10 p-3 text-[#003E52] max-md:mx-auto max-md:w-[96%]">
            <MarkdownRenderer markdown={report.analysis} />
          </div>
        </div>

        <div className="section-margin mx-auto  xl:w-[80%]">
          <BannerSection
            text="Recomendaciones personalizadas"
            id="recomendaciones"
            key={'recomendaciones'}
          />
          {/* <p className="mb-4 text-2xl font-semibold text-[#003E52]">Recomendaciones</p> */}
          <div className="mt-16 flex flex-col gap-10 p-3">
            {report.recomendations.map((data: any, index: number) => (
              <div
                key={index}
                className="flex flex-col rounded-xl bg-[#003E52]/10 p-4 text-[#003E52]"
              >
                <div>
                  <MarkdownRenderer markdown={data.content} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {report.additional_info && (
        <div className="section-margin mx-auto  xl:w-[80%]">
          <BannerSection
            text="Información adicional"
            id="información adicional"
            key={'información adicional'}
          />
          <Image
            src={report.additional_info}
            alt="image"
            width={1000}
            height={1000}
            className="mx-auto my-5 h-[100%] rounded-xl xl:w-[1000px]"
          />
        </div>
        )}

      </div>
      <div className="mx-auto flex flex-col gap-6 max-lg:w-[98%] max-lg:text-center xl:w-[80%]">
        <p className="font-medium text-[#00AE8D]">
          Este análisis fue generado con asistencia de inteligencia artificial y
          debe ser revisado cuidadosamente antes de tomar decisiones basadas en
          él.
        </p>
        <p className="font-medium text-[#00AE8D]">
          Los ingresos y gastos presentados provienen directamente de los
          estados de cuenta y pueden no reflejar el monto completo o los
          impuestos relacionados, como el IVA, de manera estrictamente correcta
          si estos no fueron detallados explícitamente. El presente debe de
          tomarse como un reporte financiero y no uno que puede usarse para la
          contabilidad de la empresa. Se utilizó toda la información
          proporcionada, en caso de haber omitido algo los reportes pueden tener
          resultados engañosos o erróneos.
        </p>
      </div>
      {/* <div className='mt-10'>
            <BannerReferidos text='¡Te descontamos $100 por cada negocio que invites!'/>
          </div> */}
      <div className="mt-10 flex w-full items-center justify-between rounded-3xl bg-[#003E52] p-8 max-md:mx-auto max-md:w-[98%] max-md:rounded-2xl max-md:p-4">
        <p className="text-[#003E52]">.</p>
        <p
          className={`${libreBaskerville.className} text-center text-3xl text-white max-md:text-xl`}
        >
          Nosotros a tus finanzas y tú a lo tuyo.
        </p>
        <div className="max-md:hidden">
          <Logo />
        </div>
      </div>
      <p className="pb-2 text-center font-medium text-[#0065A1]">tualo.mx</p>
    </div>
  );
}
