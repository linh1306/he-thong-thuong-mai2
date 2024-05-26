import mongoose, { Schema, ObjectId } from 'mongoose';
import propertiesSchema from './index'

const {
  totalRevenue,
  interest,
  marketing,
  create_at
} = propertiesSchema

export interface IReportRevenue {         //báo cáo doanh thu
  _id?: ObjectId;
  totalRevenue?: number;
  interest?: number;
  marketing?: number;
  create_at?: Date;
}

const ReportRevenueSchema: Schema = new Schema({
  totalRevenue,
  interest,
  marketing,
  create_at
});

const ReportRevenue = mongoose.models.ReportRevenue || mongoose.model<IReportRevenue>('ReportRevenue', ReportRevenueSchema);

export default ReportRevenue;

