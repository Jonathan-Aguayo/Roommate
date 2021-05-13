import {IssueList} from './IssueList.jsx';
import {IssueEdit} from './IssueEdit.jsx'
import IssueAdd from './IssueAdd.jsx'
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter,
    Switch,
    Route,
    Link

} from 'react-router-dom';

const contentNode = document.getElementById('contents');
const noMatch = () => <p>Page Not Found</p>

const RoutedApp = () =>(
    <BrowserRouter>
        <Switch>
            <Route exact path = '/edit' component={IssueEdit}/>
            <Route exact path='/auth/google/success' component={IssueList}/>
            <Route exact path='/' component={IssueList}/>
            <Route path='*' component = {noMatch}/>
        </Switch>
    </BrowserRouter>
)

ReactDOM.render(<RoutedApp/>, contentNode);

if (module.hot) 
{   
    module.hot.accept();
}