import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastMessage = () => {
  const dispatch = useDispatch();
  const { toastMessage } = useSelector((state) => state.ui);

  useEffect(() => {
    if (!toastMessage) return;

    const { message, status } = toastMessage;
    if (!message || !status) return;

    const toastMap = {
      success: toast.success,
      error: toast.error,
      warning: toast.warning,
      info: toast.info,
    };

    const show = toastMap[status];
    if (show) {
      show(message, {
        theme: "colored",
        toastId: `${status}-${message}`,
      });
    }
  }, [toastMessage, dispatch]);

  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};

export default ToastMessage;
