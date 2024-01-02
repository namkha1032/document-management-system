// import packages
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { useEffect } from "react"
// import my components
import Bread from "../../components/Bread/Bread"
// import ui components
import { Typography } from "antd"
// import icons
// import apis
import { getSearchResult } from "../../apis/searchApi"
// import hooks
// import functions
//////////////////////////////////////////////////////////////////////////////////////////////////////

const Page_Search = () => {
    // props
    // states
    // hooks
    const queryClient = useQueryClient()
    useEffect(() => {
        console.log("searchOption: ", searchOption)
        if (searchOption) {
            searchMutation.mutate(searchOption)
        }
        return () => {
            // queryClient.setQueryData(['')
        }
    }, [])
    // queries
    // mutations
    const searchMutation = useMutation({
        mutationFn: getSearchResult,
        onSuccess: (response) => {
            queryClient.setQueryData(['searchResult'], response)
        }
    })
    // functions
    // logics
    const searchOption = queryClient.getQueryData(['searchOption'])
    const searchResult = queryClient.getQueryData(['searchResult'])
    console.log("searchResult: ", searchResult)
    console.log("searchMutation: ", searchMutation)
    // HTMl
    return (
        <>
            <Bread title={"Search"} />
            {searchMutation.isPending
                ?
                <Typography.Text>loading...</Typography.Text>
                :
                (searchResult
                    ?
                    searchResult.documents.map(searchItem =>
                        <>
                            <Typography.Text>{searchItem.title}</Typography.Text>
                        </>)
                    :
                    null
                )


            }
        </>
    )
}

export default Page_Search