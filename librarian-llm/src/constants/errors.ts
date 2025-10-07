export const ERROR_MESSAGES = {
  CONNECTION_ERROR: {
    message: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
    troubleshooting: [
      "Check if the API endpoint is configured correctly",
      "Verify environment variables are set in Netlify",
      "Check browser console for specific errors"
    ]
  },
  API_KEY_ERROR: {
    message: "Authentication error. The API key may be misconfigured.",
    troubleshooting: [
      "Verify CLAUDE_API_KEY is set in Netlify environment variables",
      "Check if the API key is valid and not expired",
      "Ensure the key starts with 'sk-ant-api'"
    ]
  },
  MODEL_ERROR: {
    message: "Configuration error. The AI model may not be available.",
    troubleshooting: [
      "Verify the model name is correct (claude-3-haiku-20240307)",
      "Check Anthropic documentation for current models"
    ]
  }
} as const;

export function getDetailedError(error: unknown): string {
  const errorStr = error?.toString() || '';

  if (errorStr.includes('fetch') || errorStr.includes('network')) {
    return ERROR_MESSAGES.CONNECTION_ERROR.message;
  }
  if (errorStr.includes('401') || errorStr.includes('API key')) {
    return ERROR_MESSAGES.API_KEY_ERROR.message;
  }
  if (errorStr.includes('model') || errorStr.includes('404')) {
    return ERROR_MESSAGES.MODEL_ERROR.message;
  }

  return ERROR_MESSAGES.CONNECTION_ERROR.message;
}