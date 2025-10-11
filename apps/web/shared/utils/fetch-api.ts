export function createFetchApi(baseURL: string) {
	return async <T>(url: string): Promise<T> => {
		const response = await fetch(`${baseURL}${url}`);
		return response.json();
	};
}
