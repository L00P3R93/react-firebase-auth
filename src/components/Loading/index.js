import React from 'react'

import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

const Loading = () => (
    <Button variant="primary" disabled>
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
        <span>Loading...</span>
    </Button>
)

export default Loading;