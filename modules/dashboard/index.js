import ParseDashboard from 'parse-dashboard';

const port = process.env.PORT || 9090;

// Configure ParseDashboard
const dashboard = new ParseDashboard({
    apps: [
        {
            serverURL: process.env.PARSE_SERVER_URL || `http://localhost:${port}/parse`,
            appId: process.env.PARSE_SERVER_APPLICATION_ID || 'saturn-id',
            masterKey: process.env.PARSE_SERVER_MASTER_KEY || 'saturn-master-key',
            appName: process.env.APP_NAME || 'Saturn'
        }
    ],
    users: [
        {
            user: process.env.DASHBOARD_USER || 'saturn',
            pass: process.env.DASHBOARD_PASSWORD || 'password'
        }
    ],
    trustProxy: 1
});

export default dashboard;
