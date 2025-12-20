import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Login from "../components/auth/Login";
import ForgotPassword from "../components/auth/ForgotPassword";
import ResetPassword from "../components/auth/ResetPassword";
import VerifyOtp from "../components/auth/VerifyOtp";
import AuthLayout from "../layout/AuthLayout";
import ErrorPage from "./ErrorPage";
import PrivateRoute from "./PrivatRoute";
import EditProfile from "../components/common/EditProfile";
import Profile from "../components/common/Profile";
import Users from "../components/mainDashboard/users/Users";
import PrivacyPolicy from "../components/mainDashboard/settings/privacypolicy/PrivacyPolicy";
import EditPrivacy from "../components/mainDashboard/settings/privacypolicy/EditPrivacy";
import EditTermCondition from "../components/mainDashboard/settings/termsCondition/EditTermCondition";
import TermCondition from "../components/mainDashboard/settings/termsCondition/TermCondition";
import About from "../components/mainDashboard/settings/about/About";
import EditAbout from "../components/mainDashboard/settings/about/EditAbout";
import Settings from "../components/mainDashboard/settings/Settings";
import ChangePassword from "../components/mainDashboard/settings/ChangePassword";
import Pricing from "../components/mainDashboard/pricing/Pricing";
import Order from "../components/mainDashboard/order/Order";
import Cabinetry from "../components/mainDashboard/cabinetry/Cabinetry";
import AddCabinetry from "../components/mainDashboard/cabinetry/AddCabinetry";
import EditCabinetry from "../components/mainDashboard/cabinetry/EditCabinetry";
import Inbox from "../components/mainDashboard/inbox/Inbox";
import UserDetails from "../components/mainDashboard/users/UserDetails";
import StockItem from "../components/mainDashboard/stockItem/StockItem";
import StockItemDetails from "../components/mainDashboard/stockItem/StockItemDetails";
import AddParts from "../components/mainDashboard/stockItem/AddParts";
import EditParts from "../components/mainDashboard/stockItem/EditParts";
import DashboardHome from "../components/mainDashboard/dashboard/DashboardHome";
import TransactionPage from "../components/mainDashboard/transaction/TransactionPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "users/:userId",
        element: <UserDetails />,
      },
      {
        path: "inbox",
        element: <Inbox />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "editprofile",
        element: <EditProfile />,
      },
      {
        path: "cabinetry",
        element: <Cabinetry />,
      },
      {
        path: "cabinetry/add-cabinetry/:categoryId",
        element: <AddCabinetry />,
      },
      {
        path: "cabinetry/edit-cabinetry/:cabinetId",
        element: <EditCabinetry />,
      },
      {
        path: "stock-items",
        element: <StockItem />,
      },
      {
        path: "stock-items/details/:stockItemId",
        element: <StockItemDetails />,
      },
      {
        path: "stock-items/add-part/:stockItemId/:stockItemTitleId",
        element: <AddParts />,
      },
      {
        path: "stock-items/edit-part/:partId",
        element: <EditParts />,
      },
      {
        path: "order",
        element: <Order />,
      },
      {
        path: "transaction",
        element: <TransactionPage />,
      },
      {
        path: "pricing",
        element: <Pricing />,
      },
      {
        path: "/inbox",
        element: <Inbox />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "settings/change-password",
        element: <ChangePassword />,
      },
      {
        path: "settings/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "settings/editprivacy-policy",
        element: <EditPrivacy />,
      },
      {
        path: "settings/term-condition",
        element: <TermCondition />,
      },
      {
        path: "settings/edit-termcondition",
        element: <EditTermCondition />,
      },
      {
        path: "settings/about",
        element: <About />,
      },
      {
        path: "settings/edit-about",
        element: <EditAbout />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgotpassword",
        element: <ForgotPassword />,
      },
      {
        path: "verifyotp",
        element: <VerifyOtp />,
      },
      {
        path: "resetpassword",
        element: <ResetPassword />,
      },
    ],
  },
  // {
  //   path: "/super-admin",
  //   element: (
  //     <SuperAdminPrivetRoute>
  //       <SuperAdminLayout />
  //     </SuperAdminPrivetRoute>
  //   ),
  //   children: [
  //     {
  //       index: true,
  //       element: <SuperAdmin />,
  //     },
  //     {
  //       path: "branch-admins/:branchId",
  //       element: <BranchAdminSupportingAdmins />,
  //     },
  //     {
  //       path: "profile",
  //       element: <SuperAdminProfile />,
  //     },
  //     {
  //       path: "editprofile",
  //       element: <SuperAdminEditProfile />,
  //     },
  //     {
  //       path: "settings",
  //       element: <SuperAdminSettings />,
  //     },
  //     {
  //       path: "settings/change-password",
  //       element: <SuperAdminChangePassword />,
  //     },
  //     {
  //       path: "settings/privacy-policy",
  //       element: <PrivacyPolicy />,
  //     },
  //     {
  //       path: "settings/editprivacy-policy",
  //       element: <EditPrivacy />,
  //     },
  //     {
  //       path: "settings/term-condition",
  //       element: <TermCondition />,
  //     },
  //     {
  //       path: "settings/edit-termcondition",
  //       element: <EditTermCondition />,
  //     },
  //     {
  //       path: "settings/about",
  //       element: <About />,
  //     },
  //     {
  //       path: "settings/edit-about",
  //       element: <EditAbout />,
  //     },
  //   ],
  // },
]);
