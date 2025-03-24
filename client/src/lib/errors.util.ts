export const parseApiError = (error: string | null): string | null => {
  if (!error) return null;

  try {
    const errorObj = JSON.parse(error);

    if (errorObj.errors) {
      if (typeof errorObj.errors === 'string') {
        return errorObj.errors;
      }

      if (typeof errorObj.errors === 'object') {
        return Object.entries(errorObj.errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(', ');
      }
    }

    return errorObj.message || error;
  } catch (e) {
    return error;
  }
}
