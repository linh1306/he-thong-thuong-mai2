import * as Yup from 'yup';

export interface Shape {
  [key: string]: any;
}

const yubShapes: Shape = {
  name: Yup.string().min(6, 'Tên tối thiểu chứa 6 kí tự').required('Name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  address: Yup.array().of(Yup.string()),
  phone: Yup.string().min(10, 'Tên tối thiểu chứa 10 số').required('Số điện thoại không được để trống'),
  status: Yup.boolean().required('Status is required'),
  create_at: Yup.date().required('Không được để trống'),
  exp_at: Yup.date().required('Không được để trống'),
  role: Yup.string().oneOf(['customer', 'admin', 'employee'], 'Invalid role').required('Role is required'),
  urlImage: Yup.string().url('Invalid URL format'),
  price: Yup.number().required('Giá không được để trống'),
  unitsInStock: Yup.number().required('Giá không được để trống'),
  description: Yup.string().required('Name is required'),
  quantity: Yup.number().required('Giá không được để trống'),
  percentSale: Yup.number().required('Giá không được để trống'),
  numberOfReviews: Yup.number().required('Giá không được để trống'),
  sumRating: Yup.number().required('Giá không được để trống'),
  unit: Yup.string().required('Name is required'),
  rate: Yup.number().required('Giá không được để trống'),
  total: Yup.number().required('Giá không được để trống'),
  statusInvoice: Yup.string().required('Name is required'),
  code: Yup.string().required('Name is required'),
  value: Yup.number().required('Giá không được để trống'),
  totalRevenue: Yup.number().required('Giá không được để trống'),
  interest: Yup.number().required('Giá không được để trống'),
  marketing: Yup.number().required('Giá không được để trống'),
  totalDiscount: Yup.number().required('Giá không được để trống')
}
export default yubShapes