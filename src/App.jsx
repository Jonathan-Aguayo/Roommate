import 'babel-polyfill';
import React from 'react';
import Template from './Template.jsx'
import ReactDOM from 'react-dom';
import {
    BrowserRouter,
    Switch,
    Route,
    withRouter,
    Redirect
} from 'react-router-dom'; 
import CreateCalendar from './households/CreateHousehold.jsx';
import ListHouseholds from './households/ListHouseholds.jsx';
import DeleteCalendar from './households/DeleteHousehold.jsx';
import {AddTask} from './households/AddTask.jsx';

const contentNode = document.getElementById('contents');
const NoMatch = () => <p>Page Not Found</p>

const RoutedApp = () =>(
<BrowserRouter>
    <Template>
        <Switch>
            <Redirect exact from='/' to='/home'/>
            <Route path='/tasks'><h1>tasks</h1></Route>
            <Route path='/home' component={CreateCalendar}/>
            <Route path='/list' component={ListHouseholds}/>
            <Route path='/delete' component={DeleteCalendar}/>
            <Route path='/add' component={AddTask}/>
            <Route path='*' component={NoMatch}></Route>
        </Switch>
    </Template>
</BrowserRouter>
)

ReactDOM.render(<RoutedApp/>, contentNode);

if (module.hot) 
{   
    module.hot.accept();
}