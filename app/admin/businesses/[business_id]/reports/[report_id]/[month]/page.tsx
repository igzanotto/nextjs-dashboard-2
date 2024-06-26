import ChartEmbed from '@/components/charts/ChartEmbed';
import ChartIcon from '@/components/icons/ChartIcon';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  createChartEmbed,
  editInsights,
  updateReport,
  updateReportRecommendations,
  uploadImage,
  uploadImageChart,
} from '@/lib/actions';
import {
  fetchBusinessById,
  fetchReportById,
  fetchReportsByBusiness,
} from '@/lib/data';
import { Edit2Icon, InfoIcon } from 'lucide-react';
import { Libre_Baskerville } from 'next/font/google';
import Link from 'next/link';
import reporte from '../../../../../../../components/images/header-reporte.png';
import Image from 'next/image';
import BannerSection from '@/components/bannerSection';
import { translateChartType } from '@/lib/utils';
import ChartNavigation from '@/components/chart-navigation';
import MonthButtonAdmin from '@/components/admin/monthButton';
import MonthButtonsAdmin from '@/components/admin/monthButton';
import { EyeIcon } from '@heroicons/react/24/outline';
import WaterfallTooltip from '@/components/tooltips/waterfall';
import SalesTooltip from '@/components/tooltips/sales';
import CostsExpensesTooltip from '@/components/tooltips/costs-expenses';
import ProfitMarginsTooltip from '@/components/tooltips/profit-margins';
import MarginsTooltip from '@/components/tooltips/margins';
import ExpensesTooltip from '@/components/tooltips/detailed-expenses';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import CompareResultsTooltip from '@/components/tooltips/compare-results';
import CompareMarginsTooltip from '@/components/tooltips/compare-margins';

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
  params: { report_id: string; id: string; business_id: string; month: string };
}) {
  const report = await fetchReportById(params.report_id);
  console.log(report.recomendations.map((data: any) => data));

  const { business_id } = params;

  const orderedCharts = reorderCharts(report.charts);

  const renderTextFromDatabase = (text: string | undefined) => {
    if (!text) {
      return <p>Vacío</p>;
    }

    const applyStyles = (text: string) => {
      return <span className="font-bold text-[#003E52]">{text}</span>;
    };

    const paragraphs = text.split('\n');
    const formattedParagraphs = paragraphs.map((paragraph, index) => {
      const lines = paragraph.split('\n');
      const formattedLines = lines.map((line, lineIndex) => {
        const [firstPart, ...rest] = line.split(':');
        const secondPart = rest.join(':').trim(); // Por si hay más de un ":" en la línea

        return (
          <span key={lineIndex}>
            {applyStyles(firstPart)}
            {secondPart && `: ${secondPart}`} <br />
          </span>
        );
      });

      return <span key={index}>{formattedLines}</span>;
    });

    return <>{formattedParagraphs}</>;
  };

  return (
    <div className="flex flex-col">
      <nav className="sticky top-0 z-50 mb-10 flex items-center rounded-b-xl bg-white p-2 shadow-lg md:gap-10 md:p-4">
        <MonthButtonsAdmin business_id={business_id} />
        <div className="mx-auto justify-center self-center">
          <ChartNavigation />
        </div>
      </nav>
      <div className="flex flex-col gap-3 xl:px-2">
        <Image
          width={3000}
          height={3000}
          src={reporte}
          alt="image"
          className="w-full"
        />

        <h1
          className={`mx-auto mt-16 w-[95%] text-2xl font-semibold text-[#003E52] max-xl:w-[90%] ${libreBaskerville.className}`}
        >
          Reporte de{' '}
          <span className="capitalize">
            {report.month} {report.created_at.slice(0, 4)}
          </span>
        </h1>

        <div>
          <p
            className={`mx-auto mb-4 w-[95%] text-xl font-semibold text-[#003E52] xl:text-4xl ${libreBaskerville.className}`}
          >
            {report.business.name}
          </p>
        </div>

        <div className="mx-auto w-[95%]">
          <Link
            href={`/admin/businesses/${business_id}/reports/${report.id}/${report.month}/preview`}
            className="flex w-[150px] items-center gap-2 rounded-lg bg-[#EC7700] p-3 text-white"
          >
            <EyeIcon width={20} height={20} />
            Vista previa
          </Link>
          <div id="resumen" key={'resumen'} className="section-margin">
            {!report.business_resume ? (
              <div>
                <form
                  action={updateReport}
                  className="mt-10 flex flex-col gap-20"
                >
                  <input
                    type="hidden"
                    name="report_id"
                    value={params.report_id}
                  />
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
                    <textarea
                      name="operations_resume"
                      defaultValue={report.operations_resume}
                      className="h-[500px] w-full rounded-lg border-2 border-zinc-300 p-4 text-[#003E52] shadow-xl"
                    />
                    <button
                      type="submit"
                      className="mt-4 w-full rounded-lg bg-[#003E52] p-2 text-white"
                    >
                      Guardar cambios
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <form
                  action={updateReport}
                  className="mt-10 flex flex-col gap-20"
                >
                  <input
                    type="hidden"
                    name="report_id"
                    value={params.report_id}
                  />
                  <div>
                    <p className="mb-4 text-2xl font-semibold text-[#003E52]">
                      Perfil de la empresa
                    </p>
                    <textarea
                      name="business_resume"
                      defaultValue={report.business_resume}
                      className="h-[500px] w-full rounded-lg border-2 border-zinc-300 p-4 text-[#003E52] shadow-xl"
                    />
                    <button
                      type="submit"
                      className="mt-4 w-full rounded-lg bg-[#003E52] p-2 text-white"
                    >
                      Guardar cambios
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
          <div className="mt-12 xl:mt-24">
            <p className="mb-4 text-2xl font-semibold text-[#003E52]">
              Metas financieras
            </p>
            <form action={updateReport}>
              <input type="hidden" name="report_id" value={params.report_id} />
              <textarea
                name="goals"
                defaultValue={report.goals}
                className="h-[300px] w-full rounded-lg border-2 border-zinc-300 p-4 text-[#003E52] shadow-xl"
              />
              <button
                type="submit"
                className="mt-4 w-full rounded-lg bg-[#003E52] p-2 text-white"
              >
                Guardar cambios
              </button>
            </form>
          </div>

          <div className="mb-16 mt-28">
            <BannerSection text="Resumen financiero" />
          </div>
          <div className="flex flex-col gap-16 xl:gap-36">
            {chartOrder.map((type: any) => {
              const chart = orderedCharts.find(
                (chart: any) => chart.type === type,
              );
              return (
                <div id={type} key={type}>
                  {chart ? (
                    chart.graphy_url ? (
                      <div className="flex flex-col">
                        <div
                          className={`section-margin flex gap-10 rounded-xl bg-[#252525]/10 p-3 max-xl:flex-col`}
                          id={chart.type}
                          key={chart.id}
                        >
                          <div className="flex w-full flex-col">
                            <div className="flex items-center gap-2">
                              <p className="my-4 text-xl font-semibold text-[#003E52] xl:text-2xl">
                                {' '}
                                Gráfica de{' '}
                                <span>{translateChartType(chart.type)}</span>
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
                            <Dialog>
                              <DialogTrigger>
                                <img
                                  src={chart.graphy_url}
                                  alt="image"
                                  width={1000}
                                  height={1000}
                                  className="mx-auto my-5 h-[100%] rounded-xl xl:w-[1000px]"
                                />
                              </DialogTrigger>
                              <DialogContent>
                                <img
                                  src={chart.graphy_url}
                                  alt="image"
                                  width={1000}
                                  height={1000}
                                  className="mx-auto h-full w-full rounded-xl"
                                />
                              </DialogContent>
                            </Dialog>

                            <p>Actualizar imagen</p>
                            <form
                              action={uploadImageChart}
                              className="mt-2 flex flex-col gap-4 rounded-xl bg-[#252525]/10 p-4"
                            >
                              <input
                                type="hidden"
                                name="report_id"
                                value={params.report_id}
                              />
                              <input type="hidden" name="id" value={chart.id} />
                              <input
                                type="hidden"
                                name="business_id"
                                value={params.business_id}
                              />
                              <input
                                name="image"
                                type="file"
                                className="text-[#003E52]"
                              />
                              <button
                                className="rounded-lg bg-[#003E52] p-2 text-white"
                                type="submit"
                              >
                                Guardar imagen
                              </button>
                            </form>
                          </div>

                          <div className="mx-auto mt-[5%] flex w-[80%]">
                            {chart.insights && (
                              <form action={editInsights} className="w-full">
                                <h3 className="mb-5 text-center text-2xl font-medium text-[#003E52]">
                                  Análisis
                                </h3>
                                <input
                                  type="hidden"
                                  name="id"
                                  value={chart.id}
                                />
                                <textarea
                                  defaultValue={chart.insights}
                                  name="insights"
                                  className="w-[100%] rounded-lg border-2 border-zinc-300 p-4 text-[#003E52] shadow-xl lg:h-[200px] xl:h-[80%] 2xl:h-5/6"
                                />

                                <button
                                  className="w-full rounded-xl bg-[#003E52] p-3 font-medium text-white"
                                  type="submit"
                                >
                                  Guardar
                                </button>
                              </form>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`section-margin flex gap-10 rounded-xl bg-[#252525]/10 p-3 max-xl:flex-col`}
                        id={chart.type}
                        key={chart.id}
                      >
                        <div className="flex flex-col gap-4">
                          <h1 className="text-black">
                            Crear Gráfico de {translateChartType(type)}
                          </h1>
                          <form
                            action={uploadImageChart}
                            className="mt-12 flex flex-col gap-4 rounded-xl bg-[#252525]/10 p-4"
                          >
                            <input
                              type="hidden"
                              name="report_id"
                              value={params.report_id}
                            />
                            <input type="hidden" name="id" value={chart.id} />
                            <input
                              type="hidden"
                              name="business_id"
                              value={params.business_id}
                            />
                            <input
                              name="image"
                              type="file"
                              className="text-[#003E52]"
                            />
                            <button
                              className="rounded-lg bg-[#003E52] p-2 text-white"
                              type="submit"
                            >
                              Guardar imagen
                            </button>
                          </form>
                        </div>
                        {chart.insights && (
                          <div className="w-full">
                            <form action={editInsights} className="w-full">
                              <h3 className="mb-5 text-center text-2xl font-medium text-[#003E52]">
                                Análisis
                              </h3>
                              <input type="hidden" name="id" value={chart.id} />
                              <textarea
                                defaultValue={chart.insights}
                                name="insights"
                                className="w-[100%] rounded-lg border-2 border-zinc-300 p-4 text-[#003E52] shadow-xl"
                              />

                              <button
                                className="w-full rounded-xl bg-[#003E52] p-3 font-medium text-white"
                                type="submit"
                              >
                                Guardar
                              </button>
                            </form>
                          </div>
                        )}
                      </div>
                    )
                  ) : (
                    <p>
                      No hay gráficos creados para{' '}
                      <span className="font-medium capitalize">
                        {translateChartType(type)}
                      </span>
                      .
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div
            className="section-margin my-28 flex flex-col gap-4"
            key={'conclusiones'}
          >
            <BannerSection text="Conclusiones financieras" id="conclusiones" />
            <form action={updateReport}>
              <input type="hidden" name="report_id" value={params.report_id} />
              <textarea
                name="analysis"
                defaultValue={report.analysis}
                className="h-[500px] w-full rounded-lg border-2 border-zinc-300 p-4 text-[#003E52] shadow-xl"
              />
              <button
                type="submit"
                className="mt-4 w-full rounded-lg bg-[#003E52] p-2 text-white"
              >
                Guardar cambios
              </button>
            </form>
          </div>

          <BannerSection
            text="Recomendaciones personalizadas"
            id="recomendaciones"
          />
          <div
            className="section-margin mt-16 flex flex-col gap-20 xl:gap-24"
            key={'recomendaciones'}
          >
            {report.recomendations.map((data: any) => (
              <form
                key={data.id}
                action={updateReportRecommendations}
                className="flex flex-col gap-4"
              >
                <input type="hidden" name="id" value={data.id} />
                <textarea
                  name="content"
                  defaultValue={data.content}
                  className="h-[500px] w-full rounded-lg border-2 border-zinc-300 p-4 text-[#003E52] shadow-xl"
                />

                <button
                  type="submit"
                  className="mt-4 rounded-lg bg-[#003E52] p-2 text-white"
                >
                  Guardar cambios
                </button>
              </form>
            ))}
          </div>

          <div className="section-margin my-28">
            <BannerSection
              text="Información adicional"
              id="información adicional"
            />
            {report.additional_info ? (
              <Image
                src={report.additional_info}
                alt="image"
                width={1000}
                height={1000}
                className="mx-auto my-5 h-[100%] rounded-xl xl:w-[1000px]"
              />
            ) : null}
            <form
              action={uploadImage}
              className="mt-12 flex flex-col gap-4 rounded-xl bg-[#252525]/10 p-4"
            >
              <input type="hidden" name="report_id" value={params.report_id} />
              <input
                type="hidden"
                name="business_id"
                value={params.business_id}
              />
              <input name="image" type="file" className="text-[#003E52]" />
              <button
                className="rounded-lg bg-[#003E52] p-2 text-white"
                type="submit"
              >
                Guardar imagen
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
