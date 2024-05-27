// import packages
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import apis
import { apiGetSearchResult } from "../apis/searchApi";

function useSearchMutation() {
    // import hooks
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: apiGetSearchResult,
        onSuccess: (response) => {
            queryClient.setQueryData(['searchResult'], response)
        }
    })
}

export default useSearchMutation