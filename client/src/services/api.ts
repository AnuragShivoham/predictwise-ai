import type { AnalyzeResponse, PredictionsResponse, ApiError } from '@/types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: ApiError;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: 'Request failed', message: response.statusText };
      }
      throw new Error(errorData.message || errorData.error || 'Request failed');
    }
    return response.json();
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${this.baseUrl}/api/health`);
    return this.handleResponse(response);
  }

  async analyze(formData: FormData): Promise<AnalyzeResponse> {
    const response = await fetch(`${this.baseUrl}/api/analyze`, {
      method: 'POST',
      body: formData,
    });
    return this.handleResponse(response);
  }

  async getPredictions(subjectCode: string): Promise<PredictionsResponse> {
    const response = await fetch(`${this.baseUrl}/api/predictions/${subjectCode}`);
    return this.handleResponse(response);
  }

  async getAllSubjects(): Promise<{ success: boolean; subjects: Array<{ subjectCode: string; lastAnalyzed: string; analysisCount: number }> }> {
    const response = await fetch(`${this.baseUrl}/api/predictions`);
    return this.handleResponse(response);
  }
}

export const api = new ApiClient(API_BASE);
export default api;
