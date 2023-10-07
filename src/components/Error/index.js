import React from 'react'

import Alert from 'react-bootstrap/Alert';

const ErrorMessage = ({ error }) => {
    const [show, setShow] = React.useState(true);

    if(show){
        return (
            <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <p>
                    {error.message}
                </p>
            </Alert>
        )
    }
}

export default ErrorMessage;
