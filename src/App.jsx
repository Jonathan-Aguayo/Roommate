import 'babel-polyfill';
import React from 'react';
import Template from './Template.jsx'
import ReactDOM from 'react-dom';
import {
    BrowserRouter,
    Route,
    Switch,
    withRouter,
    Redirect
} from 'react-router-dom'; 
import CreateCalendar from './households/CreateHousehold.jsx';
import ListHouseholds from './households/ListHouseholds.jsx';
import DeleteCalendar from './households/DeleteHousehold.jsx';
import {AddTask} from './households/AddTask.jsx';
import {AddMessage} from './messages/AddMessage.jsx';
import Mainview from './Mainview.jsx'
import InviteUser from './households/InviteUser.jsx'
import Public from './households/Public.jsx'
import JoinHouseHold from './households/JoinHousehold.jsx'
import CreateGroup from './households/CreateGroup.jsx'
import AddChore from './households/addChore.jsx'
import AssignChores from './households/AssignChores.jsx'
const contentNode = document.getElementById('contents');
const NoMatch = () => <p>Page Not Found</p>

const RoutedApp = () =>(
<BrowserRouter>
    <Template>
        <Switch>
            <Redirect exact from='/' to='/home'/>
            <Route path='/tasks'><h1>tasks</h1></Route>
            <Route path='/home' component={Mainview}/>
            <Route path='/public' component={Public}/>
            <Route path='/list' component={ListHouseholds}/>
            <Route path='/delete' component={DeleteCalendar}/>
            <Route path='/join' component={JoinHouseHold}/>
            <Route path='/invite' component={InviteUser}/>
            <Route path='/createHousehold' component={CreateCalendar}/>
            <Route path='/createGroup' component={CreateGroup}/>
            <Route exact path='/addTask' component={AddTask}/>
            <Route exact path='/assign' component={AssignChores}/>
            <Route exact path='/addChore' component={AddChore}/>
            <Route exact path='/addMessage' component={AddMessage}/>
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