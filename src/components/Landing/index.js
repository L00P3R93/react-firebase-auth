import React from "react";
import { Link } from "react-router-dom";

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

import Footer from '../Footer'
import * as ROUTES from '../../constants/routes';

import './styles.css';

const features = [
    {
        title: 'Feature 1',
        text: 'Describe feature 1 of your app here. Use powerful language to engage users.',
        link: ROUTES.LANDING
    },
    {
        title: 'Feature 2',
        text: 'Describe feature 2 of your app here. Highlight the benefits and advantages.',
        link: ROUTES.LANDING
    },
    {
        title: 'Feature 3',
        text: 'Feature 3 description goes here. Explain how this feature adds value.',
        link: ROUTES.LANDING
    }
]

const LandingPage = () => (
    <div>
        {/* Hero Section */}
        <div className="hero-section text-center">
            <Container>
                <h1>Welcome to Your App</h1>
                <p>Your app's tagline goes here. Describe what your app is about.</p>
                <Button variant="primary">Get Started</Button>
            </Container>
        </div>

        {/* Feature Section */}
        <Container className="my-5">
            <h2 className="text-center mb-4">Key Features</h2>
            <Row>
                {features.map((feature) => (
                    <Col md={4}>
                        <CardBase
                            key={feature.title}
                            title={feature.title}
                            text={feature.text}
                            link={feature.link}
                        />
                    </Col>
                )) }
            </Row>
        </Container>

        {/* Call-to-Action Section */}
        <div className="cta-section text-center text-white">
            <Container>
                <h2>Ready to get started?</h2>
                <p>Join thousands of users who are already benefiting from our app.</p>
                <Button variant="light" as={Link} to={ROUTES.SIGN_UP}>Sign Up Now</Button>
            </Container>
        </div>

        <Footer />
    </div>
)


const CardBase = ({ title, text, link }) => {
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text>{text}</Card.Text>
                <Card.Link as={Link} to={ROUTES.LANDING}>View More</Card.Link>
            </Card.Body>
        </Card>
    );
}

export default LandingPage;