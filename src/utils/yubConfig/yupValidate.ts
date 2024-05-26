import * as Yup from 'yup';
import yubShapes, { Shape } from '.';

export default async function yupValidate(params: object) {
  const keysParam: string[] = Object.keys(params)
  const shape: Shape = {}
  keysParam.forEach(key => {
    shape[key] = yubShapes[key]
  });

  const paramsValidate = Yup.object().shape(shape);

  try {
    await paramsValidate.validate(params, { abortEarly: false });
    return { valid: true, invalidFields: {}, fields:[] };
  } catch (err) {
    const invalidFields: { [key: string]: string } = {};
    
    if (err instanceof Yup.ValidationError) {
      err.inner.forEach((error) => {
        if (error.path) {
          invalidFields[error.path] = error.message;
        }
      });
    }

    return { valid: false, invalidFields, fields:Object.keys(invalidFields) };
  }
}