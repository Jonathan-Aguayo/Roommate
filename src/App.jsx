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
import CreateCalendar from './Settings/CreateHousehold.jsx';
import ListHouseholds from './households/ListHouseholds.jsx';
import {AddTask} from './households/AddTask.jsx';
import {AddMessage} from './messages/AddMessage.jsx';
import Mainview from './Mainview.jsx'
import InviteUser from './households/InviteUser.jsx'
import Public from './households/Public.jsx'
import JoinHouseHold from './households/JoinHousehold.jsx'
import CreateGroup from './Settings/CreateGroup.jsx'
import AssignChores from './households/AssignChores.jsx'
import Settings from './Settings/Settings.jsx'
import 'whatwg-fetch';
const contentNode = document.getElementById('contents');
const NoMatch = () => <p>Page Not Found</p>
export const UserContext = React.createContext();

const RoutedApp = () =>{
    const [user, setUser] = React.useState();
    const providorValue = React.useMemo( () => ({ user, setUser }), [user]);

    React.useEffect( () =>
    {
        getUser()
    },[]);

    
  const getUser = () =>
    {
        fetch('/api/v1/user/')
        .then(res => 
        {
            if(res.ok)
            {   
                res.json().then(message => 
                {
                    setUser(message.message);
                })
            }  
            else
            {
                setUser(null);
            } 
        })
    };

    return(
    <BrowserRouter>
            <UserContext.Provider value = {providorValue}>
            <Template>
                <Switch>
                    <Redirect exact from='/' to='/home'/>
                    <Route path='/tasks'><h1>tasks</h1></Route>
                    <Route path='/home' component={Mainview}/>
                    <Route path='/public' component={Public}/>
                    <Route path='/list' component={ListHouseholds}/>
                    <Route path='/join' component={JoinHouseHold}/>
                    <Route path='/invite' component={InviteUser}/>
                    <Route path='/createHousehold' component={CreateCalendar}/>
                    <Route path='/createGroup' component={CreateGroup}/>
                    <Route exact path='/addTask' component={AddTask}/>
                    <Route exact path='/assign' component={AssignChores}/>
                    <Route exact path = '/settings' component={Settings}/>
                    <Route exact path='/addMessage' component={AddMessage}/>
                    <Route path='*' component={NoMatch}></Route>
                </Switch>
            </Template>
            </UserContext.Provider>

    </BrowserRouter>

)}

ReactDOM.render(<RoutedApp/>, contentNode);

if (module.hot) 
{   
    module.hot.accept();
}