import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";

export class BusinessError extends Error {
	constructor(
		public code: string,
		public message: string
	) {
		super(message);
		this.name = "BusinessError";
	}
}

export class HttpClient {
	private static instances: Map<string, HttpClient> = new Map();
	private axiosInstance: AxiosInstance;

	private constructor(baseURL: string) {
		this.axiosInstance = axios.create({
			baseURL,
			withCredentials: true,
		});
		this.setupInterceptors();
	}

	public static getInstance(baseURL: string, name: string = "default"): HttpClient {
		if (!HttpClient.instances.has(name)) {
			HttpClient.instances.set(name, new HttpClient(baseURL));
		}
		return HttpClient.instances.get(name)!;
	}

	private setupInterceptors(): void {
		this.axiosInstance.interceptors.request.use(
			(config: InternalAxiosRequestConfig) => config,
			(error: unknown) => Promise.reject(error)
		);

		this.axiosInstance.interceptors.response.use(
			(response: AxiosResponse) => response,
			(error: unknown) => {
				if (axios.isAxiosError(error) && error.response) {
					return Promise.reject(
						new BusinessError(String(error.response.status), error.response.data?.message ?? "Error de red")
					);
				}
				return Promise.reject(
					new BusinessError("NETWORK_ERROR", error instanceof Error ? error.message : "Error desconocido")
				);
			}
		);
	}

	public async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		return this.axiosInstance.get<T>(url, config);
	}

	public async post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		return this.axiosInstance.post<T>(url, data, config);
	}

	public async put<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		return this.axiosInstance.put<T>(url, data, config);
	}

	public async patch<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		return this.axiosInstance.patch<T>(url, data, config);
	}

	public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		return this.axiosInstance.delete<T>(url, config);
	}
}

export const apiClient = HttpClient.getInstance("", "main");
