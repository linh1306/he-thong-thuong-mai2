import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  EyeInvisibleOutlined,
  EyeOutlined
} from '@ant-design/icons';

type TValue<T> = T extends 'number' ? number : string;
type TOnChange<T> = T extends 'number' ? Dispatch<SetStateAction<number>> : Dispatch<SetStateAction<string>>;

type TInputProps = {
  label: string;
  type: 'text' | 'email' | 'password' | 'number';
  value: TValue<TInputProps['type']>;
  onChange: TOnChange<TInputProps['type']>;
  onFocus?: () => void;
  onBlur?: () => void;
};

export default function CInput(props: TInputProps) {
  const { label, type, value, onChange, onFocus, onBlur } = props;
  const [typePassword, setTypePassword] = useState(true)

  return (
    <div className="w-full relative text-white pt-4 config-input">
      <input
        id={label}
        className="w-full bg-transparent outline-none border-b-2 pl-2 font-extralight text-sm"
        type={type === 'password' && !typePassword ? 'text' : type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) : e.target.value as any)}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <label className="absolute left-0 text-sm transition-all duration-500" htmlFor={label}>{label}</label>
      {type === 'password' && (
        <div className='absolute right-0 bottom-0 cursor-pointer' onClick={() => setTypePassword(prop => !prop)}>
          {typePassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        </div>
      )}
    </div>
  );
}
