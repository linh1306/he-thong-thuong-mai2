import { fetcher } from "..";

const path = {
  report: '/api/admin/report',
  reportTable: '/api/admin/report/fast',
  reportChart: '/api/admin/report/chart'
}

export interface IGetReportParams {
  start: string,
  end: string
}

export interface IGetReportChartBody {
  _product: string[],
  optionReport: string
}

const getReport = async (params: IGetReportParams): Promise<any> => {
  return fetcher({ url: path.report, method: "get", data: params })
}

const getReportTable = async (params: IGetReportParams): Promise<any> => {
  return fetcher({ url: path.reportTable, method: "get", data: params })
}

const getReportChart = async (body: IGetReportChartBody): Promise<any> => {
  return fetcher({ url: path.reportChart, method: "put", data: body })
}

export { getReport, getReportTable, getReportChart };