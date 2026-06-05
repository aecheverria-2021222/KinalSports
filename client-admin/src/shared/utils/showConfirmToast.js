import React from "react";
import { toast } from "react-hot-toast";

export const showConfirmToast = ({ title, message, onConfirm }) => {
  toast.custom((t) =>
    React.createElement(
      "div",
      {
        className:
          "bg-white p-6 rounded-xl w-96 text-center shadow-lg border border-gray-200",
      },
      React.createElement("h2", { className: "text-xl font-bold mb-2" }, title),
      React.createElement("p", { className: "mb-4" }, message),
      React.createElement(
        "div",
        { className: "flex justify-center gap-4 mt-4" },
        React.createElement(
          "button",
          {
            onClick: () => toast.dismiss(t.id),
            className:
              "px-5 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition",
          },
          "Cancelar",
        ),
        React.createElement(
          "button",
          {
            onClick: () => {
              onConfirm?.();
              toast.dismiss(t.id);
            },
            className:
              "px-5 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition",
          },
          "Confirmar",
        ),
      ),
    ),
  );
};
