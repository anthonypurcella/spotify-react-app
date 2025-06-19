import React from 'react';

function SearchResults({songResults}) {

        return (
            <>
            <div>
                <h1>Results</h1>
                {songResults}
            </div>
            </>
        );
}

export default SearchResults;