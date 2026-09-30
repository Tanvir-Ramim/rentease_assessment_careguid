
import { FaMoneyBillWave } from "react-icons/fa";
import PaymentTable from "../components/PaymentTable";

const Payment = () => {
  return (
    <div className="@container">
      <div className="flex mt-2   @sm:flex-row flex-col @sm:items-center justify-between">
        <div className="flex items-center gap-3    w-fit">
          <div className="md:px-3  px-2 border border-gray-300 md:py-3 py-2 bg-white   rounded-xl flex items-center justify-center">
            <FaMoneyBillWave className="text-[#4640DE]" />
          </div>

          <p className="md:text-xl text-lg font-bold text-gray-900 leading-tight">
            Payments
          </p>
        </div>
      </div>
      <PaymentTable />
    </div>
  );
};

export default Payment;