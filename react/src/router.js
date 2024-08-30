import React from 'react'
import { createBrowserRouter } from 'react-router-dom'

//Layouts
import UserLayout from './views/_Layouts/UserLayout';
import AdminLayout from './views/_Layouts/AdminLayout';

//views
//guest
import Landing from './views/Guest/Landing.view';

//users
import Dashboard from './views/User/Dashboard.view';
import Charter from './views/User/Charter.view';
import Portfolio from './views/User/Portfolio.view';
import ProjectDetails from './views/User/ProjectDetails.view';
import Analytics from './views/User/Analytics.view';
import NetworkMap from './views/User/NetworkMap.view';

//admin
import AdminAnalytics from './views/Admin/AdminAnalytics.view';
import AdminUsersList from './views/Admin/AdminUsersList.view';
import AdminProjectsList from './views/Admin/AdminProjectsList.view';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Landing />
    },

    {
        path: '/user',
        element: <UserLayout />,
        children: [
            {
                path: '/user/dashboard',
                element: <Dashboard />
            },

            {
                path: '/user/charter/:project?',
                element: <Charter />
            },

            {
                path: '/user/portfolio',
                element: <Portfolio />
            },

            {
                path: '/user/portfolio/:project',
                element: <ProjectDetails />
            },

            {
                path: '/user/analytics',
                element: <Analytics />
            },

            {
                path: '/user/network-map',
                element: <NetworkMap />
            }
        ]
    },

    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            {
                path: '/admin/analytics',
                element: <AdminAnalytics />
            },

            {
                path: '/admin/users',
                element: <AdminUsersList />
            },

            {
                path: '/admin/projects',
                element: <AdminProjectsList />
            }
        ]
    }
]);

export default router;