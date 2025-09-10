import { db } from '../services/firebase';

/**
 * Retry mechanism for Firestore operations
 * Helps handle temporary connection issues
 */
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.warn(`Firestore operation failed (attempt ${attempt}/${maxRetries}):`, error);
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff
      const waitTime = delay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError!;
};

/**
 * Check if the error is a connection-related error
 */
export const isConnectionError = (error: any): boolean => {
  if (!error) return false;
  
  const errorMessage = error.message?.toLowerCase() || '';
  const errorCode = error.code?.toLowerCase() || '';
  
  return (
    errorCode.includes('unavailable') ||
    errorCode.includes('deadline_exceeded') ||
    errorCode.includes('internal') ||
    errorMessage.includes('transport errored') ||
    errorMessage.includes('connection') ||
    errorMessage.includes('network')
  );
};

/**
 * Enhanced error logging for Firestore operations
 */
export const logFirestoreError = (operation: string, error: any) => {
  console.error(`Firestore ${operation} failed:`, {
    message: error.message,
    code: error.code,
    isConnectionError: isConnectionError(error),
    timestamp: new Date().toISOString()
  });
};
