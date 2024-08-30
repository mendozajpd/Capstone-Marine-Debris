import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Image } from 'react-bootstrap'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import Projects from '../_Components/Projects'

function Dashboard() {

  const navigate = useNavigate();

  return (
    <Container fluid className="vh-100 overflow-auto">
      <Row className='px-5 pt-5'>
        <h4>Dashboard</h4>
      </Row>
      <Row className='px-5 mb-5'>
        <Col>
          <Card style={{ minWidth: '30rem', maxWidth: '55rem' }}>
            <Card.Body>
              <Card.Title>Recent Project</Card.Title>
              <Card.Text className='d-flex flex-column align-items-center'>
                <div className='w-100'>
                  <Image src="https://via.placeholder.com/350x200" className='w-100' rounded />
                </div>
                <div className='w-100 d-flex flex-column p-2'>
                  <strong>
                    My Project Name
                  </strong>
                  <div>
                    Location: Tacloban
                  </div>
                  <div>
                    Elapsed Time: 2h 10m 25s
                  </div>
                  <div>
                    Last Opened: 6:23 AM
                  </div>
                </div>
                <strong>
                  <p>OBJECTS SCANNED</p>
                </strong>
                <div className='d-flex w-100 align-items-center justify-content-around'>
                  <div className='text-truncate'>
                    <h2 className='m-0 display-6'>
                      39
                    </h2>
                    Marine
                  </div>
                  <div className='text-truncate'>
                    <h2 className='m-0 display-6'>
                      3
                    </h2>
                    Non-Marine
                  </div>
                  <div className='text-truncate'>
                    <h2 className='m-0 display-6'>
                      7
                    </h2>
                    Unidentified
                  </div>
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col className='mx-3'>
          <Row>
            <Card style={{ minWidth: '30rem', maxWidth: '55rem' }}>
              <Card.Body>
                <Card.Title>User Analytics</Card.Title>
                <Card.Text>
                  <div className='my-2 d-flex justify-content-between'>
                    <div className=''>
                      TOTAL PROJECTS
                      <h2 className='m-0 display-6'>
                        39
                      </h2>
                    </div>
                    <div className=''>
                      PUBLISHED PROJECTS
                      <h2 className='m-0 display-6'>
                        6
                      </h2>
                    </div>
                  </div>
                  <p>TOTAL OBJECTS SCANNED</p>
                  <div className='w-100'>
                    <div className='text-truncate d-flex justify-between w-100 flex-column'>
                      <div className='d-flex'>
                        <div className='w-100'>
                          Marine
                        </div>
                        <div>
                          592
                        </div>
                      </div>
                      <div className='d-flex'>
                        <div className='w-100'>
                          Non-Marine
                        </div>
                        <div>
                          320
                        </div>
                      </div>
                      <div className='d-flex'>
                        <div className='w-100'>
                          Unidentified
                        </div>
                        <div>
                          23
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Text>
                <Card.Link onClick={() => navigate('/user/analytics')} className='text-decoration-none clickable'>GO TO ANALYTICS</Card.Link>
              </Card.Body>
            </Card>
          </Row>
          <Row className='my-3'>
            <Card style={{ minWidth: '30rem', maxWidth: '55rem'}}>
              <Card.Body>
                <Card.Title>Portfolio</Card.Title>
                <Card.Text className='overflow-hidden'>
                  <div style={{height: '20vh'}} className='overflow-auto'>
                    <Projects onRowClick={() => {}} />
                  </div>
                </Card.Text>
                <Card.Link onClick={() => navigate('/user/charter')} className='text-decoration-none clickable'>CREATE NEW PROJECT</Card.Link>
                <Card.Link onClick={() => navigate('/user/portfolio')} className='text-decoration-none clickable'>GO TO PORTFOLIO</Card.Link>
              </Card.Body>
            </Card>
          </Row>

        </Col>
        {/* 3rd Column maybe */}
        {/* <Col>
          <Card style={{ minWidth: '18rem' }}>
            <Card.Body>
              <Card.Title>Card Title</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
              <Card.Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Card.Text>
              <Card.Link href="#">Card Link</Card.Link>
              <Card.Link href="#">Another Link</Card.Link>
            </Card.Body>
          </Card>
        </Col> */}
      </Row>
      <Row className='mb-5'>

      </Row>
    </Container>
  )
}

export default Dashboard