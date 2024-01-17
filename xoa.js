Object.entries(newSearchOption.broader).forEach(([oriTerm, extendArray], index) => {
    if (newSearchResult.broader.hasOwnProperty(oriTerm)) {
        extendArray.forEach((extendTerm, index) => {
            newSearchResult = {
                ...newSearchResult,
                broader: {
                    ...newSearchResult.broader,
                    [oriTerm]: newSearchResult.broader[oriTerm].filter(newItem => newItem != extendTerm)
                }
            }
        })
    }
})
Object.entries(newSearchOption.related).forEach(([oriTerm, extendArray], index) => {
    if (newSearchResult.related.hasOwnProperty(oriTerm)) {
        extendArray.forEach((extendTerm, index) => {
            newSearchResult = {
                ...newSearchResult,
                related: {
                    ...newSearchResult.related,
                    [oriTerm]: newSearchResult.related[oriTerm].filter(newItem => newItem != extendTerm)
                }
            }
        })
    }
})
Object.entries(newSearchOption.narrower).forEach(([oriTerm, extendArray], index) => {
    if (newSearchResult.narrower.hasOwnProperty(oriTerm)) {
        extendArray.forEach((extendTerm, index) => {
            newSearchResult = {
                ...newSearchResult,
                narrower: {
                    ...newSearchResult.narrower,
                    [oriTerm]: newSearchResult.narrower[oriTerm].filter(newItem => newItem != extendTerm)
                }
            }
        })
    }
})