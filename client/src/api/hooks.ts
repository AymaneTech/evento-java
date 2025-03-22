import { useState, useEffect, useCallback } from 'react';
import { AxiosError, AxiosRequestConfig } from 'axios';
import apiClient from './axios';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | AxiosError | null;
}

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error | AxiosError) => void;
  immediate?: boolean;
}

export function useApi<T = any>(
  url: string,
  options: UseApiOptions = {},
  config: AxiosRequestConfig = {}
) {
  const { onSuccess, onError, immediate = true } = options;
  
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const fetchData = useCallback(async (payload?: any) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const method = config.method?.toLowerCase() || 'get';
      let response;
      
      if (method === 'get') {
        response = await apiClient.get<T>(url, config);
      } else if (method === 'post') {
        response = await apiClient.post<T>(url, payload, config);
      } else if (method === 'put') {
        response = await apiClient.put<T>(url, payload, config);
      } else if (method === 'delete') {
        response = await apiClient.delete<T>(url, config);
      } else {
        response = await apiClient.request<T>({
          ...config,
          url,
          data: payload,
        });
      }
      
      setState({ data: response.data, loading: false, error: null });
      onSuccess?.(response.data);
      return response.data;
    } catch (error) {
      const err = error as Error | AxiosError;
      setState({ data: null, loading: false, error: err });
      onError?.(err);
      throw err;
    }
  }, [url, config, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate]);

  return {
    ...state,
    fetch: fetchData,
    refetch: fetchData,
  };
}

export function useApiMutation<T = any, P = any>(
  url: string,
  options: UseApiOptions = {},
  config: AxiosRequestConfig = {}
) {
  const { onSuccess, onError } = options;
  
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(async (payload?: P) => {
    setState({ data: null, loading: true, error: null });
    
    try {
      const method = config.method || 'post';
      const response = await apiClient.request<T>({
        ...config,
        method,
        url,
        data: payload,
      });
      
      setState({ data: response.data, loading: false, error: null });
      onSuccess?.(response.data);
      return response.data;
    } catch (error) {
      const err = error as Error | AxiosError;
      setState({ data: null, loading: false, error: err });
      onError?.(err);
      throw err;
    }
  }, [url, config, onSuccess, onError]);

  return {
    ...state,
    mutate,
  };
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await apiClient.get('/auth/me');
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return {
    isAuthenticated,
    isLoading,
  };
}
