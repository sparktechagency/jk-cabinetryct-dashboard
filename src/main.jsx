import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { router } from "./router/Route.jsx";
import { ConfigProvider } from "antd";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#721011",
          },
        }}
      >
        <Toaster position="top-center" reverseOrder={false} />
        <RouterProvider router={router} />
      </ConfigProvider>
    </Provider>
  </StrictMode>
);
