import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  EyeInvisibleOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { Cascader, CascaderProps } from "antd";
import dataAddress from "@/utils/data/dataAddress";
import CInput from "../input";

interface Option {
  value: string;
  label: string;
  children?: Option[];
}

const options: Option[] = dataAddress

type TCascaderAddressProps = {
  value: string[];
  onChange: (value: string[]) => void;
};

export default function CCascaderAddress(props: TCascaderAddressProps) {
  const { value, onChange } = props;
  const [focusLabel, setFocusLabel] = useState(false)
  const [focusCascader, setFocusCascader] = useState(false)
  const handleChange: CascaderProps<Option>['onChange'] = (value: string[]) => {
    onChange(value)
  };
  

  return (
    <div className="w-full relative">
      <CInput type="text" value={value.join('/')} label="Địa chỉ" onChange={() => { }} onFocus={() => setFocusLabel(true)} onBlur={() => setFocusLabel(false)} />
      <div className="absolute bottom-0 w-full h-0 overflow-hidden">
        <Cascader
          id='address'
          showSearch
          open={focusLabel || focusCascader}
          onFocus={() => setFocusCascader(true)} onBlur={() => setFocusCascader(false)} 
          className="ant-select-open"
          defaultValue={[]} options={options} onChange={handleChange}
        />
      </div>
    </div>
  );
}
