import { useState, useEffect } from "react";
import CustomTable from "../../../../components/Table/Table";
import styles from "./statement.module.css";
import type { ColumnsType } from "antd/es/table";
import Button from "../../../../components/Button/Button";
import { useNavigate, useLocation } from "react-router-dom";
import {
    AccountStatementRequest,
    useStatementAccountList,
    Statement,
} from "../account";
import Loader from "../../../../components/Loader/loader";
import openNotificationWithIcon, {
    CommonnotificationProps,
} from "../../../../components/Notification/commonnotification";
import { notification } from "antd";
import { useCustomerContext } from "../../../../context/customerDetailsContext";
import { Repayment } from "../Repayment/repayment";
import { useRecoilValue } from "recoil";
import { accountListDataAtom } from "../../../../state";

interface DataType {
    key: string;
    date: string;
    referenceNumber: string;
    details: string;
    creditDebit: string;
    amount: string;
}

export const AccountStatement = () => {
    const navigate = useNavigate();
    const accountListMutation = useStatementAccountList();

    const {
        state: { selectedAccount },
    } = useLocation();
    const [accountStatement, setAccountStatement] = useState<Statement[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const { setCustomerData } = useCustomerContext();
    const [activeSettlement, setActiveToggleSettlement] = useState(true);

    useEffect(() => {
        if (sessionStorage.getItem("customerDraftFlag") === "true") {
            setCustomerData((prev) => ({
                ...prev,
                customerDraftFlag: true,
            }));
        }
        selectedAccount && fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        const request: AccountStatementRequest = {
            instituteCode: sessionStorage.getItem("instituteCode") || "{}",
            transmissionTime: Date.now(),
            acctNo: selectedAccount[0].acctNo,
            productCateory: selectedAccount[0].productCategory,
        };

        const data: any = await accountListMutation.mutateAsync(request);
        if (data.status) {
            setAccountStatement(data?.data.stmtData);
            setIsLoading(false);
        } else if (
            data.errorCode === "CI_JWT_001" ||
            data.errorCode === "CI_JWT_002"
        ) {
            const notificationData: CommonnotificationProps = {
                type: "info",
                msgtitle: "Notification",
                msgDesc: "Your session is over, Please login again",
                api: api,
            };
            openNotificationWithIcon(notificationData);
            setTimeout(() => {
                navigate({ pathname: "/login" });
            }, 3000);
        } else {
            setIsLoading(false);
        }
    };

    console.log(selectedAccount);
    const columns: ColumnsType<DataType> = [
        {
            title: "Date",
            dataIndex: "txnDate",
            key: "txnDate",
        },
        {
            title: "Reference Number",
            dataIndex: "refNo",
            key: "refNo",
        },
        {
            title: "Details",
            dataIndex: "tranDesc",
            key: "tranDesc",
        },
        {
            title: "Credit/Debit",
            dataIndex: "drcr",
            key: "drcr",
        },
        {
            title: "Amount",
            dataIndex: "txnAmt",
            key: "txnAmt",
            align: "right",
            render: (text, record: any) => {
                const cellStyle = {
                    color: record.drcr === "Debit" ? "red" : "#052A47",
                };
                const amountWithoutCurrency = text.replace(/^NGN/, "");
                return <div style={cellStyle}>{amountWithoutCurrency}</div>;
            },
        },
    ];

    const handletoggle = () => {
        setActiveToggleSettlement(!activeSettlement);
    };

    return (
        <>
            {contextHolder}
            <div className={"main-container"}>
                <Loader loading={isLoading} />
                <div className={"main-heading"}>
                    {!activeSettlement ? "" : "Account Statement"}
                </div>

                <div className={styles["sub-heading"]}>
                    {selectedAccount.length > 0 &&
                    selectedAccount[0].productCategory === "DP" ? (
                        <div
                            className={
                                styles[
                                    activeSettlement
                                        ? "active-toggle"
                                        : "normal"
                                ]
                            }
                            onClick={handletoggle}
                        >
                            Statement
                        </div>
                    ) : (
                        <>
                            <div
                                className={
                                    styles[
                                        activeSettlement
                                            ? "active-toggle"
                                            : "normal"
                                    ]
                                }
                                onClick={handletoggle}
                            >
                                Statement
                            </div>
                            <div
                                className={
                                    styles[
                                        activeSettlement
                                            ? "normal"
                                            : "active-toggle"
                                    ]
                                }
                                onClick={handletoggle}
                            >
                                Repayment
                            </div>
                        </>
                    )}
                </div>

                {!activeSettlement && !isLoading ? (
                    <Repayment />
                ) : (
                    <section className={styles["account-statement-content"]}>
                        <div className={styles["statement-table-container"]}>
                            <CustomTable
                                columns={columns}
                                data={accountStatement}
                                tableTitle={"Transactions"}
                            />
                        </div>
                        <div className={styles["statement-mobile-container"]}>
                            <div className={styles["statement-mobile-header"]}>
                                Transactions
                            </div>
                            <div className={styles["statement-box-container"]}>
                                {accountStatement?.map(
                                    ({
                                        txnDate,
                                        refNo,
                                        tranDesc,
                                        drcr,
                                        txnAmt,
                                    }) => (
                                        <div
                                            className={styles["statement-box"]}
                                        >
                                            <p>{refNo}</p>
                                            <p>{tranDesc}</p>
                                            <p>{txnDate}</p>
                                            <p>{txnAmt}</p>
                                            <p>{drcr}</p>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                        <div className={styles["buton-container"]}>
                            <Button
                                text={"Back"}
                                type={"button"}
                                disabled={false}
                                buttonType={"back"}
                                icon={true}
                                onClick={() => navigate("/dashboard/account")}
                            />
                        </div>
                    </section>
                )}
            </div>
        </>
    );
};
