import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';

interface UserDashProps extends RouteComponentProps{
    // No additional props
}

const UserDash:FunctionComponent<UserDashProps> = (props: UserDashProps) => {

    return (
        <p>Please wait...</p>
    )
};

export default UserDash;