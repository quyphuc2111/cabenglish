import { fetchFilterData } from "@/actions/filterAction";

export const FilterService = {
    async fetchFilterData(userId: string) {
        try {
            const response = await fetchFilterData({ userId });
            return {
                initialFilterData: response,
                fetchFilterData: fetchFilterData
            }
           
        } catch (error) {
            console.error("Error fetching filter data:", error);
            throw error;
        }
    }
}
