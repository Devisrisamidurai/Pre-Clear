import { useState } from "react";
import { HomePage } from "./components/HomePage";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { Layout } from "./components/Layout";

// Shipper Pages
import { ShipperDashboard } from "./components/shipper/ShipperDashboard";
import { CreateShipment } from "./components/shipper/CreateShipment";
import { ShipmentDetails } from "./components/shipper/ShipmentDetails";
import { UploadDocuments } from "./components/shipper/UploadDocuments";
import { AIEvaluationStatus } from "./components/shipper/AIEvaluationStatus";
import { RequestBrokerApproval } from "./components/shipper/RequestBrokerApproval";
import { ChatNotifications } from "./components/shipper/ChatNotifications";
import { ShipmentToken } from "./components/shipper/ShipmentToken";
import { ShipmentTokenList } from "./components/shipper/ShipmentTokenList";
import { ShipmentBooking } from "./components/shipper/ShipmentBooking";
import { PaymentPage } from "./components/shipper/PaymentPage";
import { PaymentList } from "./components/shipper/PaymentList";
import { ShipperProfile } from "./components/shipper/ShipperProfile";

// Broker Pages
import { BrokerDashboard } from "./components/broker/BrokerDashboard";
import { PendingReview } from "./components/broker/PendingReview";
import { BrokerReviewShipment } from "./components/broker/BrokerReviewShipment";
import { DocumentReview } from "./components/broker/DocumentReview";
import { RequestDocuments } from "./components/broker/RequestDocuments";
import { BrokerChat } from "./components/broker/BrokerChat";
import { BrokerProfile } from "./components/broker/BrokerProfile";

// Admin Pages
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { UserManagement } from "./components/admin/UserManagement";
import { SystemConfig } from "./components/admin/SystemConfig";
import { AIRulesMonitoring } from "./components/admin/AIRulesMonitoring";
import { ApprovalLogs } from "./components/admin/ApprovalLogs";
import { ShipmentTracking } from "./components/admin/ShipmentTracking";
import { ImportExportRules } from "./components/admin/ImportExportRules";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [currentPage, setCurrentPage] = useState("home");
  const [currentShipment, setCurrentShipment] = useState(null);

  const handleLogin = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole("");
    setCurrentPage("home");
    setCurrentShipment(null);
  };

  const handleNavigate = (page, data) => {
    setCurrentPage(page);
    if (data) {
      setCurrentShipment(data);
    }
  };

  const renderShipperPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <ShipperDashboard onNavigate={handleNavigate} />;
      case "create-shipment":
        return (
          <CreateShipment
            onNavigate={handleNavigate}
            onSave={setCurrentShipment}
          />
        );
      case "shipment-details":
        return (
          <ShipmentDetails
            shipment={currentShipment}
            onNavigate={handleNavigate}
          />
        );
      case "upload-documents":
        return (
          <UploadDocuments
            shipment={currentShipment}
            onNavigate={handleNavigate}
          />
        );
      case "ai-evaluation":
        return (
          <AIEvaluationStatus
            shipment={currentShipment}
            onNavigate={handleNavigate}
          />
        );
      case "request-broker":
        return (
          <RequestBrokerApproval
            shipment={currentShipment}
            onNavigate={handleNavigate}
          />
        );
      case "chat":
        return (
          <ChatNotifications onNavigate={handleNavigate} />
        );
      case "shipment-token":
        return (
          <ShipmentToken
            shipment={currentShipment}
            onNavigate={handleNavigate}
          />
        );
      case "shipment-token-list":
        return (
          <ShipmentTokenList onNavigate={handleNavigate} />
        );
      case "booking":
        return (
          <ShipmentBooking
            shipment={currentShipment}
            onNavigate={handleNavigate}
          />
        );
      case "payment":
        return (
          <PaymentPage
            shipment={currentShipment}
            onNavigate={handleNavigate}
          />
        );
      case "payment-list":
        return <PaymentList onNavigate={handleNavigate} />;
      case "profile":
        return <ShipperProfile />;
      default:
        return <ShipperDashboard onNavigate={handleNavigate} />;
    }
  };

  const renderBrokerPage = () => {
    switch (currentPage) {
      case "dashboard":
      case "broker-dashboard":
        return <BrokerDashboard onNavigate={handleNavigate} />;
      case "pending-review":
        return <PendingReview onNavigate={handleNavigate} />;
      case "broker-review":
        return (
          <BrokerReviewShipment
            shipment={currentShipment}
            onNavigate={handleNavigate}
          />
        );
      case "document-review":
        return (
          <DocumentReview
            shipment={currentShipment}
            onNavigate={handleNavigate}
          />
        );
      case "request-documents":
        return (
          <RequestDocuments
            shipment={currentShipment}
            onNavigate={handleNavigate}
          />
        );
      case "chat":
        return <BrokerChat onNavigate={handleNavigate} />;
      case "profile":
        return <BrokerProfile />;
      default:
        return <BrokerDashboard onNavigate={handleNavigate} />;
    }
  };

  const renderAdminPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <AdminDashboard onNavigate={handleNavigate} />;
      case "user-management":
        return <UserManagement />;
      case "system-config":
        return <SystemConfig />;
      case "ai-monitoring":
        return <AIRulesMonitoring />;
      case "approval-logs":
        return <ApprovalLogs />;
      case "tracking":
        return <ShipmentTracking />;
      case "import-export-rules":
        return <ImportExportRules />;
      default:
        return <AdminDashboard onNavigate={handleNavigate} />;
    }
  };

  const renderPage = () => {
    if (userRole === "shipper") return renderShipperPage();
    if (userRole === "broker") return renderBrokerPage();
    if (userRole === "admin") return renderAdminPage();
    return <ShipperDashboard onNavigate={handleNavigate} />;
  };

  // Show HomePage by default
  if (!isLoggedIn && currentPage === "home") {
    return <HomePage onLogin={() => setCurrentPage("login")} onSignup={() => setCurrentPage("signup")} />;
  }

  // Show LoginPage when navigated to
  if (!isLoggedIn && currentPage === "login") {
    return <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />;
  }

  // Show SignupPage when navigated to
  if (!isLoggedIn && currentPage === "signup") {
    return <SignupPage onNavigate={setCurrentPage} />;
  }

  // Show app with layout when logged in
  return (
    <Layout
      userRole={userRole}
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      {renderPage()}
    </Layout>
  );
}

