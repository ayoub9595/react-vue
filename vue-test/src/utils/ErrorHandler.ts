// utils/errorHandler.ts

interface ErrorResponse {
    title: string;
    message: string;
    class: "danger" | "warning" | "info";
  }
  
  export const handleApiError = (error: unknown): ErrorResponse => {
    // Firebase errors
    if (error instanceof Error) {
      if (error.message.includes("permission-denied")) {
        return {
          title: "Access Denied",
          message: "You don't have permission to perform this action",
          class: "danger",
        };
      }
      if (error.message.includes("network")) {
        return {
          title: "Network Error",
          message: "Please check your internet connection",
          class: "warning",
        };
      }
    }
  
    // Default error response
    return {
      title: "Error",
      message: "An unexpected error occurred. Please try again.",
      class: "danger",
    };
  };
  
  // Log errors for monitoring/debugging
  export const logError = (error: unknown, context: string) => {
    console.error(`Error in ${context}:`, {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
  };
  