import {IssueList} from './IssueList.jsx';
import IssueEdit from './IssueEdit.jsx';
import IssueAdd from './IssueAdd.jsx';
import Template from './Template.jsx'
import Success from './loginSuccess.jsx'
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Homepage.jsx';
import {
    BrowserRouter,
    Switch,
    Route,
    withRouter,
    Redirect
} from 'react-router-dom'; 

const contentNode = document.getElementById('contents');
const NoMatch = () => <p>Page Not Found</p>

const RoutedApp = () =>(
    <BrowserRouter>
        <Template >
            <Switch>
                <Redirect exact from='/' to ='issues'/>
                <Route path = '/edit/:id' component={withRouter(IssueEdit)}></Route>
                <Route path = '/auth/google/success'> <Success/> </Route>
                <Route path = '/issues' component={withRouter(IssueList)}/>
                <Route path = '/home' component = {withRouter(Home)}/>
                <Route path='*'> <NoMatch/> </Route>
            </Switch>
        </Template>
    </BrowserRouter>
)

ReactDOM.render(<RoutedApp/>, contentNode);

if (module.hot) 
{   
    module.hot.accept();
}