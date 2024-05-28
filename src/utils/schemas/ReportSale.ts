import mongoose, { Schema, ObjectId } from 'mongoose';
import propertiesSchema from './index'

const {
  totalRevenue,
  interest,
  marketing,
  create_at
} = propertiesSchema

export interface IReportSale {         //báo cáo bán hàng
  _id?: ObjectId;
  _product?: ObjectId;
  quantity?: number;
  totalRevenue?: number;
  create_at?: Date;
}

const ReportSaleSchema: Schema = new Schema({
  totalRevenue,
  interest,
  marketing,
  create_at
});

const ReportSale = mongoose.models.ReportSale || mongoose.model<IReportSale>('ReportSale', ReportSaleSchema);

export default ReportSale;

