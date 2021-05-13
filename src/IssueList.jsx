import IssueAdd from './IssueAdd.jsx';
import {IssueFilter} from './IssueFilter.jsx';
import React from 'react';
import 'whatwg-fetch';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import {IconButton} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
 
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export class IssueRow extends React.Component 
{
    constructor(props)
    {
        super();
        this.props = props;
        this.deleteIssue = this.deleteIssue.bind(this);
    }
    
    deleteIssue()
    {
        const issueId = this.props.issue._id
        fetch(`/api/v1/issues/${issueId}`, 
        {method: 'DELETE',
        headers: {'Content-Type': 'application/json '}
        }
        ).then(response => {
            if(response.ok){
                alert('successfully deleted issue: '+ this.props.issue._id)
            }
        })
        .catch(err => {
            console.log(err);
        })
    }
    
    
    render()
    {
    return(
    <TableRow>
        <TableCell><IconButton color='secondary' onClick={this.deleteIssue}> <Delete/> </IconButton></TableCell>
        <TableCell>{this.props.issue._id}</TableCell>
        <TableCell>{this.props.issue.status}</TableCell>
        <TableCell>{this.props.issue.owner}</TableCell>
        <TableCell>{this.props.issue.created.toDateString()}</TableCell>
        <TableCell>{this.props.issue.effort}</TableCell>
        <TableCell>{this.props.issue.completionDate ?
        props.issue.completionDate.toDateString() : ''}</TableCell>
        <TableCell>{this.props.issue.title}</TableCell>
    </TableRow>
    );  
    } 
}

const IssueTable = (props) =>
{
    const classes = useStyles();
    const issueRows = props.issues.map(issue => <IssueRow key={issue.id} issue={issue}/>)
    return (
        <TableContainer component={Paper}>
            <Table className = {classes.table} aria-label='Simple Table'>
                <TableHead>
                    <TableRow>
                        <TableCell component="th" scope="row"> Delete </TableCell>
                        <TableCell component="th" scope="row"> ID </TableCell>
                        <TableCell component="th" scope="row"> Status </TableCell>
                        <TableCell component="th" scope="row"> Owner </TableCell>
                        <TableCell component="th" scope="row"> Created </TableCell>
                        <TableCell component="th" scope="row"> Effort </TableCell>
                        <TableCell component="th" scope="row"> Completion Date </TableCell>
                        <TableCell component="th" scope="row"> Title </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {issueRows}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export class IssueList extends React.Component
{
    constructor()
    {
        super();
        this.state = {issues: new Array()};
        this.createIssue = this.createIssue.bind(this);
    }

    componentDidMount()
    {
        this.loadData();
    }

    loadData()
    {
        fetch('/api/v1/issues').then(response => 
            response.json()).then(data => 
            {
                console.log("Total count of records:", data._metadata.total_count);
                data.records.forEach(issue => 
                    {
                        issue.created = new Date(issue.created);
                        if (issue.completionDate)
                            issue.completionDate = new Date(issue.completionDate);
                    });
                    this.setState({ issues:data.records });
            }).catch(err => 
                {
                    console.log(err);
                })
    }


    createIssue(newIssue)
    {
        fetch('/api/v1/issues', 
        {method: 'POST',
        headers: {'Content-Type': 'application/json '},
        body: JSON.stringify(newIssue),
        }).then(response => {
            if(response.ok) {
                response.json().then(updatedIssue => {updatedIssue.created = new Date(updatedIssue.created);
                if (updatedIssue.completionDate)
                    updatedIssue.completionDate = new Date (updatedIssue.completionDate);
                const newIssues = this.state.issues.concat(updatedIssue);
                this.setState({ issues: newIssues });
                });
            }
            else{
                response.json().then(error => {alert('Failed to add issue: ' + error.message)
                });
            }
        }).catch(err => {alert('Error in sending data to server: ' + err.message)});
    }
 

    render()
    {
        return(
            <div>
                <h1> Issue Tracker</h1>
                <IssueFilter/>
                <IssueTable issues = {this.state.issues}/>
                <IssueAdd createIssue = {this.createIssue}/>
                <hr/>
            </div>
        );
    }
}