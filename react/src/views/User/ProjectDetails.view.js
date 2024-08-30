import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Image } from 'react-bootstrap'
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { format } from 'date-fns';


import portfolio_image from "../../assets/images/bg-ocean.jpeg";
import Projects from '../_Components/Projects'
import { getProjectByProjectId } from '../../services/projectService';

function ProjectDetails() {

  const navigate = useNavigate();
  const [projectData, setProjectData] = useState([]);

  const { project } = useParams();

  // Pie Chart
  const [pieChartData, setPieChartData] = useState({});
  const [pieChartOptions, setPieChartOptions] = useState({});

  // Line Chart
  const [lineChartData, setLineChartData] = useState({});
  const [lineChartOptions, setLineChartOptions] = useState({});

  useEffect(() => {
    createPieChart();
    createLineChart();
    fetchProjectData();
  }, [project]);

  const createPieChart = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const data = {
      labels: ['Marine', 'Unidentified', 'Non-Marine'],
      datasets: [
        {
          data: [592, 23, 320],
          backgroundColor: [
            documentStyle.getPropertyValue('--blue-300'),
            documentStyle.getPropertyValue('--gray-500'),
            documentStyle.getPropertyValue('--yellow-300')
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--blue-200'),
            documentStyle.getPropertyValue('--gray-400'),
            documentStyle.getPropertyValue('--yellow-200')
          ]
        }
      ]
    }
    const options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true
          }
        }
      }
    };

    setPieChartData(data);
    setPieChartOptions(options);
  }

  const createLineChart = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: '2023',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-300'),
          tension: 0.4
        },
        {
          label: '2024',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--yellow-300'),
          tension: 0.4
        }
      ]
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        }
      }
    };

    setLineChartData(data);
    setLineChartOptions(options);
  }


  const fetchProjectData = async () => {
    const data = await getProjectByProjectId(project);
    setProjectData(data);
    console.log(data);
  }

  const secondsToHms = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    return [h, m, s]
      .map(v => v < 10 ? "0" + v : v)
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
  }

  const dateConvert = (date) => {
    if (date === undefined) {
      return '';
    }
    return format(new Date(date), 'MMM dd, yyyy');
  }

  return (
    <Container fluid className="vh-100 overflow-auto">
      <Row className='px-5 pt-5'>
        <h4>{`Portfolio > ${project}`}</h4>
      </Row>
      <Row className='px-5 mb-5'>
        <Col className='mx-3'>
          <Row>
            <Card style={{ minWidth: '30rem', maxWidth: '100rem' }}>
              <Card.Body>
                <Card.Title>Project Analytics</Card.Title>
                <Card.Text>
                  <div className='d-flex justify-content-between overflow-auto'>
                    <div>
                      <Chart type="pie" data={pieChartData} options={pieChartOptions} className="w-full md:w-15rem" />
                    </div>
                    <div>
                      <Chart type="line" data={lineChartData} options={lineChartOptions} className="" style={{maxWidth: '60rem', minWidth:'50rem', maxHeight: '15rem'}}/>
                    </div>
                  </div>
                  {/* <div className='my-2 d-flex justify-content-between'>
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
                  </div> */}
                  <div className='w-100 pt-5 d-flex'>
                    <div className='text-truncate d-flex justify-between w-100 flex-column'>
                      <div>
                        OBJECTS SCANNED
                      </div>
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
                      <div className='d-flex'>
                        <div className='w-100'>
                          Total
                        </div>
                        <div>
                          935
                        </div>
                      </div>
                    </div>
                    <div className='mx-3'>
                      <DataTable>
                        <Column field="scan" header="Scanned"></Column>
                        <Column field="cf" sortable header="Confidence"></Column>
                      </DataTable>
                    </div>
                  </div>
                </Card.Text>
                <Card.Link onClick={() => navigate('/user/analytics')} className='text-decoration-none clickable'>REVIEW SCANNED OBJECTS</Card.Link>
              </Card.Body>
            </Card>
          </Row>
        </Col>
        <Col xs={3}>
          <Card style={{ minWidth: '15rem', maxWidth: '55rem' }}>
            <Card.Body>
              <Card.Title>Project Details</Card.Title>
              <Card.Text className='d-flex flex-column align-items-center'>
                <div className='w-100'>
                  {/* <Image src="https://via.placeholder.com/350x200" className='w-100' rounded /> */}
                  <Image src={portfolio_image} className='w-100' rounded />
                </div>
                <div className='w-100 d-flex flex-column p-2'>
                  <div className='d-flex justify-content-between'>
                    <div>
                      Project Name:
                    </div>
                    {projectData.name}
                  </div>
                  <div className='d-flex justify-content-between'>
                    <div>
                      Location:
                    </div>
                    {projectData.location}
                  </div>
                  <div className='d-flex justify-content-between'>
                    <div>
                      Elapsed Time:
                    </div>
                    {secondsToHms(projectData.project_duration)}
                  </div>
                  <div className='d-flex justify-content-between text-truncate'>
                    <div>
                      Date Created:
                    </div>
                    {dateConvert(projectData.created_at)}
                  </div>
                </div>
              </Card.Text>
              <Card.Link onClick={() => {
                navigate(`/user/charter/${project}`);
                localStorage.setItem("project", project);
              }} className='text-decoration-none clickable'>OPEN IN CHARTER</Card.Link>
            </Card.Body>
          </Card>
        </Col>


      </Row>
      <Row className='mb-5'>

      </Row>
    </Container>
  )
}

export default ProjectDetails;