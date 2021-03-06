import React, { FunctionComponent } from 'react';


type AlertProps = {
    message: string
};


const AlertBanner: FunctionComponent<AlertProps> = ({message}) => <div data-testid="alert-banner" id="alert-banner">{message}</div>;


export default AlertBanner;
