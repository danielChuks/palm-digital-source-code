import React from "react";
import { ConfigProvider, DatePickerProps } from "antd";
import { DatePicker, Space } from "antd";
import styles from "./customDatePicker.module.css";
import { formatDateReverse } from "../../Utils/UtilityFunctions/utilityFunctions";
import dayjs from "dayjs";

interface CustomDatePickerProps {
    onChange?: any;
    placeholder?: string;
    value?: any;
    name?: any;
    label?: any;
    icon?: any;
    readonly?: boolean;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
    onChange,
    placeholder,
    name,
    label,
    icon,
    readonly,
    value,
}: CustomDatePickerProps) => {
    return (
        <>
            <div className={styles["label"]}>{label}</div>
            <div className={styles["custom-datepicker-container"]}>
                <Space direction='vertical'>
                    <ConfigProvider
                        theme={{
                            token: {
                                colorPrimary: "#d9d9d9",
                            },
                        }}
                    >
                        <DatePicker
                            format='DD/MM/YYYY'
                            allowClear={false}
                            onChange={onChange}
                            value={value ? dayjs(value, "DD/MM/YYYY") : null}
                            name={name}
                            placeholder={placeholder}
                            disabled={readonly}
                        />
                    </ConfigProvider>
                </Space>
            </div>
        </>
    );
};

export default CustomDatePicker;
