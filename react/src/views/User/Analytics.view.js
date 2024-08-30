import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Image } from 'react-bootstrap'
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { format } from 'date-fns';
import { SplitButton } from 'primereact/splitbutton';
import { Dropdown } from 'primereact/dropdown';

import portfolio_image from "../../assets/images/bg-ocean.jpeg";
import Projects from '../_Components/Projects'
import { getProjectByProjectId } from '../../services/projectService';

function Analytics() {

  const navigate = useNavigate();
  const [projectData, setProjectData] = useState([]);

  const { project } = useParams();

  // Pie Chart
  const [pieChartData, setPieChartData] = useState({});
  const [pieChartOptions, setPieChartOptions] = useState({});

  // Line Chart
  const [lineChartData, setLineChartData] = useState({});
  const [lineChartOptions, setLineChartOptions] = useState({});

  // Bar Chart
  const [barChartData, setBarChartData] = useState({});
  const [barChartOptions, setBarChartOptions] = useState({});

  // Year
  const [selectedYear1, setSelectedYear1] = useState(null);
  const [selectedYear2, setSelectedYear2] = useState(null);

  // Category
  const [selectedCategory, setCategory] = useState(null);

  // Location
  const [selectedLocation, setLocation] = useState(null);

  const category = [
    { name: 'Marine', code: 'MR' },
    { name: 'Non-Marine', code: 'NMR' },
    { name: 'Unidentified', code: 'UR' }
  ]

  const year = [
    { name: '2019', code: 'NY' },
    { name: '2020', code: 'RM' },
    { name: '2021', code: 'LDN' },
    { name: '2022', code: 'IST' },
    { name: '2023', code: 'PRS' }
  ];

  const location = [
    { name: 'Tacloban', code: 'NY' },
    { name: 'Manila', code: 'RM' },
    { name: 'Cebu', code: 'LDN' },
    { name: 'Davao', code: 'IST' },
    { name: 'Iloilo', code: 'PRS' }
  ]

  const items = [
    {
      label: 'XLSX',
      icon: 'pi pi-refresh',
      // command: () => {
      //     toast.current.show({ severity: 'success', summary: 'Updated', detail: 'Data Updated' });
      // }
    },
    {
      label: 'TXT',
      icon: 'pi pi-times',
      // command: () => {
      //     toast.current.show({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted' });
      // }
    },
    {
      label: 'PDF',
      icon: 'pi pi-external-link',
      // command: () => {
      //     window.location.href = 'https://reactjs.org/';
      // }
    },
  ];

  useEffect(() => {
    createPieChart();
    createLineChart();
    createBarChart();
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

  const createBarChart = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: '2023',
          backgroundColor: documentStyle.getPropertyValue('--blue-300'),
          borderColor: documentStyle.getPropertyValue('--blue-200'),
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: '2024',
          backgroundColor: documentStyle.getPropertyValue('--yellow-300'),
          borderColor: documentStyle.getPropertyValue('--yellow-200'),
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            fontColor: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            display: false,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };

    setBarChartData(data);
    setBarChartOptions(options);
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
        <h4>Analytics</h4>
      </Row>
      <Row className='px-5 mb-5'>
        <Col className='mx-3'>
          <Row>
            <Card style={{ minWidth: '30rem', maxWidth: '100rem' }}>
              <Card.Body>
                {/* <Card.Title>Project Analytics</Card.Title> */}
                <Card.Text>
                  <div className='d-flex justify-content-between overflow-auto'>
                    <div>
                      <Chart type="pie" data={pieChartData} options={pieChartOptions} className="w-full md:w-15rem" />
                    </div>
                    <div>
                      <Chart type="line" data={lineChartData} options={lineChartOptions} className="" style={{ maxWidth: '60rem', minWidth: '50rem', maxHeight: '15rem' }} />
                    </div>
                  </div>
                  <div className='my-3'>
                    <Chart type="bar" data={barChartData} options={barChartOptions} style={{ maxHeight: '15rem' }} />
                  </div>
                  <div className='mt-5 d-flex justify-content-between'>
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
                  <div className='w-100 my-3 d-flex'>
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
          <Card style={{ minWidth: '15rem', maxWidth: '55rem', overflow: 'auto' }}>
            <Card.Body>
              <Card.Title>Filter</Card.Title>
              <Card.Text className='d-flex flex-column '>
                <div className='d-flex px-2'>
                  <Dropdown value={selectedYear1} onChange={(e) => setSelectedYear1(e.value)} options={year} optionLabel="name"
                    placeholder="Year" className="w-full md:w-10rem" />
                  <div className='mx-2 d-flex flex-wrap align-content-center'>
                    to
                  </div>
                  <Dropdown value={selectedYear2} onChange={(e) => setSelectedYear2(e.value)} options={year} optionLabel="name"
                    placeholder="Year" className="w-full md:w-10rem" />

                </div>
                <div className='d-flex p-2'>
                  <Dropdown value={selectedCategory} onChange={(e) => setCategory(e.value)} options={category} optionLabel="name"
                    placeholder="Category" className="w-full md:w-10rem" />
                </div>
                <div className='d-flex px-2'>
                  <Dropdown value={selectedLocation} editable onChange={(e) => setLocation(e.value)} options={location} optionLabel="name"
                    placeholder="Location" className="w-full md:w-10rem" />
                </div>
              </Card.Text>
              <SplitButton label="Download" icon="pi pi-plus" model={items} />
            </Card.Body>
          </Card>
        </Col>


      </Row>
      <Row className='mb-5'>

      </Row>
    </Container>
  )
}

export default Analytics