import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  RefreshCw,
  X,
  Info,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const ErrorMessage = ({
  message = "Something went wrong",
  onRetry,
  buttonText = "Try Again",
  type = "error",
  dismissible = false,
  autoDismiss = false,
  dismissTime = 5000,
  className = "",
  details = "",
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (autoDismiss && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, dismissTime);

      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissTime, isVisible]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={32} className="text-green-500" />;
      case "warning":
        return <AlertTriangle size={32} className="text-yellow-500" />;
      case "info":
        return <Info size={32} className="text-blue-500" />;
      default:
        return <AlertCircle size={32} className="text-red-500" />;
    }
  };

  const getContainerClass = () => {
    const baseClasses =
      "relative p-6 rounded-xl shadow-lg border-l-4 max-w-md mx-auto transition-all duration-300 transform";

    switch (type) {
      case "success":
        return `${baseClasses} bg-green-50 border-green-500 ${className}`;
      case "warning":
        return `${baseClasses} bg-yellow-50 border-yellow-500 ${className}`;
      case "info":
        return `${baseClasses} bg-blue-50 border-blue-500 ${className}`;
      default:
        return `${baseClasses} bg-red-50 border-red-500 ${className}`;
    }
  };

  const getButtonClass = () => {
    const baseClasses =
      "flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

    switch (type) {
      case "success":
        return `${baseClasses} bg-green-600 text-white hover:bg-green-700 focus:ring-green-500`;
      case "warning":
        return `${baseClasses} bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500`;
      case "info":
        return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`;
      default:
        return `${baseClasses} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`;
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black bg-opacity-50">
      <div className={getContainerClass()} role="alert" aria-live="assertive">
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors"
            aria-label="Dismiss error message"
          >
            <X size={18} />
          </button>
        )}

        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">{getIcon()}</div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold capitalize">
              {type === "error" ? "Error" : type}
            </h3>

            <p className="mt-2 text-gray-700">{message}</p>

            {details && (
              <div className="mt-3">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-sm text-gray-500 hover:text-gray-700 underline focus:outline-none"
                >
                  {showDetails ? "Hide details" : "Show details"}
                </button>

                {showDetails && (
                  <div className="mt-2 p-3 bg-gray-100 rounded-lg overflow-auto max-h-32">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                      {details}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {onRetry && (
              <div className="mt-4 flex space-x-3">
                <button onClick={onRetry} className={getButtonClass()}>
                  <RefreshCw size={16} className="mr-2" />
                  {buttonText}
                </button>

                {dismissible && (
                  <button
                    onClick={handleDismiss}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {autoDismiss && (
          <div className="absolute bottom-0 left-0 h-1 bg-gray-300 w-full">
            <div
              className="h-full bg-gray-500 transition-all duration-500 ease-linear"
              style={{ width: "100%" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
