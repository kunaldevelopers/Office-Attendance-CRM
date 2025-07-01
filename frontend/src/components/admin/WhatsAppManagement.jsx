import React, { useState, useEffect } from "react";
import {
  Smartphone,
  Play,
  Square,
  RotateCcw,
  QrCode,
  Send,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader,
  Wifi,
  WifiOff,
  LogOut,
} from "lucide-react";
import { adminAPI } from "../../services/api";

const WhatsAppManagement = () => {
  const [status, setStatus] = useState({
    ready: false,
    initializing: false,
    hasClient: false,
    qrCode: null,
    connectedInfo: null,
    isManuallyDisconnected: false,
  });
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [loading, setLoading] = useState({
    status: false,
    start: false,
    stop: false,
    restart: false,
    forceRestart: false,
    disconnect: false,
    qr: false,
    test: false,
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [testMessage, setTestMessage] = useState("");

  // Fetch status periodically with enhanced error handling
  useEffect(() => {
    const fetchStatusNow = async () => {
      try {
        setLoading((prev) => ({ ...prev, status: true }));
        const response = await adminAPI.getWhatsAppStatus();

        // Handle different response scenarios
        if (response.data && response.data.data) {
          setStatus(response.data.data);
        } else {
          // If response is malformed, set safe defaults
          setStatus({
            ready: false,
            initializing: false,
            hasClient: false,
            qrCode: null,
            connectedInfo: null,
            isManuallyDisconnected: false,
          });
        }
      } catch (error) {
        console.error("Failed to fetch WhatsApp status:", error);

        // Handle different types of errors
        if (error.code === "NETWORK_ERROR" || error.code === "ECONNREFUSED") {
          showMessage(
            "error",
            "Cannot connect to WhatsApp service. Please check if the backend is running."
          );
        } else if (error.response?.status === 500) {
          showMessage(
            "error",
            "WhatsApp service encountered an error. It may have crashed due to connection issues."
          );
          // Reset status to safe state when service crashes
          setStatus({
            ready: false,
            initializing: false,
            hasClient: false,
            qrCode: null,
            connectedInfo: null,
            isManuallyDisconnected: false,
          });
        } else {
          showMessage("error", "Failed to fetch WhatsApp status");
        }
      } finally {
        setLoading((prev) => ({ ...prev, status: false }));
      }
    };

    fetchStatusNow();
    const interval = setInterval(fetchStatusNow, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading((prev) => ({ ...prev, status: true }));
      const response = await adminAPI.getWhatsAppStatus();

      if (response.data && response.data.data) {
        setStatus(response.data.data);
      } else {
        setStatus({
          ready: false,
          initializing: false,
          hasClient: false,
          qrCode: null,
          connectedInfo: null,
          isManuallyDisconnected: false,
        });
      }
    } catch (error) {
      console.error("Failed to fetch WhatsApp status:", error);

      if (error.code === "NETWORK_ERROR" || error.code === "ECONNREFUSED") {
        showMessage("error", "Cannot connect to WhatsApp service");
      } else if (error.response?.status === 500) {
        showMessage(
          "error",
          "WhatsApp service error - connection may have been manually removed"
        );
        setStatus({
          ready: false,
          initializing: false,
          hasClient: false,
          qrCode: null,
          connectedInfo: null,
          isManuallyDisconnected: false,
        });
      } else {
        showMessage("error", "Failed to fetch WhatsApp status");
      }
    } finally {
      setLoading((prev) => ({ ...prev, status: false }));
    }
  };

  const fetchQRCode = async () => {
    try {
      setLoading((prev) => ({ ...prev, qr: true }));
      const response = await adminAPI.getWhatsAppQR();

      if (response.data && response.data.data && response.data.data.qrCode) {
        setQrCodeImage(response.data.data.qrCode);
        showMessage("success", "QR code loaded successfully");
      } else {
        showMessage(
          "error",
          "QR code not available - please start the service first"
        );
        setQrCodeImage(null);
      }
    } catch (error) {
      console.error("Failed to fetch QR code:", error);

      if (error.response?.status === 500) {
        showMessage(
          "error",
          "WhatsApp service error - please restart the service"
        );
      } else {
        showMessage(
          "error",
          error.response?.data?.error?.message || "Failed to load QR code"
        );
      }
      setQrCodeImage(null);
    } finally {
      setLoading((prev) => ({ ...prev, qr: false }));
    }
  };

  const startService = async () => {
    try {
      setLoading((prev) => ({ ...prev, start: true }));
      await adminAPI.startWhatsAppService();
      showMessage("success", "WhatsApp service started successfully");
      setQrCodeImage(null); // Clear any old QR code
      setTimeout(fetchStatus, 1000);
    } catch (error) {
      console.error("Failed to start WhatsApp service:", error);

      if (error.response?.status === 500) {
        showMessage(
          "error",
          "Server error - WhatsApp service may have crashed. Try force restart."
        );
      } else {
        showMessage(
          "error",
          error.response?.data?.error?.message || "Failed to start service"
        );
      }
    } finally {
      setLoading((prev) => ({ ...prev, start: false }));
    }
  };

  const stopService = async () => {
    try {
      setLoading((prev) => ({ ...prev, stop: true }));
      await adminAPI.stopWhatsAppService();
      showMessage("success", "WhatsApp service stopped successfully");
      setQrCodeImage(null);
      setTimeout(fetchStatus, 1000);
    } catch (error) {
      console.error("Failed to stop WhatsApp service:", error);
      showMessage(
        "error",
        error.response?.data?.error?.message || "Failed to stop service"
      );
    } finally {
      setLoading((prev) => ({ ...prev, stop: false }));
    }
  };

  const restartService = async () => {
    try {
      setLoading((prev) => ({ ...prev, restart: true }));
      await adminAPI.restartWhatsAppService();
      showMessage("success", "WhatsApp service restart initiated");
      setQrCodeImage(null);
      setTimeout(fetchStatus, 2000);
    } catch (error) {
      console.error("Failed to restart WhatsApp service:", error);
      showMessage(
        "error",
        error.response?.data?.error?.message || "Failed to restart service"
      );
    } finally {
      setLoading((prev) => ({ ...prev, restart: false }));
    }
  };

  const forceRestartService = async () => {
    try {
      setLoading((prev) => ({ ...prev, forceRestart: true }));
      await adminAPI.forceRestartWhatsAppService();
      showMessage(
        "success",
        "WhatsApp service force restart initiated - this may take a few seconds"
      );
      setQrCodeImage(null);
      setTimeout(fetchStatus, 3000);
    } catch (error) {
      console.error("Failed to force restart WhatsApp service:", error);
      showMessage(
        "error",
        error.response?.data?.error?.message ||
          "Failed to force restart service"
      );
    } finally {
      setLoading((prev) => ({ ...prev, forceRestart: false }));
    }
  };

  const disconnectWhatsApp = async () => {
    if (
      !window.confirm(
        "Are you sure you want to disconnect the current WhatsApp account? You will need to scan a new QR code to reconnect."
      )
    ) {
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, disconnect: true }));
      await adminAPI.disconnectWhatsApp();
      showMessage(
        "success",
        "WhatsApp account disconnected successfully. You can now connect a different account."
      );
      setQrCodeImage(null);
      setTimeout(fetchStatus, 1000);
    } catch (error) {
      console.error("Failed to disconnect WhatsApp:", error);
      showMessage(
        "error",
        error.response?.data?.error?.message ||
          "Failed to disconnect WhatsApp account"
      );
    } finally {
      setLoading((prev) => ({ ...prev, disconnect: false }));
    }
  };

  const sendTestMessage = async () => {
    try {
      setLoading((prev) => ({ ...prev, test: true }));
      await adminAPI.testWhatsAppMessage({ message: testMessage });
      showMessage("success", "Test message sent successfully!");
      setTestMessage("");
    } catch (error) {
      console.error("Failed to send test message:", error);
      showMessage(
        "error",
        error.response?.data?.error?.message || "Failed to send test message"
      );
    } finally {
      setLoading((prev) => ({ ...prev, test: false }));
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const getStatusIcon = () => {
    if (status.ready) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (status.initializing) {
      return <Loader className="w-5 h-5 text-yellow-500 animate-spin" />;
    } else {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusText = () => {
    if (status.ready) {
      return "Connected & Ready";
    } else if (status.initializing) {
      return "Initializing...";
    } else if (status.isManuallyDisconnected) {
      return "Manually Stopped";
    } else {
      return "Disconnected";
    }
  };

  const getStatusColor = () => {
    if (status.ready) {
      return "text-green-800 bg-green-50 border-green-200";
    } else if (status.initializing) {
      return "text-yellow-800 bg-yellow-50 border-yellow-200";
    } else {
      return "text-red-800 bg-red-50 border-red-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-2">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Smartphone className="h-5 w-5 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                WhatsApp Integration
              </h1>
            </div>
            <p className="text-gray-600">
              Manage WhatsApp messaging for attendance notifications
            </p>
          </div>
          <button
            onClick={fetchStatus}
            disabled={loading.status}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors text-sm"
          >
            {loading.status ? (
              <Loader className="w-4 h-4 animate-spin text-gray-500" />
            ) : (
              <RotateCcw className="w-4 h-4 text-gray-500" />
            )}
            <span className="font-medium text-gray-700">Refresh Status</span>
          </button>
        </div>
      </div>

      {/* Message Display */}
      {message.text && (
        <div
          className={`p-4 rounded-lg border text-sm ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : message.type === "error"
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-yellow-50 border-yellow-200 text-yellow-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <CheckCircle className="w-4 h-4" />
            ) : message.type === "error" ? (
              <XCircle className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            {message.text}
          </div>
        </div>
      )}

      {/* Service Status Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Service Status
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Info */}
          <div className="space-y-4">
            <div
              className={`flex items-center gap-3 p-3 rounded-lg border ${getStatusColor()}`}
            >
              {getStatusIcon()}
              <div>
                <div className="font-medium text-sm">{getStatusText()}</div>
                {status.connectedInfo && (
                  <div className="text-sm text-gray-600">
                    Connected as: {status.connectedInfo.name} (
                    {status.connectedInfo.number})
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                {status.hasClient ? (
                  <Wifi className="w-4 h-4 text-green-500" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-500" />
                )}
                <span className="text-gray-600">
                  Client: {status.hasClient ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {status.ready ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span className="text-gray-600">
                  Ready: {status.ready ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="space-y-3">
            <button
              onClick={startService}
              disabled={loading.start || status.ready || status.initializing}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium text-sm"
            >
              {loading.start ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              Start Service
            </button>

            <button
              onClick={stopService}
              disabled={loading.stop || (!status.ready && !status.initializing)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium text-sm"
            >
              {loading.stop ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              Stop Service
            </button>

            <button
              onClick={restartService}
              disabled={loading.restart}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium text-sm"
            >
              {loading.restart ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <RotateCcw className="w-4 h-4" />
              )}
              Restart Service
            </button>

            {status.initializing && (
              <button
                onClick={forceRestartService}
                disabled={loading.forceRestart}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium text-sm"
              >
                {loading.forceRestart ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
                Force Reset
              </button>
            )}

            {status.ready && (
              <button
                onClick={disconnectWhatsApp}
                disabled={loading.disconnect}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium text-sm"
              >
                {loading.disconnect ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                Disconnect WhatsApp
              </button>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            QR Code Authentication
          </h3>
          <button
            onClick={fetchQRCode}
            disabled={loading.qr || !status.qrCode}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium text-sm"
          >
            {loading.qr ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <QrCode className="w-4 h-4" />
            )}
            Load QR Code
          </button>
        </div>

        {qrCodeImage ? (
          <div className="text-center">
            <img
              src={qrCodeImage}
              alt="WhatsApp QR Code"
              className="mx-auto mb-4 border border-gray-200 rounded-lg"
            />
            <p className="text-sm text-gray-600">
              Scan this QR code with your WhatsApp mobile app:
              <br />
              WhatsApp → Linked Devices → Link a Device
            </p>
          </div>
        ) : status.qrCode ? (
          <div className="text-center py-8">
            <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              QR code is available. Click "Load QR Code" to display it.
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {status.ready
                ? "Already authenticated"
                : "Start the service to generate a QR code"}
            </p>
          </div>
        )}
      </div>

      {/* Test Message Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Test Message
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Message (Optional)
            </label>
            <textarea
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Enter a custom test message or leave empty for default message..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm resize-none"
              rows={3}
              maxLength={1000}
            />
            <p className="text-xs text-gray-500 mt-1">
              {testMessage.length}/1000 characters
            </p>
          </div>

          <button
            onClick={sendTestMessage}
            disabled={loading.test || !status.ready}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium text-sm"
          >
            {loading.test ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Send Test Message
          </button>
        </div>
      </div>

      {/* Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Important Notes:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>
                WhatsApp authentication is optional - attendance tracking works
                without it
              </li>
              <li>QR code expires after 60 seconds - refresh if needed</li>
              <li>Only one WhatsApp account can be connected at a time</li>
              <li>
                Use "Disconnect WhatsApp" to logout current account and connect
                a different one
              </li>
              <li>Test messages are sent to the configured WhatsApp group</li>
              <li>
                If WhatsApp is logged out externally, restart the service to
                reconnect
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppManagement;
