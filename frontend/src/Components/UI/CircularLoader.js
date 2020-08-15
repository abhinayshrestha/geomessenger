import React from 'react'
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';

function CircularLoader() {

    const LoaderContainer = styled.div`
         display : flex;
         flex : 1;
         align-items : center;
         justify-content : center;
    `

    const StyledCircularLoader = styled(CircularProgress)`
                &&& {
                    color: #6798e5;
                }
        `

    return (
        <LoaderContainer>
              <StyledCircularLoader />
        </LoaderContainer>
    )
}

export default CircularLoader
